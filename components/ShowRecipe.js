import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, ScrollView, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import Header from './Header';

const ShowRecipe = ({ route }) => {
  const { recipe } = route.params;

  return (  
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <SafeAreaView style={styles.container}>
      <Header/>
          <View style={styles.recipeContainer}>
            <Image source={{ uri: recipe.recipe_picture }} style={styles.recipeImage} />
            <View style={styles.recipeDetails}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeCategory}>{recipe.category}</Text>
              <Text style={styles.recipeIngredientsTitle}>Ingredients:</Text>
              <Text style={styles.recipeIngredients}>{recipe.ingredients}</Text>
            </View>
          </View>
        </SafeAreaView>
    </ImageBackground>
  );
};

ShowRecipe.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
},
container: {
  flex: 1,
  margin: 30,
  marginTop: 100
},
  recipeImage: {
    height: 250,
    width: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  recipeDetails: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeCategory: {
    fontSize: 18,
    color: '#9cac54',
    marginBottom: 10,
  },
  recipeContainer: {
    backgroundColor: 'white',
    margin: 30,
    borderRadius: 30,
    width: '100%',
    marginLeft: -5
  },
  recipeIngredientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ShowRecipe;
