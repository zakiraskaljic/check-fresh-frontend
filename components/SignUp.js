import React, { useState, useReducer, useCallback, useEffect } from "react";
import { reducer } from "../utils/reducers/formReducers";
import { useDispatch } from 'react-redux';
import { validateInput } from "../utils/actions/formActions";
import Input from "./Input";
import { signUp } from "../utils/actions/authActions";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? "John Doe" : "",
    email: isTestMode ? "example@gmail.com" : "",
    password: isTestMode ? "**********" : ""
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false
  },
  formIsValid: false,
};

const SignUp = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const dispatch = useDispatch();
    const [error, setError] = useState();

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue });
        },
        [dispatchFormState]
    );

    const authHandler = async ()=>{
        try{
            setIsLoading(true);
            const action = signUp(
            formState.inputValues.fullName, 
            formState.inputValues.email, 
            formState.inputValues.password
            )
        await dispatch(action);
        Alert.alert("Account Created","Account has been successfully created!")
        setError(null)
        setIsLoading(false)
        navigation.navigate("Login")
     
        }catch(error){
            console.log(error);
            setIsLoading(false);
            setError(error.message)
        }
    }

    useEffect(() => {
        if (error) {
        Alert.alert("An error occured", error);
        }
    }, [error]);


    return (
        <ScrollView>
            <Image
                source={require('../assets/transparent narrow colour 2.png')}
                style={styles.headerlogo}
                resizeMode="contain" 
            />
            <View style={styles.container}>
            <Image source={require('../assets/signuplogo.png')} style={styles.logo} />
            <Text style={styles.header}>Sign Up</Text>
            <Text style={styles.text}>Make your Own Profile!</Text>

            <Input
                style={styles.input}
                id="fullName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["fullName"]}
                placeholder="Name"
            />
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
                isLoading={isLoading}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View
            style={styles.bottomContainer}>
            <Text>
              Already have an account ?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text> Login</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200,
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

export default SignUp;
