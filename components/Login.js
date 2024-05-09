import React, { useState, useReducer, useCallback } from "react";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "./Input";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from "../utils/actions/authActions";

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? "example@gmail.com" : "",
    password: isTestMode ? "**********" : ""
  },
  inputValidities: {
    email: false,
    password: false
  },
  formIsValid: false,
};

const Login = ({navigation}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const dispatch = useDispatch();

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
          const result = validateInput(inputId, inputValue);
          dispatchFormState({ inputId, validationResult: result, inputValue });
        },
        [dispatchFormState]
      );
    
    const authHandler = async () => {
        try {
            setIsLoading(true);
            const email = formState.inputValues.email;
            const password = formState.inputValues.password;
            
            await dispatch(signIn(email, password));
            
            navigation.navigate("Homepage");
            
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error", error.message);
        }
    };    

    return (
        <ScrollView>
            <Image
                source={require('../assets/transparent narrow colour 2.png')}
                style={styles.headerlogo}
                resizeMode="contain" 
            />
            <View style={styles.container}>
            <Image source={require('../assets/signuplogo.png')} style={styles.logo} />
            <Text style={styles.header}>Login</Text>
            <Text style={styles.text}>Make your Own Profile!</Text>

            <Input
                id="email"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["email"]}
                placeholder="Email"
                keyboardType="email-address"
            />
            <Input
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["password"]}
                autoCapitalize="none"
                id="password"
                placeholder="Password"
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} 
                onPress={authHandler} 
                disabled={isLoading} 
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <View
            style={styles.bottomContainer}>
            <Text>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ fontFamily: 'Roboto-Regular' }}> Sign Up</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerlogo: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 240,
        height: 100,
    },
    logo: {
        width: 150,
        height: 150,
    },
    text: {
        fontSize: 24,
        color: '#9cac54',
        marginBottom: 20,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#9cac54',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#9cac54',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#9cac54',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 2,
      },
});

export default Login;
