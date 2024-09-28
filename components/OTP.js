import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const OTPInput = ({ value, onChangeText, style }) => {
  return (
    <TextInput
      style={[styles.OTPBox, style]}
      value={value}
      onChangeText={onChangeText}
      maxLength={1}
      keyboardType="numeric"
    />
  );
};

export default function OTP({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.Content}>
        <Text style={styles.Heading}>Enter OTP</Text>
        <Text style={styles.SubHeading}>Enter the OTP sent to your registered mobile number and email Id.</Text>
        <View style={styles.OTPContainer}>
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.SubmitButton} onPress={() => navigation.navigate('Changepass')}>
          <Text style={styles.Submit}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Content: {
    width: '80%',
    alignItems: 'center',
  },
  Heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black',
    marginBottom: 10,
  },
  SubHeading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  OTPContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  OTPBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 18,
    marginRight: 10,
    borderRadius:10
  },
  Submit:{
    marginVertical:20,
    backgroundColor: '#384DE7',
    borderRadius:10,
    paddingHorizontal:50,
    paddingVertical:10,
    color:'white'
  },

});
