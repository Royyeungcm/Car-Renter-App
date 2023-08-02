import { useState } from 'react';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabActions } from '@react-navigation/native';
import ListingScreen from './ListingScreen';
import ManageScreen from './ManageScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RenterScreen = ({ navigation, route }) => {


    return (

            <Tab.Navigator>
                <Tab.Screen options={{ headerShown: false, }} name="Car List" component={ListingScreen} />
                <Tab.Screen name="Manage" component={ManageScreen} />
            </Tab.Navigator>

    )
}
const styles = StyleSheet.create({
    inputStyle: {
        height: 50,
        margin: 8,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
    }
});

export default RenterScreen;