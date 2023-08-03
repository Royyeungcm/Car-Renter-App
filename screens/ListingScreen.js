import { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from "react-native-maps";
import { auth, db } from "../firebaseConfig";
import { doc, getDocs, collection, getDoc, updateDoc, addDoc } from "firebase/firestore";
import 'firebase/firestore';
import * as Location from 'expo-location';


const ListingScreen = ({ navigation, route }) => {

    const [ownerList, setOwnerList] = useState([]);
    const [availableCarList, setAvailableCarList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [currentUserName, setCurrentUserName] = useState("");
    const [deviceLat, setDeviceLat] = useState();
    const [deviceLng, setDeviceLng] = useState();



    const colRef = collection(db, "OwnerProfiles");

    useEffect(() => {
        getCurrentLocation();
        emptyBothList();
        getAllOwners();
        getUserName();
    }, [])

    const emptyBothList = () => {
        setOwnerList([]);
        setAvailableCarList([]);
    }

    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert(`Permission to access location was denied`)
                return
            }
            let location =
                await Location.getCurrentPositionAsync();
            setDeviceLat(location.coords.latitude)
            setDeviceLng(location.coords.longitude)
        } catch (err) {
            console.log(err)
        }
    }



    const getAllOwners = async () => {
        try {
            const docsSnap = await getDocs(colRef);
            docsSnap.forEach(doc => {
                ownerList.push(doc.id);
            })
            ownerList.forEach((currentOwner) => {
                getAllCars(currentOwner)
            })
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    const getAllCars = async (currentOwner) => {
        const colRefAllOwners = collection(db, "OwnerProfiles", `${currentOwner}`, "Listing");
        try {
            const docsSnap = await getDocs(colRefAllOwners);
            docsSnap.forEach(doc => {
                if (doc.data().status !== "Approved") {
                    const newList = doc.data()
                    newList.id = doc.id
                    setAvailableCarList((car) => [...car, newList])

                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getUserName = async () => {
        console.log(auth.currentUser.uid)
        try {
            const querySnapshot = await getDoc(doc(db, "UserProfiles", auth.currentUser.uid));
            console.log(querySnapshot.exists())
            console.log(querySnapshot.data().name)
            setCurrentUserName(querySnapshot.data().name)
        } catch (error) {
            console.log("Error getting name: ", error)
        }
    }


    const onCalloutPressed = async (currItem) => {
        console.log(currItem)
        console.log(currItem.id)
        const currentDate = new Date();
        const randomMilliseconds = Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000);
        const futureDate = new Date(currentDate.getTime() + randomMilliseconds);
        const shortFutureDate = futureDate.toDateString()
        console.log(shortFutureDate)

        const waitingListDataToBeAdded = {
            confirmationCode: "",
            data: shortFutureDate,
            id: auth.currentUser.uid,
            name: currentUserName
        }

        let newList = currItem.waitingList
        newList.push(waitingListDataToBeAdded)
        console.log(newList)


        try {
            const docRef = doc(db, "OwnerProfiles", currItem.ownerID, "Listing", currItem.id)
            const docSnapshot = await updateDoc(docRef, { waitingList: newList });
        } catch (err) {
            console.log('Pushing error:', err)
        }

        const reservedToBeAdded = {
            CarID: currItem.id,
            confirmationCode: "",
            status: "Needs Approval",
            OwnerID: currItem.ownerID,
            data: shortFutureDate,
        }

        try {
            const docRef = collection(db, "UserProfiles", auth.currentUser.uid, "Reserved")
            const docSnapshot = await addDoc(docRef, reservedToBeAdded)
        } catch (err) {
            console.log('Addeding reserved:', err)
        }

        alert("You have sent the request to the owner!")
    }


    if (!isLoading) {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 43.6532,
                        longitude: -79.3832,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {availableCarList.map((currItem, pos) => (
                        <Marker key={pos} coordinate={{ latitude: parseFloat(currItem.lat), longitude: parseFloat(currItem.lon) }}>
                            <View style={styles.priceTagBorder}>
                                <Text style={styles.priceTag}>${currItem.price}</Text>
                            </View>
                            <Callout onPress={() => onCalloutPressed(currItem)}>
                                <View style={styles.calloutBox}>
                                    <Image source={{ uri: currItem.photos[0].photoURL }} style={styles.carImage} resizeMode="cover" />
                                    <Text style={styles.carInfo}>Brand: {currItem.brand}</Text>
                                    <Text style={styles.carInfo}>Model: {currItem.model}</Text>
                                    <Text style={styles.carInfo}>Price: ${currItem.price}</Text>
                                    <TouchableOpacity style={styles.bookButton} onPress={() => onCalloutPressed(currItem)}>
                                        <Text style={styles.buttonText}>Book Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>LOADING...</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    priceTagBorder: {
        width: 60,
        height: 30,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceTag: {
        fontWeight: 'bold',
    },
    calloutBox: {
        width: 300,
    },
    carImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    carInfo: {
        marginBottom: 5,
    },
    bookButton: {
        backgroundColor: 'blue',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ListingScreen;
