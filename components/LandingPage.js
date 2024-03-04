import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LandingPage = () => {
  const buttonsData = [
    { text: 'My Profile Page', icon: 'user-circle', isFirstButton: true },
    { text: '+ Add New Item', icon: '', isFirstButton: false },
    { text: 'Find New Recipe', icon: '', isFirstButton: false },
  ];

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/transparent 2.png')} style={styles.logo} />
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.text}>Let us help you keep track!</Text>
        <View style={styles.buttonContainer}>
          {buttonsData.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, button.isFirstButton && styles.firstButton]}
              activeOpacity={0.7}
            >
              {button.icon ? (
                <FontAwesome name={button.icon} size={24} color={button.isFirstButton ? '#9cac54' : 'white'} style={styles.icon} />
              ) : null}
              <Text style={[styles.buttonText, button.isFirstButton && styles.firstButtonText]}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.signUpText}>
          Don't have a profile? 
          <Text style={styles.signUpLink}> Sign Up Today!</Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  text: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    width: '80%',
    marginBottom: 15,
    paddingVertical: 12,
  },
  firstButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
  },
  firstButtonText: {
    color: '#9cac54',
  },
  icon: {
    marginRight: 10,
  },
  signUpText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  signUpLink: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LandingPage;
