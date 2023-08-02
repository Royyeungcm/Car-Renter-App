import { useState } from 'react';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';



const SignInScreen = ({ navigation, route }) => {

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const onSignInClicked = async() => {
        console.log(`email: ${userEmail}`)
        console.log(`password: ${userPassword}`)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword )
            console.log(auth.currentUser)
            alert(`Login success!`)
            navigation.navigate('Renter')

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View>
            <Text>ABC Car Inc.</Text>
            <Text>Renter</Text>

            <TextInput
                style={styles.inputStyle}
                placeholder='User Email'
                textContentType='emailAddress'
                autoCapitalize='none'
                autoCorrect='none'
                returnKeyType='Go'
                value={userEmail}
                onChangeText={setUserEmail}
            />

            <TextInput
                style={styles.inputStyle}
                placeholder='Password'
                textContentType='password'
                autoCapitalize='none'
                autoCorrect='none'
                returnKeyType='Go'
                value={userPassword}
                onChangeText={setUserPassword}
            />

            <Button title='Login' onPress={onSignInClicked} />
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
    }
});

export default SignInScreen;