import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, SafeAreaView, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

export default function Favorite({ navigation }) {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const currentFavorites = await AsyncStorage.getItem('favoriteBooks');
        setFavoriteBooks(currentFavorites ? JSON.parse(currentFavorites) : []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);

  const handleProfileNavigation = () => {
    const user = auth().currentUser;
    if (user) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('SignIn');
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      const updatedFavorites = favoriteBooks.filter(book => book.id !== bookId);
      await AsyncStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
      setFavoriteBooks(updatedFavorites);
      Alert.alert('Removed', 'Book has been removed from favorites.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLongPress = (bookId) => {
    Alert.alert(
      'Remove Book',
      'Are you sure you want to remove this book from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeFavorite(bookId),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./images/bg.png')} style={styles.bg}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Favorite</Text>
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

        {favoriteBooks.length > 0 ? (
          <FlatList
            data={favoriteBooks}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.bookItem} 
                onLongPress={() => handleLongPress(item.id)}
              >
                <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail }} style={styles.bookImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.bookTitle} numberOfLines={2}>{item.volumeInfo.title}</Text>
                  <Text style={styles.bookAuthor} numberOfLines={2}>{item.volumeInfo.authors?.join(', ')}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.booksContainer}
            numColumns={2}  
            key={2}  
          />
        ) : (
          <View style={styles.noBooksContainer}>
            <Text style={styles.noBooksText}>No books added to favorites yet.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Home')}>
            <AntDesign name='home' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Search')}>
            <AntDesign name='search1' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Favorite')}>
            <MaterialIcons name='favorite' size={18} color='black' />
            <Text style={styles.footerContentHomeLiveText}>Favorite</Text>
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
  booksContainer: {
    paddingHorizontal: 10,
  },
  bookItem: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 25
  },
  bookImage: {
    width: '80%',
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
  noBooksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooksText: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
  },
});
