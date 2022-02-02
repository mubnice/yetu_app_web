import {
  FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  LogBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './common-style';

import firestore from '@react-native-firebase/firestore';
import {COLORS, IMAGES, SIZES} from '../constants';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const LawScreen = ({navigation}) => {
  const [laws, setLaws] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const ref = firestore().collection('laws');

    const subscriber = ref.onSnapshot(async snapshot => {
      //setLaws([]);
      snapshot.forEach(async doc => {
        const law = {id: doc.id, ...doc.data()};
        const verRef = ref.doc(law.id).collection('versions');
        const versionSnapShot = await verRef.orderBy('number', 'desc').get();

        law.versions = [];
        versionSnapShot.forEach(async vers => {
          let version = {id: vers.id, ...vers.data()};
          version.law = law;
          version.path = law.name + ' (' + version.publication_date + ')';
          await loadChildren(verRef, version);
          law.versions.push(version);
          setLaws(l => [...l, version]);
        });
      });
      setIsLoading(false);
    });

    async function loadChildren(parentRef, doc) {
      const _ref = parentRef.doc(doc.id).collection('children');
      const snapshot = await _ref.get();
      snapshot.forEach(async docSS => {
        if (!('children' in doc)) doc.children = [];

        let item = {id: docSS.id, ...docSS.data()};
        item.parent = doc;
        await loadChildren(_ref, item);
        doc.children.push(item);
      });
    }

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const LawItem = ({version}) => {
    console.log(version);
    return (
      <TouchableOpacity
        onPress={() => {
          global.version = version;
          navigation.navigate('Tabs');
        }}>
        <View
          key={version.id}
          style={{
            flexDirection: 'row',
            marginVertical: SIZES.margin,
          }}>
          <View
            style={{
              height: 100,
              width: 70,
              backgroundColor: COLORS.white,
              elevation: 5,
              shadowColor: COLORS.black,
              shadowRadius: 10,
              shadowOffset: 5,
            }}>
            <Image
              resizeMode="contain"
              source={IMAGES.lawImage(version.law.id)}
              style={{
                height: 100,
                width: 70,
                borderRadius: 10,
              }}
            />
          </View>

          <View style={{width: 10}}></View>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'NoeDisplay-Bold',
                color: COLORS.black,
                marginTop: SIZES.padding,
              }}>
              {version.law.name}
            </Text>
            <Text numberOfLines={2} style={{fontSize: 14}}>
              {version.law.description}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.black,
                fontWeight: '600',
                marginTop: SIZES.padding,
              }}>
              {version.article_count} article(s)
            </Text>
          </View>

          <TouchableOpacity>
            <Image
              source={IMAGES.favorite}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: '#00000020',
                marginLeft: SIZES.margin,
              }}
            />
          </TouchableOpacity>
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
      <View style={{flex: 1}}>
        {!searchVisible && (
          <View
            style={{
              paddingHorizontal: SIZES.padding * 3,
            }}>
            <View
              style={{
                marginBottom: SIZES.margin,
                marginTop: 20,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={[styles.sectionTitle, {flex: 1}]}>
                Bibliothèque des lois
              </Text>
            </View>

            <View
              style={{
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.controlBackground,
                paddingHorizontal: SIZES.padding * 3,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={IMAGES.search_fit}
                resizeMode="contain"
                style={{
                  tintColor: COLORS.secondaryColor,
                  height: 16,
                  width: 16,
                }}
              />

              <TextInput
                keyboardType="web-search"
                placeholder="Rechercher"
                style={{
                  fontSize: 16,
                  marginLeft: SIZES.margin,
                  flex: 1,
                }}
                onFocus={() => {
                  setSearchVisible(true);
                }}
              />
            </View>
          </View>
        )}
        <FlatList
          data={laws}
          renderItem={r => <LawItem version={r.item} />}
          key={item => item.id}
          style={{flex: 1, paddingHorizontal: SIZES.padding * 3}}
        />
      </View>
    </SafeAreaView>
  );
};

export default LawScreen;
