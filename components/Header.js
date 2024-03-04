import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
    return (
        <View style={styles.header}>
            <Image
                source={require('../assets/transparent 2 narrow 2.png')}
                style={styles.logo}
                resizeMode="contain" 
            />
            <TouchableOpacity onPress={() => console.log('Menu button pressed')}>
            <Ionicons name="menu" size={40} color="white" />
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

export default Header;
