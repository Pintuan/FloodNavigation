import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { icons } from '../assets/icons';
import { primaryColor, secondaryColor, triColor } from '../constants/colors'; // adjust the path as necessary


const TabBarButton = (props) => {
  const { isFocused, label, routeName } = props;

  return (
    <Pressable {...props} style={styles.container}>
      {
        icons[routeName]({
          color: isFocused ? primaryColor : secondaryColor,
        })
      }
      <Text style={{
        color: isFocused ? primaryColor : secondaryColor,
        fontSize: 11,
      }}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBarButton;
