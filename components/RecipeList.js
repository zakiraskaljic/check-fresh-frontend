import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: 'c18fa0d2df9e4b1fb46a35114867bcee',
          query: 'a',
          maxFat: 25,
          number: 15
        }
      });
      setRecipes(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ShowRecipe', { recipeId: item.id })}>
      <View style={styles.recipeItem}>
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        <Text style={styles.recipeTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30 }}>
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#9cac54', marginBottom: 8 }}>Recipes</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#9cac54' }}>Check out plenty of delicious recipes.</Text>
        </View>
      </View>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
  },
  headerContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  recipeItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  recipeImage: {
    width: 200,
    height: 140,
    borderRadius: 10,
    marginBottom: 5,
  },
  recipeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#9cac54',
  },
});

export default RecipeList;
