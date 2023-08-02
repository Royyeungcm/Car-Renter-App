import { Button, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from "react-native-maps";


import { auth, db } from "../firebaseConfig";


import { setDoc, doc, Firestore, getDocs, collection, getDoc } from "firebase/firestore";

import 'firebase/firestore';


const ListingScreen = ({ navigation, route }) => {

    const [ownerList, setOwnerList] = useState([]);
    const [availableCarList, setAvailableCarList] = useState([]);
    const [isLoading, setLoading] = useState(true);


    const colRef = collection(db, "OwnerProfiles");

    useEffect(() => {
        emptyBothList();
        console.log("Getting the owners.");
        getAllOwners();
    }, [])

    const emptyBothList = () => {
        setOwnerList([]);
        setAvailableCarList([]);
    }

    const getAllOwners = async () => {
        try {
            const docsSnap = await getDocs(colRef);
            docsSnap.forEach(doc => {
                // console.log(doc.data());
                console.log(doc.id);
                ownerList.push(doc.id);
            })
            console.log(`The all owners are: ${ownerList}`)
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
                console.log(doc.data());
                if (doc.data().status !== "Approved") {
                    // availableCarList.push(doc.data())
                    setAvailableCarList((prevList) => [...prevList, doc.data()])
                }
            })
            console.log(`Total available cars: ${availableCarList.length}`)
            checking();
        } catch (error) {
            console.log(error);
        }
    }

    const checking = () => {
        console.log(`Pressed`)
        console.log(availableCarList.length)
        availableCarList.forEach((currItem) => {
            console.log(`${currItem.lat} , ${currItem.lon}`)
        })
    }

    const getUserName = () => {
        
    }


    const onCalloutPressed = (currItem) => {
        console.log(`Pressed`)
        const currentDate = new Date();
        console.log(currentDate)
        const randomMilliseconds = Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000);
        const futureDate = new Date(currentDate.getTime() + randomMilliseconds);
        console.log(futureDate)

        const waitingListDataToBeAdded = {
            confirmationCode: "",
            data: futureDate,
            id: auth.currentUser.uid,

        }


        


    }


    if (isLoading == false) {
        return (
            <View>
                <MapView
                    style={{ height: "100%", width: "100%" }}
                    initialRegion={{
                        latitude: 43.6532,
                        longitude: -79.3832,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {
                        availableCarList.map(
                            (currItem, pos) => {
                                const coords = {
                                    latitude: parseFloat(currItem.lat),
                                    longitude: parseFloat(currItem.lon)
                                }

                                return (
                                    <Marker
                                        key={pos}
                                        coordinate={coords}
                                        onCalloutPress={onCalloutPressed(currItem)}
                                    >
                                        <View style={styles.priceTagBorder}>
                                            <Text style={styles.priceTag}>${currItem.price}</Text>
                                        </View>
                                        <Callout>
                                            <View style={styles.calloutBox}>
                                                <Image
                                                    source={{ uri: currItem.photos[0].photoURL }}
                                                    style={{ width: "100%", height: 200 }}
                                                    resizeMode="cover"
                                                />
                                                <Text>Brand: {currItem.brand}</Text>
                                                <Text>Model: {currItem.model}</Text>
                                                <Text>Price: ${currItem.price}</Text>
                                                <Text>Press this box to book it!</Text>
                                            </View>
                                        </Callout>
                                    </Marker>
                                )
                            }
                        )
                    }
                </MapView>
            </View>
        );
    } else {
        return (
            <View>
                <Text>LOADING...</Text>
            </View>

        )
    }

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
    },
    priceTag: {
        fontWeight: "bold",
    },
    priceTagBorder: {
        width: 60,
        height: 30,
        borderRadius: 10,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    calloutContainer: {
        width: 200,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    calloutBox: {
        width: 300,
        zIndex: 1,
    }
});

export default ListingScreen;



