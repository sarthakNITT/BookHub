import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateBook({ route, navigation }) {
  const { book } = route.params; 
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookContent, setBookContent] = useState('');
  const [bookCover, setBookCover] = useState(require('./images/bookCover.jpg'));

  const storeBookData = async () => {
    if (!bookTitle || !authorName || !bookDescription || !bookContent) {
      Alert.alert('Error', 'All fields except the cover image are required');
      return;
    }

    try {
      const bookData = {
        key: Date.now().toString(), 
        bookTitle,
        authorName,
        bookDescription,
        bookContent,
        bookCover
      };

      const existingBooks = await AsyncStorage.getItem('books');
      const newBooks = existingBooks ? JSON.parse(existingBooks) : [];
      newBooks.push(bookData);

      await AsyncStorage.setItem('books', JSON.stringify(newBooks));
      Alert.alert('Success', 'Book details saved successfully');
      navigation.navigate('CreatedBook');
    } catch (error) {
      console.log('AsyncStorage Error: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.Back}>
        <MaterialIcons style={styles.BackIcon} name='arrow-back-ios' size={22} color={'white'} />
      </TouchableOpacity>
      <Text style={styles.Heading}>Purchase Book</Text>
      <Text style={styles.SubHeading}>Fill out the details to Purchase a Book.</Text>
      <View style={styles.Main}>
        <ScrollView style={styles.MainContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.Input}>Name *</Text>
          <TextInput
            style={styles.InputButton}
            placeholder='Name'
            placeholderTextColor="lightgrey"
            value={bookTitle}
            onChangeText={setBookTitle}
          />
          <Text style={styles.Input}>Address *</Text>
          <TextInput
            style={styles.InputButton}
            placeholder='Address'
            placeholderTextColor="lightgrey"
            value={authorName}
            onChangeText={setAuthorName}
          />
          <Text style={styles.Input}>Landmark</Text>
          <TextInput
            style={styles.InputButton}
            placeholder='Landmark'
            placeholderTextColor="lightgrey"
            multiline={true}
            scrollEnabled={true}
            value={bookDescription}
            onChangeText={setBookDescription}
          />

          <View style={styles.BookInfo}>
            <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.bookCover} />
            <View>
                <Text style={styles.BookTitle}>{book.volumeInfo.title}</Text>
                <Text style={styles.BookAuthor}>{book.volumeInfo.authors.join(', ')}</Text>
                <Text style={styles.BookSaleInfo}>{book.saleInfo.saleability}</Text>
                <Text style={styles.BookPrice}>{book.saleInfo.retailPrice.amount} {book.saleInfo.retailPrice.currencyCode}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.CreatedBook} onPress={storeBookData}>
            <Text style={styles.CreatedBookText}>Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#384DE7',
    paddingTop: 20
  },
  Back: {
    paddingHorizontal: 20,
    marginVertical: 10
  },
  Heading: {
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: 25,
    color: 'white',
    fontWeight: '600'
  },
  SubHeading: {
    paddingHorizontal: 20,
    color: 'white',
  },
  Main: {
    flex: 1,
    marginTop: 30,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  MainContent: {},
  Input: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20
  },
  InputButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10
  },
  BookInfo: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection:'row'
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    marginRight:20
  },
  BookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  BookAuthor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  BookSaleInfo: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  BookPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  CreatedBook:{
    paddingVertical:15,
    backgroundColor:'#384DE7',
    marginTop:30,
    borderRadius:10
  },
  CreatedBookText:{
    textAlign:'center',
    color:'white',
    fontWeight:'500',
    fontSize:16
  }
});
