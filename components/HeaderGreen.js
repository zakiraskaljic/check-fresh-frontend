import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderGreen = () => {
    return (
        <View style={styles.header}>
            <Image
                source={require('../assets/transparent narrow colour 2.png')}
                style={styles.logo}
                resizeMode="contain" 
            />
            <TouchableOpacity onPress={() => console.log('Menu button pressed')}>
            <Ionicons name="menu" size={40} color="#9cac54" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        width: '100%',
        marginTop: '-20%',
    },
    logo: {
        width: 240, 
        height: 100, 
    },
});

export default HeaderGreen;