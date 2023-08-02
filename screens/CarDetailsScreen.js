import { Button } from 'react-native';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker } from "react-native-maps";


import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { setDoc, doc } from "firebase/firestore";


const CarDetailsScreen = ({ navigation, route }) => {

    return (
        <View>
            <Text>Hello</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    inputStyle: {
        height: 50,
        margin: 8,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
    },
    tb: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#efefef",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
    }
});

export default ListingScreen;