/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import {COLORS} from './app/constants';
import {
  LawScreen,
  BookScreen,
  ArticleScreen,
  BookItemScreen,
} from './app/screens';
import Tabs from './app/navigation/tabs';

const Stack = createStackNavigator();
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  /*
  useEffect(() => {
    setIsLoading(true);
    const ref = firestore().collection('articles');

    const subscriber = ref.onSnapshot(async snapshot => {
      let articles = [];
      snapshot.forEach(async doc => {
        const article = {id: doc.id, ...doc.data()};
        articles.push(article);
      });
      setIsLoading(false);
      global.articles = articles;
    });

    // Stop listening for updates when no longer required
    return () => subscriber();
  });

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  */
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: COLORS.appBackgroundColor,
          },
        }}
        initialRouteName="Law">
        <Stack.Screen name="Law" component={LawScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Book" component={BookScreen} />
        <Stack.Screen name="BookItem" component={BookItemScreen} />
        <Stack.Screen name="Article" component={ArticleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
