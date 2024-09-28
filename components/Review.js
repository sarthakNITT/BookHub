import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, ScrollView, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Review({ navigation }) {
  const [reviews, setReviews] = useState([]);
  const [showReviewIndex, setShowReviewIndex] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewData = await AsyncStorage.getItem('bookReviews');
        if (reviewData) {
          setReviews(JSON.parse(reviewData));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, []);

  const toggleReview = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowReviewIndex(showReviewIndex === index ? null : index);
  };

  const longPressHandler = (index) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updatedReviews = [...reviews];
              updatedReviews.splice(index, 1);
              await AsyncStorage.setItem('bookReviews', JSON.stringify(updatedReviews));
              setReviews(updatedReviews);
              setShowReviewIndex(null);
            } catch (error) {
              console.error(error);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const toggleLike = (index) => {
    const updatedReviews = reviews.map((review, i) => {
      if (i === index) {
        return { ...review, liked: !review.liked };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const sortReviews = (criteria) => {
    let sortedReviews;
    if (criteria === 'like') {
      sortedReviews = [...reviews].sort((a, b) => b.liked - a.liked);
    } else if (criteria === 'rate') {
      sortedReviews = [...reviews].sort((a, b) => b.review.rating - a.review.rating);
    }
    setReviews(sortedReviews);
  };

  const handleFilterPress = () => {
    Alert.alert(
      "Sort Reviews",
      "Choose an option to sort reviews",
      [
        {
          text: "Like",
          onPress: () => sortReviews('like')
        },
        {
          text: "Rate",
          onPress: () => sortReviews('rate')
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons style={styles.headerText} name='arrow-back-ios' size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <AntDesign name='shoppingcart' size={22} color={'black'} style={styles.headerIconImage} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContent}>
        <TouchableOpacity style={styles.Sort} onPress={handleFilterPress}>
          <Text style={styles.SortText}>Filter</Text>
        </TouchableOpacity>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <TouchableOpacity 
                style={[styles.content, showReviewIndex === index && styles.expandedContent]} 
                onLongPress={() => longPressHandler(index)}
                onPress={() => toggleLike(index)}
              >
                {review.volumeInfo.imageLinks?.thumbnail ? (
                  <Image source={{ uri: review.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
                ) : (
                  <View style={styles.bookNoImage}>
                    <Text style={styles.bookNoImageText}>No Image</Text>
                  </View>
                )}
                <View style={styles.bookInfo}>
                  <Text style={styles.title} numberOfLines={2}>{review.volumeInfo.title}</Text>
                  {review.volumeInfo.authors && (
                    <Text style={styles.author} numberOfLines={2}>{review.volumeInfo.authors.join(', ')}</Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => toggleReview(index)} style={styles.Icons}>
                  <MaterialIcons name={showReviewIndex === index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'black'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleLike(index)}>
                  <AntDesign name={review.liked ? 'like1' : 'like2'} size={18} style={styles.LikeIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
              {showReviewIndex === index && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewHeading}>User Review</Text>
                  <Text style={styles.reviewText}>Rating: {review.review.rating}</Text>
                  <Text style={styles.reviewText}>Comment: {review.review.comment}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noReviewContainer}>
            <Text style={styles.noReviewText}>No reviews available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerText: {
    marginRight: 10,
    color: 'black',
    paddingLeft: 20,
  },
  headerIconImage: {
    paddingLeft: 8,
    color: 'black',
    paddingRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  scrollContent: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20
  },
  Icons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  LikeIcon: {
    marginRight: 10
  },
  Sort: {
    marginBottom: 20
  },
  SortText: {
    color: 'green',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    paddingVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 20
  },
  expandedContent: {
    flexDirection: 'column',
  },
  bookImage: {
    width: 80,
    height: 120,
    marginRight: 20,
    borderRadius: 10,
  },
  bookNoImage: {
    width: 80,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginRight: 20,
  },
  bookNoImageText: {
    color: 'white',
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  author: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewContainer: {
    marginBottom: 20,
  },
  reviewSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 10,
  },
  reviewHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 5,
  },
  noReviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noReviewText: {
    fontSize: 18,
    color: 'black',
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});
