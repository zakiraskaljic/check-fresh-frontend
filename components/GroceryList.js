import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getFirebaseApp } from "../utils/firebaseHelper";
import { getFirestore, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';

const GroceryList = ({ userId, onRefresh }) => {
  const navigation = useNavigation();
  const [groceries, setGroceries] = useState([]);

  const fetchGroceries = async () => {
    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const groceriesRef = collection(db, 'groceries');
      const q = query(groceriesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const groceryList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroceries(groceryList);
    } catch (error) {
      console.error('Error fetching groceries: ', error);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, [userId, onRefresh]);

  const deleteGrocery = async (id) => {
    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'groceries', id));
      fetchGroceries();
      if (onRefresh) {
        onRefresh(); // Notify parent component to refresh
      }
    } catch (error) {
      console.error('Error deleting grocery: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>My Current Groceries</Text>
        <Text style={styles.subHeaderText}>Check out what you currently have in storage, and what's their expiration date.</Text>
      </View>
      <SwipeListView
        data={groceries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groceryContainer}>
            <Text style={styles.groceryText}>Name: {item.name}</Text>
            <Text style={styles.groceryText}>Expiration Date: {item.expirationDate}</Text>
            <TouchableOpacity onPress={() => deleteGrocery(item.id)} style={styles.trashIcon}>
              <Icon name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        disableRightSwipe={true}
        horizontal={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewGroceries', { groceries })}>
          <Text style={styles.buttonText}>View Them All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddGrocery', { userId })}>
          <Text style={styles.buttonText}>+ Add New Ones</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    marginBottom: 30,
    height: '40%'
  },
  headerContainer: {
    padding: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9cac54',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#9cac54',
  },
  groceryContainer: {
    padding: 10,
    backgroundColor: '#9cac54',
    borderRadius: 10,
    marginHorizontal: 10,
    width: 130,
    height: 110,
    position: 'relative',
  },
  groceryText: {
    color: 'white',
  },
  trashIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 20,
  },
  button: {
    borderRadius: 40,
    backgroundColor: 'white',
    borderColor: '#9cac54',
    borderWidth: 2,
    padding: 5,
    width: 140,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9cac54',
    textAlign: 'center',
  },
});

export default GroceryList;
