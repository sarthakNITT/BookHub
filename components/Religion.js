import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

export default function Library({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:religion');
        setBooks(response.data.items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookView', { book: item })}
    >
      <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail }} style={styles.bookImage} />
      <View style={styles.textContainer}>
        <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
        <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleProfileNavigation = () => {
    const user = auth().currentUser;
    if (user) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('SignIn');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./images/bg.png')} style={styles.bg}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Library</Text>
          <View style={styles.HeaderIcons}>
            <ImageBackground source={require('./images/premium.png')} style={styles.Premium} imageStyle={styles.PremiumImage}>
              <TouchableOpacity style={styles.PremiumButton}>
                <FontAwesome5 name='crown' size={12} color={'white'} style={styles.PremiumButtonIcon}></FontAwesome5>
                <Text style={styles.PremiumButtonText}> Premium</Text>
              </TouchableOpacity>
            </ImageBackground>
            <TouchableOpacity style={styles.headerIcon}>
              <AntDesign name='shoppingcart' size={22} color={'black'} style={styles.headerIconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <ScrollView style={styles.MainOption} horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.MainOptionTopicsLive} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsTextLive}>Religion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Fiction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Mystery')}>
              <Text style={styles.MainOptionTopicsText}>Mystery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('ScienceFiction')}>
              <Text style={styles.MainOptionTopicsText}>Science Fiction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Romance')}>
              <Text style={styles.MainOptionTopicsText}>Romance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Thriller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Horror</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Self Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Health & Fitness</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Drama</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Education</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Technology')}>
              <Text style={styles.MainOptionTopicsText}>Technology</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Economics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Sports')}>
              <Text style={styles.MainOptionTopicsText}>Sports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Politics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MainOptionTopics} onPress={()=>navigation.navigate('Thriller')}>
              <Text style={styles.MainOptionTopicsText}>Philosophy</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.booksContainer}
        />

        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={()=>navigation.navigate('Home')}>
            <MaterialIcons name='home' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Search')}>
            <AntDesign name='search1' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Favorite')}>
            <MaterialIcons name='favorite-border' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Library')}>
            <FontAwesome name='bookmark' size={18} color='black' />
            <Text style={styles.footerContentHomeLiveText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={handleProfileNavigation}>
            <MaterialCommunityIcons name='account-circle-outline' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  bg: {
    flex: 1
  },
  header: {
    padding: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:10
  },
  headerText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 10
  },
  HeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  Premium: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 15
  },
  PremiumImage: {
    borderRadius: 20,
  },
  PremiumButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  PremiumButtonIcon: {},
  PremiumButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  headerIcon: {
    marginRight: 10,
  },
  headerIconImage: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 8
  },
  Main: {
    flex: 1
  },
  MainOption: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(201, 201, 203, 0.3)',
    borderRadius: 30
  },
  MainOptionTopics: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginVertical: 5
  },
  MainOptionTopicsLive: {
    backgroundColor: 'grey',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginVertical: 5
  },
  MainOptionTopicsTextLive: {
    color: 'white',
    fontWeight: '500'
  },
  MainOptionTopicsText: {
    fontSize: 14,
    color: 'black'
  },
  booksContainer: {
    paddingHorizontal: 10,
  },
  bookItem: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20
  },
  bookImage: {
    width: 150,
    height: 250,
    marginBottom: 10,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: '500'
  },
  bookAuthor: {
    fontSize: 14,
    color: 'grey',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  footerContentHome: {
    alignItems: 'center'
  },
  footerContentHomeLiveText: {
    color: 'black',
    fontWeight: '600'
  },
  footerContentHomeText: {
    fontWeight: "500"
  },
});
