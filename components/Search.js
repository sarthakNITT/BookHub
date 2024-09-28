import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

export default function Search({ navigation }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const fetchBooks = async (searchQuery) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 2) {
      fetchBooks(text);
    }
  };

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
          <Text style={styles.headerText}>Search</Text>
          <View style={styles.HeaderIcons}>
            <ImageBackground source={require('./images/premium.png')} style={styles.Premium} imageStyle={styles.PremiumImage}>
              <TouchableOpacity style={styles.PremiumButton}>
                <FontAwesome5 name='crown' size={12} color={'white'} style={styles.PremiumButtonIcon}></FontAwesome5>
                <Text style={styles.PremiumButtonText}> Premium</Text>
              </TouchableOpacity>
            </ImageBackground>
            <TouchableOpacity style={styles.headerIcon} onPress={()=>navigation.navigate('Cart')}>
              <AntDesign name='shoppingcart' size={22} color={'black'} style={styles.headerIconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for books..."
            value={query}
            onChangeText={handleSearch}
          />
        </View>

        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookItem} onPress={() => navigation.navigate('BookView', { book: item })}>
              <Image
                source={{ uri: item.volumeInfo.imageLinks?.thumbnail }}
                style={styles.bookImage}
              />
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
                <Text style={styles.bookAuthors}>{item.volumeInfo.authors?.join(', ')}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Home')}>
            <AntDesign name='home' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Search')}>
            <FontAwesome name='search' size={18} color='black' />
            <Text style={styles.footerContentHomeLiveText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Favorite')}>
            <MaterialIcons name='favorite-border' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Library')}>
            <MaterialCommunityIcons name='bookmark-outline' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Library</Text>
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
    flex: 1,
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
    paddingLeft: 10,
  },
  HeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Premium: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 15,
  },
  PremiumImage: {
    borderRadius: 20,
  },
  PremiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  PremiumButtonIcon: {},
  PremiumButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  headerIcon: {
    marginRight: 10,
  },
  headerIconImage: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 8,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  bookItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookImage: {
    width: 50,
    height: 75,
  },
  bookDetails: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  bookTitle: {
    fontWeight: 'bold',
  },
  bookAuthors: {
    color: 'gray',
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  footerContentHome: {
    alignItems: 'center',
  },
  footerContentHomeLiveText: {
    color: 'black',
    fontWeight: '600',
  },
  footerContentHomeText: {
    fontWeight: "500",
  },
});
