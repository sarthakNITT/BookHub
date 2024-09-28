import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

export default function Changepass({ navigation }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleChangePassword = () => {
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        const user = auth().currentUser;

        user.updatePassword(newPassword)
            .then(() => {
                Alert.alert('Success', 'Password changed successfully');
                navigation.goBack(); 
            })
            .catch(error => {
                if (error.code === 'auth/requires-recent-login') {
                    Alert.alert('Error', 'Please re-login and try again');
                    auth().signOut().then(() => navigation.navigate('SignIn'));
                } else {
                    Alert.alert('Error', error.message);
                }
            });
    };

    return (
        <SafeAreaView style={styles.Container}>
            <View style={styles.Content}>
                <Text style={styles.Heading}>Change Password</Text>
                <View style={styles.Button}>
                    <Text style={styles.EmailText}>New Password</Text>
                    <TextInput
                        style={styles.password}
                        onChangeText={setNewPassword}
                        value={newPassword}
                        secureTextEntry
                        placeholder='New Password'
                        placeholderTextColor="lightgrey"
                    />
                    <Text style={styles.passwordText}>Confirm Password</Text>
                    <TextInput
                        style={styles.password}
                        onChangeText={setConfirmNewPassword}
                        value={confirmNewPassword}
                        secureTextEntry
                        placeholder='Confirm New Password'
                        placeholderTextColor="lightgrey"
                    />
                </View>
                <TouchableOpacity style={styles.SignInButton} onPress={handleChangePassword}>
                    <Text style={styles.SignInButtonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        padding: 25,
    },
    Content: {
        marginVertical: 50,
    },
    Heading: {
        fontSize: 25,
        color: 'black',
        fontWeight: '500',
    },
    Button: {
        marginTop: 40,
    },
    EmailText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
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
});
