import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {GOOGLE_MAP_API_KEY, DOMAIN_IP, API_FOLDER_NAME} from "@env";
import axios from 'axios';

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const dmsToDecimal = (dms) => {
  const parts = dms.match(/(\d+)°(\d+)'(\d+(?:\.\d+)?)\"([NSEW])/);
  if (!parts) return null;

  let degrees = parseFloat(parts[1]);
  let minutes = parseFloat(parts[2]);
  let seconds = parseFloat(parts[3]);
  let direction = parts[4];

  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }

  return decimal;
}


export default function App() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const fetchWaypoints = async () => {
      try {
        const response = await axios.post( DOMAIN_IP + API_FOLDER_NAME + '/getSensor.php');
        const formatted = response.data.data.map((wp) => ({
          latitude: dmsToDecimal(wp.sensor_coord_x),
          longitude:dmsToDecimal(wp.sensor_coord_y),
        }));
        console.log(formatted);
        setWaypoints(formatted);
      } catch (error) {
        console.error('Error fetching waypoints:', error);
      }
    };
    fetchWaypoints();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const fetchRoute = async (origin, destination, waypoints = []) => {
    try {
      const apiKey = GOOGLE_MAP_API_KEY;
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;
      const waypointsStr = waypoints.length > 0
        ? '&waypoints=optimize:true|' + waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|')
        : '';

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}${waypointsStr}&key=${apiKey}`;

      const response = await axios.get(url);
      console.log('Google API response:', response.data);

      if (response.data.status !== 'OK') {
        console.error('Google API Error:', response.data.status);
        return;
      }

      const points = decodePolyline(response.data.routes[0].overview_polyline.points);
      setRouteCoords(points);

    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  const decodePolyline = (t, e) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5
      });
    }
    return points;
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const dest = { latitude, longitude };
    setDestination(dest);

    waypoints.forEach((waypoint, index) => {
      const distance = getDistance(latitude, longitude, waypoint.latitude, waypoint.longitude);
      if (distance < 100) {
        Alert.alert(`Destination is close to Waypoint ${index + 1}`);
      }
    });

    if (location) {
      await fetchRoute(location, dest, waypoints);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={location} title="You are here" />
          {destination && <Marker coordinate={destination} title="Destination" />}
          {waypoints.map((point, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(point.latitude),
                longitude: parseFloat(point.longitude),
              }}
              title={`Waypoint ${index + 1}`}
            />
          ))}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="blue"
              strokeWidth={4}
            />
          )}
        </MapView>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
