import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './components/Account';
import BookView from './components/BookView';
import Cart from './components/Cart';
import Changepass from './components/Changepass';
import CreateBook from './components/CreateBook';
import CreatedBook from './components/CreatedBook';
import Drama from './components/Drama'
import Economics from './components/Economics'
import Education from './components/Education'
import Favorite from './components/Favourite';
import HealthFitness from './components/Health&Fitness'
import Home from './components/Home';
import Horror from './components/Horror'
import Index from './components/Index';
import Library from './components/Library';
import Mystery from './components/Mystery'
import OTP from './components/OTP';
import Philosophy from './components/Philosophy'
import Politics from './components/Politics'
import Purchase from './components/Purchase';
import Religion from './components/Religion'
import Review from './components/Review';
import Romance from './components/Romance'
import ScienceFiction from './components/ScienceFiction'
import Search from './components/Search';
import SelfHelp from './components/SelfHelp'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Sports from './components/Sports'
import Technology from './components/Technology'
import Thriller from './components/Thriller'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Index' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Account" component={Account} /> 
        <Stack.Screen name="BookView" component={BookView} /> 
        <Stack.Screen name="Cart" component={Cart} /> 
        <Stack.Screen name="Changepass" component={Changepass} />
        <Stack.Screen name="CreateBook" component={CreateBook} /> 
        <Stack.Screen name="CreatedBook" component={CreatedBook} /> 
        <Stack.Screen name="Drama" component={Drama} /> 
        <Stack.Screen name="Economics" component={Economics} /> 
        <Stack.Screen name="Education" component={Education} /> 
        <Stack.Screen name="Thriller" component={Thriller} /> 
        <Stack.Screen name="Favorite" component={Favorite} /> 
        <Stack.Screen name="HealthFitness" component={HealthFitness} /> 
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Horror" component={Horror} />
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Library" component={Library} /> 
        <Stack.Screen name="Mystery" component={Mystery} /> 
        <Stack.Screen name="OTP" component={OTP} /> 
        <Stack.Screen name="Philosophy" component={Philosophy} /> 
        <Stack.Screen name="Politics" component={Politics} /> 
        <Stack.Screen name="Purchase" component={Purchase} /> 
        <Stack.Screen name="Religion" component={Religion} /> 
        <Stack.Screen name="Review" component={Review} /> 
        <Stack.Screen name="Romance" component={Romance} /> 
        <Stack.Screen name="ScienceFiction" component={ScienceFiction} /> 
        <Stack.Screen name="Search" component={Search} /> 
        <Stack.Screen name="SelfHelp" component={SelfHelp} /> 
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Sports" component={Sports} />
        <Stack.Screen name="Technology" component={Technology} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;