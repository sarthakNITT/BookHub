import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, SafeAreaView, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarImages = [
  'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=1380&t=st=1722318227~exp=1722318827~hmac=fb12868ebad41f16070601f191ea906a1c2d63e9b32e860399fa905dc40aabca',
  'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg?w=1380&t=st=1722276201~exp=1722276801~hmac=c890fc624368a90f6ef65aa8eacdf0b41d6813b630de0e4128a22a67375cd089',
  'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?w=1380&t=st=1722276203~exp=1722276803~hmac=c2d3b94f6bda5a6ab54639ad9f3ccab0b3cbd3be4909dd5faa4fb45e36bff3c9',
  'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303065.jpg?w=1380&t=st=1722276237~exp=1722276837~hmac=b643ffd13dc50015481d1bb9be3df9a21d85278ede1103a1ce9a8d2d5c5c75cb',
];

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('SignIn'); 
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

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
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.Content}>
        <Text style={styles.Heading}>Let's Get You Started</Text>
        <Text style={styles.SubHeading}>We’ve Been Waiting for You!</Text>
        <View style={styles.Button}>
          <TouchableOpacity style={styles.Profile} onPress={handleProfilePress}>
            {profileImage ? (
              <Image source={profileImage} style={styles.ProfileImage} />
            ) : (
              <MaterialIcons name="account-circle" size={100} color="black" />
            )}
          </TouchableOpacity>
          <Text style={styles.EmailText}>Email</Text>
          <TextInput
            style={styles.email}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholder="Enter Email"
            placeholderTextColor="lightgrey"
          />
          <Text style={styles.passwordText}>Password</Text>
          <TextInput
            style={styles.password}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="Enter Password"
            placeholderTextColor="lightgrey"
          />
          <Text style={styles.passwordText}>Confirm Password</Text>
          <TextInput
            style={styles.password}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
            placeholder="Confirm Password"
            placeholderTextColor="lightgrey"
          />
        </View>
        <TouchableOpacity style={styles.SignInButton} onPress={handleSignup}>
          <Text style={styles.SignInButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.OptionText}>or continue with</Text>
        <View style={styles.LogInButtons}>
          <TouchableOpacity style={styles.LogInButtonsContainer}>
            <Image
              style={[styles.LogInIcons, styles.Image]}
              source={require('./images/google.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.LogInButtonsContainer}>
            <Image
              style={styles.LogInIcons}
              source={require('./images/apple.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.LogInButtonsContainer}>
            <Image
              style={styles.LogInIcons}
              source={require('./images/facebook.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.RegisterButton}>
          <Text style={styles.RegisterButtonSubText}>already have an account? </Text>
          <TouchableOpacity style={styles.RegisterButtonBox} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.RegisterButtonBoxText}>Sign In</Text>
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
  Container: {
    flex: 1,
    padding: 25,
  },
  Content: {},
  Heading: {
    fontSize: 25,
    color: 'black',
    fontWeight: '500',
  },
  SubHeading: {
    fontSize: 16,
    marginVertical: 5,
    color: 'grey',
},
  Button: {
    marginTop: 20,
  },
  Profile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  EmailText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  email: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10,
  },
  passwordText: {
    marginTop: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  password: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    marginVertical: 10,
  },
  SignInButton: {
    alignItems: 'center',
    backgroundColor: '#384DE7',
    borderRadius: 20,
    paddingVertical: 15,
    marginTop: 20,
  },
  SignInButtonText: {
    color: 'white',
    fontSize: 17,
  },
  OptionText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
  },
  LogInButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  LogInButtonsContainer: {
    backgroundColor: 'rgba(211, 211, 211, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 10,
  },
  LogInIcons: {
    width: 30,
    height: 30,
    resizeMode: 'center',
  },
  RegisterButton: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
  },
  RegisterButtonSubText: {
    fontSize: 15.8,
  },
  RegisterButtonBox: {},
  RegisterButtonBoxText: {
    fontSize: 15.8,
    color: '#384DE7',
    fontWeight: '500',
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
});
