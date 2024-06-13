import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from "../utils/firebaseHelper";
import moment from 'moment';
import Header from './Header';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const AddGrocery = ({ route, navigation }) => {
  const { userId } = route.params;
  const [groceryName, setGroceryName] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleAddGrocery = async () => {
    try {
      if (!groceryName || !expirationDate) {
        Alert.alert('Error', 'Please enter grocery name and expiration date.');
        return;
      }

      const formattedDate = moment(expirationDate).format('MM/DD/YYYY');
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const groceriesRef = collection(db, 'groceries');
      await addDoc(groceriesRef, { userId, name: groceryName, expirationDate: formattedDate });

      Alert.alert('Success', 'Grocery added successfully.');
      setGroceryName('');
      setExpirationDate(new Date());

      navigation.navigate('Homepage', { refresh: true });

      await schedulePushNotification(groceryName, expirationDate);
    } catch (error) {
      console.error('Error adding grocery: ', error);
      Alert.alert('Error', 'Failed to add grocery item.');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (event, date) => {
    if (date) {
      setExpirationDate(date);
    }
    hideDatePicker();
  };

  async function handleAddGroceryAndNotify() {
    await handleAddGrocery();
  }

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        <Header />
        <Image source={require('../assets/transparent 2.png')} style={styles.logo} />
        <Text style={styles.header}>Add Grocery</Text>
        <TextInput
          style={styles.input}
          placeholder="Grocery Name"
          placeholderTextColor="white"
          value={groceryName}
          onChangeText={text => setGroceryName(text)}
        />
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text style={{ color: 'white' }}>
            {expirationDate ? moment(expirationDate).format('MM/DD/YYYY') : "Select Expiration Date"}
          </Text>
        </TouchableOpacity>
        {isDatePickerVisible && (
          <DateTimePicker
            value={expirationDate}
            mode="date"
            display="calendar"
            onChange={handleConfirm}
          />
        )}
        <TouchableOpacity style={styles.button} title="Add Grocery" onPress={handleAddGroceryAndNotify}>
          <Text style={styles.buttonText}> Add Grocery</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

async function schedulePushNotification(groceryName, expirationDate) {
  const currentMoment = moment();
  const expirationMoment = moment(expirationDate, 'MM/DD/YYYY');

  let trigger;
  let notificationBody;

  if (expirationMoment.diff(currentMoment, 'days') <= 7) {
    console.log('Expiration date is within 7 days, scheduling notification for 2 seconds from now.');
    trigger = { seconds: 2 };
    notificationBody = `Your ${groceryName} is about to expire in ${expirationMoment.diff(currentMoment, 'days')} days!`;
  } else {
    const triggerMoment = expirationMoment.subtract(7, 'days');
    trigger = { date: triggerMoment.toDate() };
    notificationBody = `Your ${groceryName} is about to expire in 7 days!`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Expiration Date Reminder",
      body: notificationBody,
    },
    trigger,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  input: {
    borderWidth: 2,
    padding: 20,
    color: 'white',
    borderRadius: 20,
    marginTop: 10,
    borderColor: 'white',
    width: '70%',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    margin: 50,
  },
  button: {
    borderWidth: 2,
    padding: 20,
    color: 'white',
    borderRadius: 35,
    marginTop: 10,
    borderColor: 'white',
    width: '50%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default AddGrocery;



