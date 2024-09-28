import { StyleSheet, SafeAreaView, View, ImageBackground, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';

export default function Index({ navigation }) {

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
        <ImageBackground style={styles.background}source={require('./images/book1.jpeg')}>
            <View style={styles.Content}>
                <Text style={styles.Heading}>BookHub</Text>
                <Text style={styles.SubHeading}>Books are a meeting of two forces that have succeeded in influencing human education.</Text>
                <TouchableOpacity style={styles.ReadButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.ReadButtonText}>Read Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SignUpButton} onPress={handleProfileNavigation}>
                    <Text style={styles.SignUpButtonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    background:{
        flex:1,
    },
    Content:{
        flex:1,
        padding:24,
        justifyContent:'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    Heading:{
        color:'#DED8D3',
        fontSize:40,
        fontWeight:'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        marginVertical:10,
        textAlign:'center'
    },
    SubHeading:{
        textAlign:'center',
        color:'#DED8D3',
        fontSize:16,
        marginBottom:10
    },
    ReadButton:{
        backgroundColor: 'rgba(120, 70, 35, 0.85)',
        borderRadius:20,
        marginTop:20,
        marginHorizontal:30
    },
    ReadButtonText:{
        color:'#DED8D3',
        fontSize:18,
        fontWeight:'600',
        textAlign:'center',
        paddingVertical:10
    },
    SignUpButton:{
        backgroundColor: 'rgba(120, 70, 35, 0.85)',
        borderRadius:20,
        marginTop:20,
        marginHorizontal:30
    },
    SignUpButtonText:{
        color:'#DED8D3',
        fontSize:18,
        fontWeight:'600',
        textAlign:'center',
        paddingVertical:10
    }
})