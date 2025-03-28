import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [tideData, setTideData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.100.2/floodNavigation/getData.php');
      setTideData(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tide data:', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show loading
  if (loading) return <Text>Loading...</Text>;

  // Show error
  if (error) return <Text>Error fetching data</Text>;

  return (
    <ScrollView style={{ padding: 10 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Tide Readings and Locations</Text>

        {/* Header */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 5 }}>
          <Text style={{ flex: 1, fontWeight: 'bold' }}>Sensor ID</Text>
          <Text style={{ flex: 1, fontWeight: 'bold' }}>Reading (cm)</Text>
          <Text style={{ flex: 1, fontWeight: 'bold' }}>X</Text>
          <Text style={{ flex: 1, fontWeight: 'bold' }}>Y</Text>
          <Text style={{ flex: 1, fontWeight: 'bold' }}>Timestamp</Text>
        </View>

        {/* Data */}
        {Array.isArray(tideData) && tideData.length > 0 ? (
          tideData.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', paddingVertical: 5 }}>
              <Text style={{ flex: 1 }}>{item.sensor_id}</Text>
              <Text style={{ flex: 1 }}>{item.sensor_initial_reading}</Text>
              <Text style={{ flex: 1 }}>{item.sensor_coord_x}</Text>
              <Text style={{ flex: 1 }}>{item.sensor_coord_y}</Text>
              <Text style={{ flex: 1 }}>{item.reading_timestamp}</Text>
            </View>
          ))
        ) : (
          <Text>No data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;
