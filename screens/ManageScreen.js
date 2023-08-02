import { Button } from 'react-native';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { setDoc, doc } from "firebase/firestore";


export default function ManageScreen() { 
    return (
        <View style={styles.container}>
            <Text>This is the settings screen</Text>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding:20
    },
  });
  