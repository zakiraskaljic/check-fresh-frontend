import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header'; 
import SignUp from './SignUp';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {

  const navigation = useNavigation();

  const buttonsData = [
    { text: 'Login', icon: 'user-circle', isFirstButton: true, navigateTo:"Login" },

  ];

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.container}>
      <Header /> 
        <Image source={require('../assets/transparent 2.png')} style={styles.logo} />
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.text}>Let us help you keep track!</Text>
        <View style={styles.buttonContainer}>
          {buttonsData.map((button, index) => (
             <TouchableOpacity
             key={index}
             style={[styles.button, button.isFirstButton && styles.firstButton]}
             activeOpacity={0.7}
             onPress={() => navigation.navigate(button.navigateTo)} 
           >
              {button.icon ? (
                <FontAwesome name={button.icon} size={24} color={button.isFirstButton ? '#9cac54' : 'white'} style={styles.icon} />
              ) : null}
              <Text style={[styles.buttonText, button.isFirstButton && styles.firstButtonText]}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.signUpText}>
          <Text>Don't have a profile? </Text>
          <TouchableOpacity onPress={()=>navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign Up Today!</Text>
          </TouchableOpacity>
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
    marginTop: 40,
    marginBottom: 40,
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
    color: 'white',
  },
});

export default LandingPage;
