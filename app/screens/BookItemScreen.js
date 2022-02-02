import {
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './common-style';

import firestore from '@react-native-firebase/firestore';
import {COLORS, SIZES} from '../constants';

const BookItemScreen = ({route, navigation}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [title, setTitle] = useState('');
  const [itemType, setItemType] = useState('');

  useEffect(() => {
    let {navItem, law} = route?.params;
    setCurrentItem(navItem);
    setItems(navItem.children);
    setCurrentLaw(law);

    const _title = navItem.type === 'version' ? law.name : navItem.content;
    setTitle(_title);
    const _itemType = navItem.type === 'version' ? law.type : navItem.type;
    setItemType(_itemType);
    setIsLoading(true);

    setIsLoading(false);
  }, []);

  const ChildItem = ({child}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (child.type !== 'article') {
            console.log('Item ', child);
            navigation.push('BookItem', {
              navItem: child,
              law: currentLaw,
            });
          }
        }}>
        <View key={child.id}>
          <Text>{child.type}</Text>
          <Text style={{fontSize: 16, color: COLORS.black}}>
            {child.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <View style={{paddingHorizontal: SIZES.padding * 3}}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{itemType}</Text>
        <FlatList
          data={items}
          renderItem={r => <ChildItem child={r.item} />}
          key={item => item.id}
          style={{
            padding: 10,
          }}
          ItemSeparatorComponent={
            Platform.OS === 'android' &&
            (({highlighted}) => (
              <View
                style={[styles.separator, highlighted && {marginLeft: 0}]}
              />
            ))
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default BookItemScreen;
