import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Header from './Header';
import { FontAwesome } from '@expo/vector-icons';

const ViewGroceries = ({ route }) => {
  const { groceries } = route.params;
  const [filterDays, setFilterDays] = useState(null);

  const isExpiringWithin = (expirationDate, days) => {
    const currentMoment = moment();
    const expirationMoment = moment(expirationDate, 'MM/DD/YYYY');
    if (days === 'expired') {
      return expirationMoment.isBefore(currentMoment, 'day');
    }
    return expirationMoment.diff(currentMoment, 'days') <= days;
  };

  const filteredGroceries = filterDays
    ? groceries.filter(grocery => isExpiringWithin(grocery.expirationDate, filterDays))
    : groceries;

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.header}>Here are all your groceries!</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setFilterDays(3)} style={styles.filterButton}>
            <FontAwesome name="calendar" size={20} color="white" />
            <Text style={styles.filterText}>3 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterDays(7)} style={styles.filterButton}>
            <FontAwesome name="calendar" size={20} color="white" />
            <Text style={styles.filterText}>7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterDays(14)} style={styles.filterButton}>
            <FontAwesome name="calendar" size={20} color="white" />
            <Text style={styles.filterText}>14 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterDays('expired')} style={styles.filterButton}>
            <FontAwesome name="calendar-times-o" size={20} color="white" />
            <Text style={styles.filterText}>Expired</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterDays(null)} style={styles.filterButton}>
            <FontAwesome name="list" size={20} color="white" />
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredGroceries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemContainer,
                isExpiringWithin(item.expirationDate, 7) && styles.expiringSoonContainer,
                isExpiringWithin(item.expirationDate, 'expired') && styles.expiredContainer,
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
    marginTop: 60,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6f8f2d',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    margin: 5,
    width: '30%',
    justifyContent: 'center',
  },
  filterText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
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
  expiredContainer: {
    backgroundColor: '#808080',
  },
  itemText: {
    color: 'white',
  },
});

export default ViewGroceries;

