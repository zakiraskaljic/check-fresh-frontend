import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getFirebaseApp } from "../utils/firebaseHelper";
import { getFirestore, doc } from 'firebase/firestore'; 
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const GroceryList = ({ userId }) => {
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
  }, [userId]);

  const deleteGrocery = async (id) => {
    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'groceries', id));
      fetchGroceries();
    } catch (error) {
      console.error('Error deleting grocery: ', error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white', borderRadius: 25, height: 330, width: 350, marginBottom:30}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30 }}>
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#9cac54', marginBottom: 8 }}>My Current Groceries</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#9cac54' }}>Check out what you currently have in storage, and what's their expiration date.</Text>
        </View>
      </View>
      <SwipeListView
        data={groceries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <View style={styles.groceryContainer}>
              <Text style={{ color: 'white' }}>Name: {item.name}</Text>
              <Text style={{ color: 'white' }}>Expiration Date: {item.expirationDate}</Text>
              <TouchableOpacity onPress={() => deleteGrocery(item.id)} style={styles.trashIcon}>
                <Icon name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        disableRightSwipe={true}
        horizontal={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('AddGrocery', { userId: userId })}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#9cac54', textAlign: 'center' }}> + Add New Ones</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
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
  trashIcon: {
    position: 'absolute',
    bottom: 10, 
    right: 10, 
  },
  button1: {
    borderRadius: 40,
    backgroundColor: 'white',
    borderColor: '#9cac54',
    borderWidth: 2,
    padding: 5,
    width: 140,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 30,
  },
});
export default GroceryList; 