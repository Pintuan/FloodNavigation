import { View, Text, NavigatorContainer } from 'react-native';
import React from 'react';
import { Tabs, Stack } from 'expo-router';
import TabBar from '../components/TabBar';
import { primaryColor, secondaryColor, triColor } from '../constants/colors';

const _layout = () => {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "SAFER", 
          headerStyle: {
            backgroundColor: triColor, 
          },
          headerTintColor: primaryColor, 
          headerTitleAlign: 'center', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,  
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About us",
          headerStyle: {
            backgroundColor: triColor, 
          },
          headerTintColor: primaryColor,
          headerTitleAlign: 'center', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}
      />
    </Tabs>
  );
};

export default _layout;
