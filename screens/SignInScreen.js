import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = ({ navigation }) => {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const onSignInClicked = async () => {
        console.log(`email: ${userEmail}`);
        console.log(`password: ${userPassword}`);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            console.log(auth.currentUser);
            alert(`Login success!`);
            navigation.navigate('Group 6 Car Inc.');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Group 6 Car Inc.</Text>
            <Text style={styles.subtitle}>Renter</Text>

            <TextInput
                style={styles.inputStyle}
                placeholder='User Email'
                textContentType='emailAddress'
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='next'
                value={userEmail}
                onChangeText={setUserEmail}
            />

            <TextInput
                style={styles.inputStyle}
                placeholder='Password'
                textContentType='password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                value={userPassword}
                onChangeText={setUserPassword}
            />

            <TouchableOpacity style={styles.loginButton} onPress={onSignInClicked}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    inputStyle: {
        height: 50,
        width: '100%',
        marginVertical: 8,
        paddingHorizontal: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
    },
    loginButton: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SignInScreen;
