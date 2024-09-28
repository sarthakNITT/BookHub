import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

export default function BookView({ route, navigation }) {
  const { book } = route.params;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleBookmark = async (review) => {
    try {
      let currentFavorites = await AsyncStorage.getItem('favoriteBooks');
      currentFavorites = currentFavorites ? JSON.parse(currentFavorites) : [];
      const isBookmarked = currentFavorites.some(favBook => favBook.id === book.id);

      if (!isBookmarked) {
        const bookWithReview = {
          ...book,
          review: {
            rating: review.rating,
            comment: review.comment
          }
        };
        currentFavorites.push(bookWithReview);
        await AsyncStorage.setItem('favoriteBooks', JSON.stringify(currentFavorites));
        alert('Book added to favorites.');
      } else {
        alert('Book is already in favorites.');
      }
    } catch (error) {
      console.error(error);
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

  const handleSubmitReview = async () => {
    if (rating && comment) {
      const review = { rating, comment };
      await handleBookmark(review);
      let existingReviews = await AsyncStorage.getItem('bookReviews');
      existingReviews = existingReviews ? JSON.parse(existingReviews) : [];
      
      const bookWithReview = {
        ...book,
        review,
      };
      
      existingReviews.push(bookWithReview);
      await AsyncStorage.setItem('bookReviews', JSON.stringify(existingReviews));
      navigation.navigate('Review');
    } else {
      alert('Please provide both a rating and a comment.');
    }
  };
  

  const handleAddToCart = async () => {
    try {
      let cartItems = await AsyncStorage.getItem('cartItems');
      cartItems = cartItems ? JSON.parse(cartItems) : [];
      const isItemInCart = cartItems.some(cartItem => cartItem.id === book.id);
  
      if (!isItemInCart) {
        const bookInfo = {
          id: book.id,
          image: book.volumeInfo.imageLinks?.thumbnail || 'No Image',
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
          price: book.saleInfo?.retailPrice?.amount || 'N/A',
          currency: book.saleInfo?.retailPrice?.currencyCode || 'N/A'
        };
        cartItems.push(bookInfo);
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
        alert('Book added to cart.');
      } else {
        alert('Book is already in cart.');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./images/bg.png')} style={styles.bg}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons style={styles.headerText} name='arrow-back-ios' size={18} />
          </TouchableOpacity>
          <View style={styles.HeaderIcons}>
            <TouchableOpacity style={styles.headerIcon} onPress={handleBookmark}>
              <MaterialIcons name='bookmark-border' size={28} color={'black'} style={styles.headerIconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
            ) : (
              <View style={styles.bookNoImage}>
                <Text style={styles.bookNoImageText}>No Image</Text>
              </View>
            )}
            <Text style={styles.title}>{book.volumeInfo.title}</Text>
            {book.volumeInfo.authors && (
              <Text style={styles.author}>{book.volumeInfo.authors.join(', ')}</Text>
            )}
            <TouchableOpacity style={styles.Cart} onPress={handleAddToCart}>
              <AntDesign name='shoppingcart' size={22} color={'black'} style={styles.CartIcon} />
              <Text style={styles.CartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionHeading}>About the work</Text>
          <Text style={styles.description} numberOfLines={showFullDescription ? 0 : 5}>{book.volumeInfo.description}</Text>
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.toggleDescription}>
              {showFullDescription ? 'Show Less' : 'More'}
            </Text>
          </TouchableOpacity>
          <View style={styles.subheading}>
            <Text style={styles.subheadingText}>Originally published: </Text>
            <Text style={styles.subheadingTextInfo}>{book.volumeInfo.publishedDate}</Text>
          </View>
          <View style={styles.subheading}>
            <Text style={styles.subheadingText}>Pages: </Text>
            <Text style={styles.subheadingTextInfo}>{book.volumeInfo.pageCount}</Text>
          </View>
          <View style={styles.subheading}>
            <Text style={styles.subheadingText}>Genre: </Text>
            <Text style={styles.subheadingTextInfo}>{book.volumeInfo.categories}</Text>
          </View>
          <View style={styles.subheading}>
            <Text style={styles.subheadingText}>Rating: </Text>
            <Text style={styles.subheadingTextInfo}>{book.volumeInfo.averageRating}</Text>
          </View>
          <View style={styles.subheading}>
            <Text style={styles.subheadingText}>Language: </Text>
            <Text style={styles.subheadingTextInfo}>{book.volumeInfo.language}</Text>
          </View>
          <View style={styles.UserReview}>
            <Text style={styles.UserReviewHeading}>Book Review</Text>
            <TextInput 
              style={styles.UserReviewInputComment}
              placeholder='Rate'
              placeholderTextColor="lightgrey"
              value={rating}
              onChangeText={setRating}
            />
            <TextInput 
              style={styles.UserReviewInput}
              placeholder='Comment'
              placeholderTextColor="lightgrey"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.Submit} onPress={handleSubmitReview}>
              <Text style={styles.SubmitText}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subheadingSummary}>
            <Text style={styles.subheadingSummaryText}>Content</Text>
            <ImageBackground source={require('./images/premium.png')} style={styles.Premium} imageStyle={styles.PremiumImage}>
              <TouchableOpacity style={styles.PremiumButton}>
                <FontAwesome5 name='crown' size={12} color={'white'} style={styles.PremiumButtonIcon}></FontAwesome5>
                <Text style={styles.PremiumButtonText}> Upgrade to Premium</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.ContentBox}>
            <Text style={styles.ContentBoxHeading}>Enjoy Audiobooks: </Text>
            <Text style={styles.ContentBoxHeadingText}>Listen to your favorite books anytime, anywhere.</Text>
          </View>
          <View style={styles.ContentBox}>
            <Text style={styles.ContentBoxHeading}>Unlimited Reading: </Text>
            <Text style={styles.ContentBoxHeadingText}>Access our entire library without having to buy each book individually.</Text>
          </View>
          <View style={styles.ContentBox}>
            <Text style={styles.ContentBoxHeading}>Book Rentals: </Text>
            <Text style={styles.ContentBoxHeadingText}>Rent books at a fraction of the cost and return them when you're done.</Text>
          </View>
          <View style={styles.ContentBox}>
            <Text style={styles.ContentBoxHeading}>Create Your Own Books: </Text>
            <Text style={styles.ContentBoxHeadingText}>Unleash your creativity and share your stories with the world.</Text>
          </View>
          <View style={styles.ContentBox2}>
            <Text style={styles.ContentBoxHeading}>Community Networking: </Text>
            <Text style={styles.ContentBoxHeadingText}>Connect with fellow readers, share insights, and grow your reading community.</Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.purchaseButton} onPress={() => navigation.navigate('Purchase', { book })}>
          <MaterialIcons name='menu' size={20} color={'white'}/>
          <Text style={styles.purchaseButtonText}>Purchase Book</Text>
        </TouchableOpacity>

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
            <MaterialIcons name='favorite-border' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={() => navigation.navigate('Library')}>
            <FontAwesome name='bookmark' size={18} color='black' />
            <Text style={styles.footerContentHomeLiveText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.footerContentHome} onPress={handleProfileNavigation}>
            <FontAwesome name='user' size={18} color='grey' />
            <Text style={styles.footerContentHomeText}>Account</Text>
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
    paddingTop: 30,
    paddingBottom: 20,
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
  headerIcon: {
    marginRight: 10,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  bookImage: {
    width: 150,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 5,
    borderColor: 'black',
  },
  bookNoImage: {
    width: 150,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    marginBottom: 20,
  },
  bookNoImageText: {
    color: 'grey',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    marginBottom: 20,
    color: '#4285FC',
    fontWeight: '500',
    textAlign: 'center',
  },
  Cart:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: '#4285FC',
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:20
  },
  CartIcon:{
    marginRight:10,
    color:'white'
  },
  CartText:{
    fontSize:15,
    color:'white',
    fontWeight:'500'
  },
  descriptionHeading: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginLeft: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'grey',
    marginHorizontal: 20,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#4285FC',
    marginLeft: 20,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  subheading: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  subheadingText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  subheadingTextInfo: {
    fontWeight: '500',
  },
  subheadingSummary: {
    marginLeft: 20,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  subheadingSummaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
    color: 'black',
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
  ContentBox: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  ContentBox2:{
    marginHorizontal: 20,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginBottom: 90,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  ContentBoxHeading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ContentBoxHeadingText: {
    color: '#4B4B4B',
  },
  UserReview:{
    paddingHorizontal:20,
    marginTop:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  UserReviewHeading:{
    fontSize:16,
    color:'black',
    fontWeight:'600'
  },
  UserReviewInputComment:{
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10,
    width:50,
    height:40,
    marginHorizontal:20
  },
  UserReviewInput:{
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10,
    height:40
  },
  Submit:{
    backgroundColor:'#4285FC',
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:20,
    marginLeft:10
  },
  SubmitText:{
    color:'white',
    fontWeight:'500'
  },
  purchaseButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
    backgroundColor: '#4285FC',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:50,
    borderRadius:15,
    marginBottom:30,
    flexDirection:'row'
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:10
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
    fontWeight: '500',
  },
});
