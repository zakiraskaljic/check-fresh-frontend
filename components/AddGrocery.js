import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from "../utils/firebaseHelper";
import moment from 'moment'; 
import Header from './Header'; 

const AddGrocery = ({ route, navigation }) => { 
  const { userId } = route.params;
  const [groceryName, setGroceryName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleAddGrocery = async () => {
    try {
      if (!groceryName || !expirationDate) {
        Alert.alert('Error', 'Please enter grocery name and expiration date.');
        return;
      }

      const parsedDate = moment(expirationDate, ['DD/MM/YYYY', 'MM/YYYY', 'YYYY', 'MM/DD/YYYY'], true);
      if (!parsedDate.isValid()) {
        Alert.alert('Error', 'Invalid expiration date format.');
        return;
      }

      const year = parsedDate.year();
      const month = parsedDate.month() + 1; 
      const day = parsedDate.date();

      const formattedExpirationDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

      const app = getFirebaseApp();
      const db = getFirestore(app);
      const groceriesRef = collection(db, 'groceries');
      await addDoc(groceriesRef, { userId, name: groceryName, expirationDate: formattedExpirationDate });

      Alert.alert('Success', 'Grocery added successfully.');
      setGroceryName('');
      setExpirationDate('');
      
      navigation.navigate('Homepage');
    } catch (error) {
      console.error('Error adding grocery: ', error);
      Alert.alert('Error', 'Failed to add grocery item.');
    }
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
      <Header />
      <Image source={require('../assets/transparent 2.png')} style={styles.logo} /> 
      <Text style={styles.header}>Add Grocery</Text>
      <TextInput
        style={styles.input}
        placeholder="Grocery Name"
        placeholderTextColor="white"
        value={groceryName}
        onChangeText={text => setGroceryName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiration Date (DD/MM/YYYY, MM/YYYY, YYYY, MM/DD/YYYY)"
        placeholderTextColor="white"
        value={expirationDate}
        onChangeText={text => setExpirationDate(text)}
      />
      <TouchableOpacity style={styles.button} title="Add Grocery" onPress={handleAddGrocery} >
        <Text style={styles.buttonText}> Add Grocery</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
    },
    input: {
        borderWidth: 2,
        padding: 20,
        color: 'white',
        borderRadius: 20,
        marginTop: 10,
        borderColor: 'white',
        width: '70%' ,
        marginBottom: 20
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
        margin: 50
    },
    button: {
        borderWidth: 2,
        padding: 20,
        color: 'white',
        borderRadius: 35,
        marginTop: 10,
        borderColor: 'white',
        width: '50%'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18
    },
});

export default AddGrocery; 