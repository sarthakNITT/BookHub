import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import auth from '@react-native-firebase/auth';

const API_KEY = 'AIzaSyADYjQjjDQZy_Mua2vxyYCCQCHJ7UOTugc';

export default function Home({navigation, route}) {
  const [data, setData] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);
  const [NewBookData, setNewBookData] = useState([]);
  const [BestSellerData, setBestSellerData] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [authorImages, setAuthorImages] = useState({});
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const genres = ['fiction', 'fantasy', 'romance', 'love', 'science', 'thriller', 'self-help'];

  const getAuthorImage = async (authorName) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${authorName}&pithumbsize=500&origin=*`);
      const data = await response.json();
      const page = Object.values(data.query.pages)[0];
      if (page && page.thumbnail && page.thumbnail.source) {
        return page.thumbnail.source;
      }
      return null;
    } catch (error) {
      console.error('Error fetching author image:', error);
      return null;
    }
  };
  

  const getAPI = async () => {
    try {
      let allBooks = [];
      for (const genre of genres) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${genre}&maxResults=3&key=${API_KEY}`;
        let result = await fetch(url);
        result = await result.json();
        if (result.error) {
          console.error('API error:', result.error.message);
          return;
        }
        if (result.items) {
          allBooks = [...allBooks, ...result.items];
        }
      }
      allBooks = allBooks.sort(() => 0.5 - Math.random()).slice(0, 10);
      setData(allBooks);
  
      const authorImages = {};
      for (const book of allBooks) {
        if (book.volumeInfo.authors) {
          for (const author of book.volumeInfo.authors) {
            if (!authorImages[author]) {
              authorImages[author] = await getAuthorImage(author);
            }
          }
        }
      }
      setAuthorImages(authorImages);
  
      let recommendedBooks = [];
      for (const genre of genres) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${genre}&startIndex=10&maxResults=3&key=${API_KEY}`;
        let result = await fetch(url);
        result = await result.json();
        if (result.items) {
          recommendedBooks = [...recommendedBooks, ...result.items];
        }
      }
  
      let NewBooks = [];
      for (const genre of genres) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${genre}&startIndex=10&maxResults=3&key=${API_KEY}`;
        let result = await fetch(url);
        result = await result.json();
        if (result.items) {
          NewBooks = [...NewBooks, ...result.items];
        }
      }
  
      let BestSellerBooks = [];
      for (const genre of genres) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${genre}&startIndex=10&maxResults=3&key=${API_KEY}`;
        let result = await fetch(url);
        result = await result.json();
        if (result.items) {
          BestSellerBooks = [...BestSellerBooks, ...result.items];
        }
      }
  
      recommendedBooks = recommendedBooks.sort(() => 0.5 - Math.random()).slice(0, 10);
      NewBooks = NewBooks.sort(() => 0.5 - Math.random()).slice(0, 10);
      BestSellerBooks = BestSellerBooks.sort(() => 0.5 - Math.random()).slice(0, 10);
      setRecommendedData(recommendedBooks);
      setNewBookData(NewBooks);
      setBestSellerData(BestSellerBooks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  

  useEffect(() => {
    getAPI();
  }, []);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentBook(viewableItems[0].item);
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

  const handleReadBook = (book) => {
    navigation.navigate('BookView', { book });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./images/bg.png')} style={styles.bg}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <View style={styles.HeaderIcons}>
          <ImageBackground source={require('./images/premium.png')} style={styles.Premium}imageStyle={styles.PremiumImage}>
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

      <ScrollView contentContainerStyle={styles.main}>


        {data.length ? (
          <FlatList
          horizontal
          data={data}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.mainBookComplete} onPress={() => handleReadBook(item)}>
              {item.volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                  style={styles.mainBookCoverImage}
                />
              ) : (
                <View style={styles.mainBookNoImage}>
                  <Text style={styles.mainBookNoImageText}>No Image</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.flatListContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false} 
        />
        
        ) : (
          <Text style={styles.mainNoContentText}>Not Found</Text>
        )}
        {currentBook && (
          <View style={styles.currentBookDetails}>
            <Text style={styles.currentBookTitle}>{currentBook.volumeInfo.title}</Text>
            {currentBook.volumeInfo.authors && currentBook.volumeInfo.authors.length > 0 && (
              <Text style={styles.currentBookAuthor}>Author: {currentBook.volumeInfo.authors.join(', ')}</Text>
            )}
            {currentBook.volumeInfo.description && (
              <Text style={styles.currentBookDescription} numberOfLines={3}>{currentBook.volumeInfo.description}</Text>
            )}
            <TouchableOpacity style={styles.currentBookButton} onPress={() => handleReadBook(currentBook)}>
              <Text style={styles.currentBookButtonText}>Read Book</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.Body}>
        <View style={styles.recommended}>
          <Text style={styles.recommendedHeading1}>Recommended for you</Text>
          <TouchableOpacity style={styles.recommendedBox} onPress={()=>navigation.navigate('Library')}>
            <Text style={styles.recommendedSeeText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recommendedData.length ? (
          <FlatList
          horizontal
          data={recommendedData}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.recommendedComplete} onPress={() => handleReadBook(item)}>
              {item.volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                  style={styles.recommendedImage}
                />
              ) : (
                <View style={styles.recommendedBookNoImage}>
                  <Text style={styles.recommendedBookNoText}>No Image</Text>
                </View>
              )}
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedContentTextTitle} numberOfLines={2}>
                  {item.volumeInfo.title || 'No Title'}
                </Text>
                <Text style={styles.recommendedContentTextAuthor} numberOfLines={2}>
                  {item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}-recommended`}
          contentContainerStyle={styles.recommendedFlatListContent}
          showsHorizontalScrollIndicator={false} 
        />
        
        ) : (
          <Text style={styles.mainNoContentText}>Not Found</Text>
        )}
        <View style={styles.recommended}>
          <Text style={styles.recommendedHeading1}>New Books</Text>
          <TouchableOpacity style={styles.recommendedBox} onPress={()=>navigation.navigate('Mystery')}>
            <Text style={styles.recommendedSeeText}>See All</Text>
          </TouchableOpacity>
        </View>
        {NewBookData.length ? (
          <FlatList
            horizontal
            data={NewBookData}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recommendedComplete} onPress={() => handleReadBook(item)}>
                {item.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    style={styles.recommendedImage}
                  />
                ) : (
                  <View style={styles.recommendedBookNoImage}>
                    <Text style={styles.recommendedBookNoText}>No Image</Text>
                  </View>
                )}
                <View style={styles.recommendedContent}>
                  <Text style={styles.recommendedContentTextTitle} numberOfLines={2}>
                    {item.volumeInfo.title || 'No Title'}
                  </Text>
                  <Text style={styles.recommendedContentTextAuthor} numberOfLines={2}>
                    {item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `${item.id}-${item.genre}-newBooks`}
            contentContainerStyle={styles.recommendedFlatListContent}
            showsHorizontalScrollIndicator={false} 
          />
        ) : (
          <Text style={styles.mainNoContentText}>Not Found</Text>
        )}
        <View style={styles.recommended}>
          <Text style={styles.recommendedHeading1}>Best Sellers</Text>
          <TouchableOpacity style={styles.recommendedBox} onPress={()=>navigation.navigate('Sports')}>
            <Text style={styles.recommendedSeeText}>See All</Text>
          </TouchableOpacity>
        </View>
        {BestSellerData.length ? (
          <FlatList
            horizontal
            data={BestSellerData}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recommendedComplete} onPress={() => handleReadBook(item)}>
                {item.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    style={styles.recommendedImage}
                  />
                ) : (
                  <View style={styles.recommendedBookNoImage}>
                    <Text style={styles.recommendedBookNoText}>No Image</Text>
                  </View>
                )}
                <View style={styles.recommendedContent}>
                  <Text style={styles.recommendedContentTextTitle} numberOfLines={2}>
                    {item.volumeInfo.title || 'No Title'}
                  </Text>
                  <Text style={styles.recommendedContentTextAuthor} numberOfLines={2}>
                    {item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `${item.id}-${item.genre}-bestSellerBooks`}
            contentContainerStyle={styles.recommendedFlatListContent}
            showsHorizontalScrollIndicator={false} 
          />
        ) : (
          <Text style={styles.mainNoContentText}>Not Found</Text>
        )}
        </View>
        <View style={styles.recommended}>
          <Text style={styles.recommendedHeading2}>Author Images</Text>
          <TouchableOpacity style={styles.recommendedBox}>
            <Text style={styles.recommendedSeeText1}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={Object.keys(authorImages)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.authorImageContainer}>
              {authorImages[item] ? (
                <Image
                  source={{ uri: authorImages[item] }}
                  style={styles.authorImage}
                />
              ) : (
                <View style={styles.authorNoImage}>
                  <Text style={styles.authorNoImageText}>No Image</Text>
                </View>
              )}
              <Text style={styles.authorName}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.authorFlatListContent}
          showsHorizontalScrollIndicator={false}
        />

      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={1} style={styles.footerContentHome}>
          <MaterialIcons name='home' size={18} color='black' />
          <Text style={styles.footerContentHomeLiveText}>Home</Text>
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
    backgroundColor:'#FFF',
  },
  bg:{
    flex:1
  },
  header:{
    padding:10,
    paddingTop:20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  headerText:{
    fontSize:24,
    color:'black',
    fontWeight:'bold',
    paddingLeft:10
  },
  HeaderIcons:{
    flexDirection:'row',
    alignItems:'center'
  },
  Premium:{
    paddingHorizontal:15,
    paddingVertical:5,
    marginRight:15
  },
  PremiumImage:{
    borderRadius:20,
  },
  PremiumButton:{
    flexDirection:'row',
    alignItems:'center'
  },
  PremiumButtonIcon:{},
  PremiumButtonText:{
    color:'white',
    fontSize:14,
    fontWeight:'600'
  },
  headerIcon:{
    marginRight:10,
  },  
  headerIconImage:{
    backgroundColor:'#E8E8E8',
    borderRadius:20,
    padding:8
  },
  main: {
    marginTop:30,
  },
  MainHeading1:{
    fontSize:18,
    marginHorizontal:20,
    marginBottom:10,
    fontWeight:'bold',
    color:'black'
  },
  mainBookComplete:{
    width:200,
    marginLeft:50,
  },
  mainBookCoverImage:{
    width:150,
    height:250,
    resizeMode:'cover',
    borderRadius:20,
    borderWidth:1,
    borderColor:'lightgrey'
  },
  mainBookNoImage:{},
  mainBookNoImageText:{},
  flatListContent: {
    paddingHorizontal: 10,
  },
  mainNoContentText:{
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: 'grey'
  },
  currentBookDetails: {
    padding: 20,
    marginVertical: 10,
    alignItems:'center'
  },
  currentBookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  currentBookAuthor: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
    fontWeight:'600'
  },
  currentBookDescription: {
    fontSize: 14,
    color: 'grey',
  },
  currentBookButton:{},
  currentBookButtonText:{
    backgroundColor: '#4359FF',
    color:'white',
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:20,
    marginTop:10
  },
  Body:{
    marginHorizontal:20
  },
  recommended:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginTop:30
  },
  recommendedHeading1:{
    fontSize:18,
    fontWeight:'bold',
    color:'black',
  },
  recommendedBox:{
    marginRight:20,
  },
  recommendedSeeText:{},
  recommendedComplete:{
    width:100,
    marginRight:15,
    marginTop:10
  },
  recommendedImage:{
    width:100,
    height:150,
    borderRadius:5
  },
  recommendedBookNoImage:{},
  recommendedBookNoText:{},
  recommendedContent:{},
  recommendedContentTextTitle:{
    color:'black',
    marginTop:10
  },
  recommendedContentTextAuthor:{},
  recommendedHeading2:{
    fontSize:18,
    fontWeight:'bold',
    color:'black',
    marginLeft:20
  },
  recommendedSeeText1:{
    marginRight:20
  },
  authorImageContainer: {
    width: 100,
    marginRight: 15,
    marginTop: 10,
    alignItems: 'center',
    marginBottom:50
  },
  authorImage: {
    width: 70,
    height: 70,
    borderRadius:200
  },
  authorNoImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius:100
  },
  authorNoImageText: {
    color: 'grey',
  },
  authorName: {
    marginTop: 5,
    textAlign: 'center',
    color: 'black',
  },
  authorFlatListContent: {
    paddingHorizontal: 20,
  },
  
  footer:{
    paddingVertical:15,
    paddingHorizontal:20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white'
  },
  footerContentHome:{
    alignItems:'center'
  },
  footerContentHomeLiveText:{
    color:'black',
    fontWeight:'600'
  },
  footerContentHomeText:{
    fontWeight:"500"
  },
});