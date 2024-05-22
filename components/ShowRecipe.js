import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import Header from './Header';

const ShowRecipe = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchRecipeDetails();
  }, []);

  const fetchRecipeDetails = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          apiKey: 'c18fa0d2df9e4b1fb46a35114867bcee',
          includeNutrition: false
        }
      });
      setRecipe(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <Header/> 
      <View style={styles.centerContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.summary}>{recipe.summary.replace(/<[^>]+>/g, '')}</Text>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.extendedIngredients.map(ingredient => (
            <Text key={ingredient.id} style={styles.ingredient}>
              {ingredient.original}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.analyzedInstructions[0]?.steps.map(step => (
            <Text key={step.number} style={styles.instruction}>
              {step.number}. {step.step}
            </Text>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    width: '90%', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    margin: 50
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  summary: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ShowRecipe;
