import React from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import moment from 'moment';
import Header from './Header';

const ViewGroceries = ({ route }) => {
  const { groceries } = route.params;

  const isExpiringSoon = (expirationDate) => {
    const currentMoment = moment();
    const expirationMoment = moment(expirationDate, 'MM/DD/YYYY'); // Specify the format
    return expirationMoment.diff(currentMoment, 'days') <= 7;
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.header}>Here are all your groceries!</Text>
        <FlatList
          data={groceries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemContainer,
                isExpiringSoon(item.expirationDate) && styles.expiringSoonContainer,
              ]}
            >
              <Text style={styles.itemText}>Name: {item.name}</Text>
              <Text style={styles.itemText}>Expiration Date: {item.expirationDate}</Text>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    marginTop: 20,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#9cac54',
    borderRadius: 10,
    marginBottom: 10,
  },
  expiringSoonContainer: {
    backgroundColor: '#c04000',
  },
  itemText: {
    color: 'white',
  },
});

export default ViewGroceries;
