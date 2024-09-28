import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Alert, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarImages = [
  'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=1380&t=st=1722318227~exp=1722318827~hmac=fb12868ebad41f16070601f191ea906a1c2d63e9b32e860399fa905dc40aabca',
  'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg?w=1380&t=st=1722276201~exp=1722276801~hmac=c890fc624368a90f6ef65aa8eacdf0b41d6813b630de0e4128a22a67375cd089',
  'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?w=1380&t=st=1722276203~exp=1722276803~hmac=c2d3b94f6bda5a6ab54639ad9f3ccab0b3cbd3be4909dd5faa4fb45e36bff3c9',
  'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303065.jpg?w=1380&t=st=1722276237~exp=1722276837~hmac=b643ffd13dc50015481d1bb9be3df9a21d85278ede1103a1ce9a8d2d5c5c75cb',
];

export default function Account({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProfileImage();
    }, [])
  );

  const getProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage !== null) {
        setProfileImage({ uri: savedImage });
      }
    } catch (error) {
      console.log('Error retrieving profile image:', error);
    }
  };

  const handleProfilePress = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
          onPress: openGallery,
        },
        {
          text: 'Open Camera',
          onPress: openCamera,
        },
        {
          text: 'Choose Avatar',
          onPress: () => setModalVisible(true),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
  };

  const selectAvatar = (avatarUrl) => {
    setProfileImage({ uri: avatarUrl });
    saveProfileImage(avatarUrl); 
    setModalVisible(false);
  };
  

  const saveProfileImage = async (uri) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
    } catch (error) {
      console.log('Error saving profile image:', error);
    }
  };

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('SignIn'); 
      })
      .catch(error => {
        console.error('Sign out error:', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.Header} onPress={() => navigation.goBack()}>
          <MaterialIcons name='arrow-back-ios-new' size={20} color={'black'} />
        </TouchableOpacity>
        <View style={styles.Content}>
          <View style={styles.Content2}>
            <TouchableOpacity style={styles.Profile} onPress={handleProfilePress}>
              {profileImage ? (
                <Image source={profileImage} style={styles.ProfileImage} />
              ) : (
                <MaterialIcons name="account-circle" size={100} color="black" />
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.Welcome}>Welcome</Text>
              <Text style={styles.EmailText}>{email}</Text>
            </View>
          </View>
            <TouchableOpacity style={styles.SignOutButton} onPress={handleSignOut}>
              <FontAwesome name='sign-out' size={18}/>
            </TouchableOpacity>
        </View>
        <View style={styles.MainContent}>
          <TouchableOpacity style={styles.MainContentBox} onPress={()=>navigation.navigate('CreateBook')}>
            <View style={styles.MainContentBoxBox}>
              <MaterialCommunityIcons style={styles.MainContentBoxIcon} name='pencil' size={18} />
              <Text style={styles.MainContentBoxText}>Create Book</Text>
            </View>
            <MaterialIcons style={styles.MainContentBoxIcon} name='arrow-forward-ios' size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.MainContentBox} onPress={()=>navigation.navigate('CreatedBook')}>
            <View style={styles.MainContentBoxBox}>
              <MaterialCommunityIcons style={styles.MainContentBoxIcon} name='book-multiple' size={18} />
              <Text style={styles.MainContentBoxText}>Created Book</Text>
            </View>
            <MaterialIcons style={styles.MainContentBoxIcon} name='arrow-forward-ios' size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.MainContentBox} onPress={()=>navigation.navigate('Review')}>
            <View style={styles.MainContentBoxBox}>
              <MaterialIcons style={styles.MainContentBoxIcon} name='edit-note' size={18} />
              <Text style={styles.MainContentBoxText}>Reviews</Text>
            </View>
            <MaterialIcons style={styles.MainContentBoxIcon} name='arrow-forward-ios' size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.MainContentBox} onPress={()=>navigation.navigate('Changepass')}>
            <View style={styles.MainContentBoxBox}>
              <MaterialIcons style={styles.MainContentBoxIcon} name='password' size={18} />
              <Text style={styles.MainContentBoxText}>Change password</Text>
            </View>
            <MaterialIcons style={styles.MainContentBoxIcon} name='arrow-forward-ios' size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.MainContentBox} onPress={()=>navigation.navigate('Cart')}>
            <View style={styles.MainContentBoxBox}>
              <AntDesign style={styles.MainContentBoxIcon} name='shoppingcart' size={18} />
              <Text style={styles.MainContentBoxText}>Cart</Text>
            </View>
            <MaterialIcons style={styles.MainContentBoxIcon} name='arrow-forward-ios' size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.MainContentBox}>
            <View style={styles.MainContentBoxBox}>
              <FontAwesome style={styles.MainContentBoxIcon} name='gear' size={18} />
              <Text style={styles.MainContentBoxText}>Setting</Text>
            </View>
            <MaterialIcons style={styles.MainContentBoxIcon} name='arrow-forward-ios' size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.Help}>
              <FontAwesome5 style={styles.HelpIcon} name='headphones' size={35} color={'#384DE7'} />
              <Text style={styles.HelpText}>How can I help you?</Text>
          </TouchableOpacity>
          <View style={styles.info}>
            <TouchableOpacity style={styles.info}>
              <Text style={styles.infoText}>Private Policy</Text>
              <MaterialIcons style={styles.infoicon} name='arrow-forward-ios' size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.info}>
              <Text style={styles.infoText}>About Us</Text>
              <MaterialIcons style={styles.infoicon} name='arrow-forward-ios' size={16} />
            </TouchableOpacity>
          </View>
        </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.ModalContainer}>
          <View style={styles.ModalContent}>
            <Text style={styles.ModalHeading}>Choose Avatar</Text>
            {avatarImages.map((avatar, index) => (
              <TouchableOpacity key={index} onPress={() => selectAvatar(avatar)}>
                <Image source={{ uri: avatar }} style={styles.AvatarImage} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.ModalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.ModalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  Header:{
    margin:20
  },
  Content:{
    alignItems: 'center',
    flexDirection:'row',
    paddingHorizontal:30,
    justifyContent:'space-between',
    borderBottomWidth:0.5,
    paddingVertical:20,
    borderTopWidth:0.5,
    borderColor:'lightgrey'
  },
  Content2:{
    flexDirection:'row',
    alignItems:'center'
  },
  Profile: {
    paddingRight:20
  },
  ProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  Welcome:{
    fontSize:14
  },
  EmailText: {
    fontSize: 15,
    color:'black',
    fontWeight:'500'
  },
  SignOutButton: {},
  MainContent:{
    paddingHorizontal:20,
    paddingTop:20,
    marginTop:20
  },
  MainContentBox:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:20,
    marginVertical:7,
    backgroundColor:'rgba(211, 211, 211, 0.3)',
    borderRadius:10,
    paddingHorizontal:10
  },
  MainContentBoxBox:{
    flexDirection:'row',
    alignItems:'center'
  },
  MainContentBoxIcon:{
    paddingHorizontal:10,
    color:'black'
  },
  MainContentBoxText:{
    color:'black',
    fontSize:17,
  },
  Help:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:30,
    backgroundColor:'rgba(0, 128, 0, 0.2)',
    borderRadius:10,
    marginTop:15
  },
  HelpIcon:{
    marginRight:15
  },
  HelpText:{
    color:'black',
    fontSize:18,
    fontWeight:'500'
  },
  info:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginTop:15
  },
  infoText:{
    fontSize:16
  },
  infoicon:{
    marginLeft:5
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  ModalHeading: {
    fontSize: 20,
    marginBottom: 20,
  },
  AvatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  ModalCloseButton: {
    backgroundColor: '#384DE7',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  ModalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footerContentHomeLiveText:{
    color:'black',
    fontWeight:'600'
  },
});
