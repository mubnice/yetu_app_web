import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';

import {IMAGES, COLORS} from '../constants';

import {BookScreen, ArticleScreen} from '../screens';

const Tab = createBottomTabNavigator();

const CustomTabBar = props => {
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: COLORS.white,
        }}></View>
      <BottomTabBar {...props.props} />
    </View>
  );
};
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Book':
              iconName = IMAGES.book;
              break;
            case 'Article':
              iconName = IMAGES.article;
              break;
            default:
              break;
          }

          return (
            <Image
              source={iconName}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: color,
              }}
            />
          );
        },
        tabBarActiveTintColor: COLORS.primaryColor,
        tabBarInactiveTintColor: COLORS.secondaryColor,
        tabBarShowLabel: true,
        headerShown: false,
      })}>
      <Tab.Screen name="Book" component={BookScreen}></Tab.Screen>
      <Tab.Screen name="Article" component={ArticleScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
