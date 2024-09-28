import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateBook({ navigation }) {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookContent, setBookContent] = useState('');
  const [bookCover, setBookCover] = useState(require('./images/bookCover.jpg'));

  const selectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setBookCover(source);
      }
    });
  };

  const createBook = async () => {
    if (!bookTitle || !authorName || !bookDescription || !bookContent) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const newBook = {
      key: Date.now().toString(), 
      bookTitle,
      authorName,
      bookDescription,
      bookContent,
      bookCover: bookCover.uri 
    };

    try {
      const storedBooks = await AsyncStorage.getItem('books');
      const books = storedBooks ? JSON.parse(storedBooks) : [];
      books.push(newBook);
      await AsyncStorage.setItem('books', JSON.stringify(books));
      Alert.alert('Book created successfully!');
      navigation.goBack(); 
    } catch (error) {
      console.error('Error saving book to AsyncStorage:', error);
      Alert.alert('Error saving book. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.Back}>
        <MaterialIcons style={styles.BackIcon} name='arrow-back-ios' size={22} color={'white'} />
      </TouchableOpacity>
      <Text style={styles.Heading}>Create Book</Text>
      <Text style={styles.SubHeading}>Fill out the details to create a new book entry.</Text>
      <View style={styles.Main}>
        <ScrollView style={styles.MainContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.Input}>Book Title *</Text>
          <TextInput
            style={styles.InputButton}
            placeholder='Book Title'
            placeholderTextColor="lightgrey"
            value={bookTitle}
            onChangeText={setBookTitle}
          />
          <Text style={styles.Input}>Author Name *</Text>
          <TextInput
            style={styles.InputButton}
            placeholder='Author Name'
            placeholderTextColor="lightgrey"
            value={authorName}
            onChangeText={setAuthorName}
          />
          <Text style={styles.Input}>Book Description *</Text>
          <TextInput
            style={styles.InputButtonDescription}
            placeholder='Book Description'
            placeholderTextColor="lightgrey"
            multiline={true}
            scrollEnabled={true}
            value={bookDescription}
            onChangeText={setBookDescription}
          />
          <Text style={styles.Input}>Book Content *</Text>
          <TextInput
            style={styles.InputButtonContent}
            placeholder='Book Content'
            placeholderTextColor="lightgrey"
            multiline={true}
            scrollEnabled={true}
            value={bookContent}
            onChangeText={setBookContent}
          />
          <View style={styles.BookCover}>
            <View style={styles.BookCoverContainer}>
              <Text style={styles.Input}>Book Cover Image</Text>
              <TouchableOpacity onPress={selectImage} style={styles.Button}>
                <Text style={styles.ButtonText}>Select Image</Text>
              </TouchableOpacity>
            </View>
            <Image source={bookCover} style={styles.bookCover} />
          </View>
          <TouchableOpacity style={styles.CreatedBook} onPress={createBook}>
            <Text style={styles.CreatedBookText}>Create Book</Text>
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
  InputButtonDescription: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10,
    height: 80,
    textAlignVertical: 'top'
  },
  InputButtonContent: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10,
    height: 120,
    textAlignVertical: 'top'
  },
  BookCover:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  BookCoverContainer: {
    marginTop: 20
  },
  Button: {
    backgroundColor: '#384DE7',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginLeft: 10,
    marginTop:5
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
