import { View, Text, StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import React from 'react';
import TabBarButton from './TabBarButton';
import { primaryColor, secondaryColor, triColor } from '../constants/colors';


const TabBar = ({ state, descriptors, navigation }) => {

  const { buildHref } = useLinkBuilder();


  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

      return(
        <TabBarButton
        key={route.name}
        style={styles.tabbarItem}
        onPress={onPress}
        onLongPress={onLongPress}
        isFocused={isFocused}
        routeName={route.name}
        color={isFocused? primaryColor: secondaryColor}
        label={label}
        />
      )

        // return (
        //   <PlatformPressable
        //     key={route.name}
        //     style={styles.tabbarItem}
        //     href={buildHref(route.name, route.params)}
        //     accessibilityState={isFocused ? { selected: true } : {}}
        //     accessibilityLabel={options.tabBarAccessibilityLabel}
        //     testID={options.tabBarButtonTestID}
        //     onPress={onPress}
        //     onLongPress={onLongPress}
        //   >
        //     {
        //       icons[route.name]({
        //         color: isFocused ? primaryColor : secondaryColor,
        //       })
        //     }

        //     <Text style={{
        //       color: isFocused ? primaryColor : secondaryColor,
        //       fontSize: 11
        //     }}>
        //       {label}
        //     </Text>
        //   </PlatformPressable>
        // );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: triColor,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    position: 'absolute', 
    bottom: 15,  
    left: 0,
    right: 0,
  },
});

export default TabBar;
