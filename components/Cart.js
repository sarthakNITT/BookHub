import { StyleSheet, Text, View, Image, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Cart({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [purchasableItems, setPurchasableItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await AsyncStorage.getItem('cartItems');
        const parsedItems = items ? JSON.parse(items) : [];
        const itemsWithQuantity = parsedItems.map(item => ({
          ...item,
          quantity: item.quantity ?? 0
        }));
        setCartItems(itemsWithQuantity);
        const filteredItems = itemsWithQuantity.filter(item => item.quantity > 0);
        setPurchasableItems(filteredItems);
        calculateTotalAmount(filteredItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, []);

  const decrementQuantity = async (id) => {
    try {
      const updatedItems = cartItems.map(item =>
        item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCartItems(updatedItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
      const filteredItems = updatedItems.filter(item => item.quantity > 0);
      setPurchasableItems(filteredItems);
      calculateTotalAmount(filteredItems);
    } catch (error) {
      console.error(error);
    }
  };

  const removeItemFromCart = async (id) => {
    try {
      const filteredItems = cartItems.filter(item => item.id !== id);
      setCartItems(filteredItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(filteredItems));
      const updatedPurchasableItems = filteredItems.filter(item => item.quantity > 0);
      setPurchasableItems(updatedPurchasableItems);
      calculateTotalAmount(updatedPurchasableItems);
    } catch (error) {
      console.error(error);
    }
  };

  const incrementQuantity = async (id) => {
    try {
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
      const filteredItems = updatedItems.filter(item => item.quantity > 0);
      setPurchasableItems(filteredItems);
      calculateTotalAmount(filteredItems);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const renderItem = ({ item }) => (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.cartItem}>
      <View style={styles.cartBox}>
        <Image source={{ uri: item.image }} style={styles.cartItemImage} />
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemTitle}>{item.title}</Text>
          <Text style={styles.cartItemAuthor}>{item.author}</Text>
          <Text style={styles.cartItemPrice}>{`${item.price} ${item.currency}`}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.quantityButtonplus}>
              <Text style={styles.quantityButtonTextplus}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItemFromCart(item.id)} style={styles.removeButton}>
        <MaterialIcons name='delete' size={22} color={'#4285FC'} />
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons style={styles.headerText} name='arrow-back-ios' size={22} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.ContentHeading}>My Bag</Text>
      </View>
      <View style={styles.Content}>
        <FlatList
          scrollEnabled
          showsVerticalScrollIndicator={false}  
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
      {purchasableItems.length > 0 && (
        <View style={styles.purchaseContainer}>
          {purchasableItems.map(item => (
            <View key={item.id} style={styles.purchaseItem}>
              <Text style={styles.purchaseItemText}>{item.title} - {item.quantity}</Text>
              <Text style={styles.cartItemPrice}>{`${item.price} ${item.currency}`}</Text>
            </View>
          ))}
          <View style={styles.purchaseItem}>
            <Text style={styles.totalAmountText}>Total: </Text>
            <Text style={styles.totalAmountTextamount}>{totalAmount} INR</Text>
          </View>
          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {},
  Content: {
    flex: 1,
  },
  ContentHeadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ContentHeading: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 130,
  },
  ContentHeadingitem: {},
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 370,
  },
  cartItemImage: {
    width: 80,
    height: 120,
    resizeMode: 'cover',
    marginRight: 20,
    borderRadius: 10,
  },
  cartItemInfo: {},
  cartItemTitle: {
    color: 'black',
    fontSize: 17,
    fontWeight: '500',
  },
  cartItemAuthor: {
    fontSize: 15,
  },
  cartItemPrice: {
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: 'lightgray',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonplus: {
    backgroundColor: '#4285FC',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityButtonTextplus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  removeButton: {
    marginLeft: 20,
    marginRight: 10,
    backgroundColor: 'rgba(66, 133, 252, 0.2)',
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  purchaseContainer: {
    padding: 20,
    backgroundColor: 'rgba(211, 211, 211, 0.2)',
    borderRadius: 10,
    marginBottom:20
  },
  purchaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  purchaseItemText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  totalAmountTextamount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'green',
  },
  purchaseButton: {
    backgroundColor: '#4285FC',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
