import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground, Image, ScrollView } from 'react-native';
import GroceryList from './GroceryList';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './Header';
import RecipeList from './RecipeList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const Homepage = ({ route }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groceries, setGroceries] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        setLoading(false);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchGroceries();
    }
  }, [userId, refresh]);

  const fetchGroceries = async () => {
    try {
      const db = getFirestore();
      const groceriesRef = collection(db, 'groceries');
      const q = query(groceriesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const groceriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroceries(groceriesList);
    } catch (error) {
      console.error('Error fetching groceries: ', error);
    }
  };

  useEffect(() => {
    const { refresh } = route.params || {};
    if (refresh) {
      setRefresh(true);
    }
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Please log in to access the homepage.</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <ScrollView>
        <Header userId={userId} />
        <View style={styles.centeredContainer}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Image source={require('../assets/transparent 2.png')} style={styles.icon} />
              <View>
                <Text style={styles.headerText}>My Home Page</Text>
                <Text style={styles.subHeaderText}>Let us help you keep track!</Text>
              </View>
            </View>
            <GroceryList userId={userId} onRefresh={() => setRefresh(!refresh)} />
            <RecipeList />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  subHeaderText: {
    fontSize: 22,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Homepage;
