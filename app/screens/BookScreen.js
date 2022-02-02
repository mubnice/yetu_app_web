import {
  FlatList,
  SectionList,
  Platform,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './common-style';

import firestore from '@react-native-firebase/firestore';
import {COLORS, SIZES, IMAGES} from '../constants';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const BookScreen = ({route, navigation}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [title, setTitle] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemPath, setItemPath] = useState('');

  let loadArticles = false;

  useEffect(() => {
    async function load() {
      let _item = null;
      let _law = null;

      if (typeof route.params !== 'undefined') {
        let {navItem, law} = route?.params;
        _item = navItem;
        _law = law;
      } else {
        _item = global.version;
        _law = _item.law;
      }

      setCurrentLaw(_law);
      setCurrentItem(_item);
      if ('children' in _item)
        _item.children.sort(
          (a1, a2) => parseInt(a1.number) - parseInt(a2.number),
        );

      if ('articles' in _item) {
        setIsLoading(true);
        loadArticles = true;
      }

      const _title = 'type' in _item ? _item?.content : _law?.name;
      setTitle(_title);
      const _itemType = 'type' in _item ? _item?.type : _law?.type;
      setItemType(_itemType);
      setItemPath(getPath(_item));

      let isSectionWithParams = false;

      if (_item.type === 'section') {
        if ('children' in _item) {
          isSectionWithParams = true;
          for (let i = 0; i < _item.children.length; i++) {
            const child = _item.children[i];
            if (!('loadedArticles' in child)) {
              const content = await loadData(child.articles);
              const data = content
                .flat()
                .sort((a1, a2) => parseInt(a1.number) - parseInt(a2.number));

              child.loadedArticles = data;
            }
          }
        }
      }

      if (loadArticles) {
        if (!('loadedArticles' in _item)) {
          if (isSectionWithParams)
            while (
              _item.children.filter(p => !('loadedArticles' in p)).length > 0
            ) {}
          const content = await loadData(_item.articles);
          const data = content
            .flat()
            .sort((a1, a2) => parseInt(a1.number) - parseInt(a2.number));

          _item.loadedArticles = data;
        }

        setItems(groupData(_item));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setItems(groupData(_item));
      }
    }

    async function loadData(items) {
      const ref = firestore().collection('articles');
      let ids = [...items];
      const batches = [];
      while (ids.length) {
        const batch = ids.splice(0, 10);
        batches.push(
          ref
            .where(firestore.FieldPath.documentId(), 'in', [...batch])
            .get()
            .then(results =>
              results.docs.map(doc => ({id: doc.id, ...doc.data()})),
            ),
        );
      }

      return Promise.all(batches);
    }

    load();
  }, [currentItem]);

  function getPath(item) {
    if (!('path' in item)) {
      item.path =
        item.parent.path + ' > ' + frenchType(item.type) + ' ' + item.number;
    }
    return item.path;
  }

  const groupData = item => {
    let groups = [];
    groups.push({group: {}, data: []});

    if ('articles' in item) {
      groups[0].data = groups[0].data.concat(item.loadedArticles);
    }
    if ('children' in item) {
      if (item.type === 'section') {
        item.children.forEach(para =>
          groups.push({group: para, data: para.loadedArticles}),
        );
      } else {
        groups[0].data = groups[0].data.concat(item.children);
      }
    }
    return groups;
  };

  const ChildItem = ({child}) => {
    const isArticle = typeof child !== 'object' || !('type' in child);
    if (isArticle) {
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
              <TouchableOpacity>
                <Image
                  source={IMAGES.favorite}
                  resizeMode="contain"
                  style={{height: 16, width: 16, tintColor: '#00000020'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.itemContent]}>{child.content}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push('Book', {
            navItem: child,
            law: currentLaw,
          });
        }}>
        <View
          key={child.id}
          style={{
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 3,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.itemNumber}>
              {frenchType(child.type).toUpperCase() + ' ' + child.number}
            </Text>
            <Text style={[styles.itemContent]}>{child.content}</Text>
          </View>

          <View
            style={{
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={IMAGES.arrow_right}
              resizeMode="contain"
              style={{
                height: 12,
                width: 12,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionHeaderItem = ({group}) => {
    if (!('id' in group)) {
      return <View></View>;
    }

    return (
      <View
        style={{
          backgroundColor: COLORS.groupedDataSectionHeaderBackground,
          paddingHorizontal: SIZES.padding * 3,
          paddingVertical: SIZES.padding * 1.5,
          justifyContent: 'center',
        }}>
        <Text style={{fontWeight: '600', color: '#555'}}>§ {group.number}</Text>
        <Text
          style={{
            color: COLORS.darkBlue,
            fontSize: 20,
            fontFamily: 'NoeDisplay-Bold',
          }}>
          {group.content}
        </Text>
      </View>
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
          <SectionList
            sections={items}
            renderItem={({item, index, section}) => {
              return <ChildItem child={section.data[index]} />;
            }}
            keyExtractor={(item, index) => item.id}
            style={{
              padding: 0,
              flex: 1,
            }}
            ItemSeparatorComponent={({highlighted}) => (
              <View
                style={[
                  styles.separator,
                  highlighted && {marginHorizontal: SIZES.margin},
                ]}
              />
            )}
            renderSectionHeader={({section: {group, data}}) => (
              <SectionHeaderItem group={group} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default BookScreen;
