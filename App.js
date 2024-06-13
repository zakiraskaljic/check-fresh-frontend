import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUp, LandingPage, Login, Homepage, GroceryList, AddGrocery } from './components';
import ViewGroceries from './components/ViewGroceries';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ShowRecipe from './components/ShowRecipe';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'), 
  });

  if (!fontsLoaded) {
    return null; 
  }
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName='LandingPage'>
        <Stack.Screen
            name="LandingPage"
            component={LandingPage}
        />
        <Stack.Screen
            name="SignUp"
            component={SignUp}
        />
        <Stack.Screen
            name="Login"
            component={Login}
        />
        <Stack.Screen
            name="Homepage"
            component={Homepage}
        />
        <Stack.Screen
            name="GroceryList" 
            component={GroceryList} 
        />
        <Stack.Screen
            name="AddGrocery" 
            component={AddGrocery} 
        />
        <Stack.Screen
            name="ShowRecipe" 
            component={ShowRecipe} 
        />
         <Stack.Screen
            name="ViewGroceries"
            component={ViewGroceries}
         />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>

  );
};

export default App;
