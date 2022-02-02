import {
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './common-style';

import firestore from '@react-native-firebase/firestore';
import {COLORS, SIZES, IMAGES} from '../constants';

const ArticleScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [title, setTitle] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemPath, setItemPath] = useState('');

  useEffect(() => {
    let _item = global.version;
    let _law = _item._law;

    setCurrentLaw(_law);
    setCurrentItem(_item);

    const _title = _law?.name;
    setTitle(_title);
    const _itemType = _law?.type;
    setItemType(_itemType);
    setItemPath(getPath(_item));

    const ref = firestore()
      .collection('articles')
      .where('version_id', '==', _item.id);
    const subscriber = ref.onSnapshot(snapshot => {
      let articles = [];
      snapshot.forEach(doc => {
        const article = {id: doc.id, ...doc.data()};
        articles.push(article);
      });
      const data = articles.sort(
        (a1, a2) => parseInt(a1.number) - parseInt(a2.number),
      );
      setItems(data);
      setIsLoading(false);
    });

    return () => subscriber();
  }, [currentItem]);

  function getPath(item) {
    if (!('path' in item)) {
      item.path =
        item.parent.path + ' > ' + frenchType(item.type) + ' ' + item.number;
    }
    return item.path;
  }

  const ChildItem = ({child}) => {
    const [favorite, setFavorite] = useState(false);
    return (
      <TouchableOpacity>
        <View
          key={child.id}
          style={{
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 3,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.itemNumber}>{'ARTICLE ' + child.number}</Text>
            <TouchableOpacity
              onPress={() => {
                setFavorite(!favorite);
              }}>
              <Image
                source={IMAGES.favorite}
                resizeMode="contain"
                style={{
                  height: 16,
                  width: 16,
                  tintColor: favorite ? '#FF0000D0' : '#00000020',
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.itemContent]}>{child.content}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  function frenchType(type) {
    switch (type) {
      case 'book':
        return 'livre';
      case 'title':
        return 'titre';
      case 'chapter':
        return 'chapitre';
      case 'section':
        return 'section';
      case 'paragraph':
        return 'paragraphe';
      default:
        return type;
    }
  }

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            paddingHorizontal: SIZES.padding,
            marginTop: SIZES.margin,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: 36,
              alignSelf: 'flex-start',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={IMAGES.back}
                resizeMode="contain"
                style={{
                  tintColor: COLORS.black,
                  height: 30,
                  width: 20,
                }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: COLORS.black,
                  marginLeft: SIZES.padding,
                }}>
                Retour
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 3,
            backgroundColor: '#00000010',
          }}>
          <Text
            style={{
              color: '#555',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            {itemPath?.toUpperCase()}
          </Text>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {isLoading && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={COLORS.black} />
          </View>
        )}
        {!isLoading && (
          <FlatList
            data={items}
            renderItem={r => <ChildItem child={r.item} />}
            key={item => item.id}
            style={{
              flex: 1,
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default ArticleScreen;
