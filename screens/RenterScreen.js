import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ListingScreen from './ListingScreen';
import ManageScreen from './ManageScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RenterScreen = ({ navigation, route }) => {


    return (

        <Tab.Navigator>
            <Tab.Screen
                options={{
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="car" size={size} color={color} />
                    )
                }}
                name="Car List"
                component={ListingScreen} />

            <Tab.Screen
                options={{
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    )
                }}
                name="Manage"
                component={ManageScreen} />
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