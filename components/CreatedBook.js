import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function CreatedBook() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('books');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        }
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    loadBooks();
  }, []); 

  const handleLongPress = (bookKey) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteBook(bookKey)
        }
      ]
    );
  };

  const deleteBook = async (bookKey) => {
    try {
      const updatedBooks = books.filter(book => book.key !== bookKey);
      setBooks(updatedBooks);
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item.key)} style={styles.bookItem}>
      <Image
        source={item.bookCover && typeof item.bookCover === 'string' ? { uri: item.bookCover } : require('./images/bookCover.jpg')}
        style={styles.bookImage}
      />
      <View style={styles.bookDetails}>
        <Text style={styles.bookName}>Title: {item.bookTitle}</Text>
        <Text style={styles.bookAuthor}>Author Name: {item.authorName}</Text>
        <Text style={styles.bookDescription}>Description: {item.bookDescription}</Text>
        <Text style={styles.bookContent}>Content: {item.bookContent}</Text>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./images/bg.png')} style={styles.bg}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Created Book</Text>
          <View style={styles.HeaderIcons}>
            <ImageBackground source={require('./images/premium.png')} style={styles.Premium} imageStyle={styles.PremiumImage}>
              <TouchableOpacity style={styles.PremiumButton}>
                <FontAwesome5 name='crown' size={12} color={'white'} style={styles.PremiumButtonIcon} />
                <Text style={styles.PremiumButtonText}> Premium</Text>
              </TouchableOpacity>
            </ImageBackground>
            <TouchableOpacity style={styles.headerIcon}>
              <AntDesign name='shoppingcart' size={22} color={'black'} style={styles.headerIconImage} />
            </TouchableOpacity>
          </View>
        </View>
        {books.length > 0 ? (
          <FlatList
            data={books}
            renderItem={renderItem}
            keyExtractor={item => item.key}
          />
        ) : (
          <View style={styles.noBooksContainer}>
            <Text style={styles.noBooksText}>No Books Created</Text>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  bookItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems:'center',
    marginHorizontal:20,
    backgroundColor:'rgba(211, 211, 211, 0.2)',
    marginVertical:10,
    borderRadius:20
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight:10
  },
  bookDetails: {
    marginLeft: 10,
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black'
  },
  bookAuthor: {
    fontSize: 16,
    color: '#555',
    fontWeight:'500'
  },
  bookDescription: {
    fontSize: 14,
    color: '#555',
  },
  bookContent: {
    fontSize: 12,
    color: '#555',
  },
  noBooksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooksText: {
    fontSize: 18,
    color: 'gray',
  },
});
