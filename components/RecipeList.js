import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecipeList = () => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('https://rich-blue-shrimp-wig.cyclic.app/recipe');
      const data = await response.json();
      setRecipes(data.data.reverse()); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const navigateToShowRecipe = (recipe) => {
    navigation.navigate('ShowRecipe', { recipe });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToShowRecipe(item)} style={styles.recipeContainer}>
      <Image source={{ uri: item.recipe_picture }} style={styles.recipeImage} />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#9cac54', marginBottom: 8 }}>Recipes</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#9cac54' }}>Check out plenty of delicious recipes.</Text>
        </View>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        contentContainerStyle={styles.recipeList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 350,
    width: 350,
    backgroundColor: 'white',
    borderRadius: 25,
    margin: 25
  },
  headerContainer: {
    margin: 30,
    marginBottom: 10,
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeList: {
    paddingHorizontal: 10,
  },
  recipeContainer: {
    marginTop: 30,
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#9cac54',
    width: 120,
    height: 200,
  },
  recipeImage: {
    width: 130,
    height: 100,
  },
  recipeDetails: {
    padding: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  recipeCategory: {
    fontSize: 14,
    color: 'white',
  },
});

export default RecipeList;

