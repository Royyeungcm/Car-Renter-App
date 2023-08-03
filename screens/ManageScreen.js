import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import {
    getDocs,
    collection,
    getDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";

let unsub;

export default function ManageScreen() {
    const [bookings, setBookings] = useState([]);
    const [reservedDetailsList, setReservedDetailsList] = useState();
    const [currentUserName, setCurrentUserName] = useState("");

    let reservedDetails = [];


    const fetchCurrentUserRequest = async () => {
        setReservedDetailsList((a) => []);
        setBookings((b) => []);
        reservedDetails = [];
        try {
            const querySnapshot = await getDocs(
                collection(db, "UserProfiles", auth.currentUser.uid, "Reserved")
            );


            querySnapshot.forEach((doc) => {
                bookings.push(doc.data());

            });


            for (const item of bookings) {
                const documentRef = doc(
                    db,
                    "OwnerProfiles",
                    item.OwnerID,
                    "Listing",
                    item.CarID
                );
                const snapShot = await getDoc(documentRef);
                if (snapShot.exists) {
                    const addDate = snapShot.data();
                    addDate.date = item.date;
                    addDate.carID = item.CarID;
                    addDate.userStatus = item.status;
                    addDate.confirmationCode = item.confirmationCode;
                    reservedDetails.push(addDate);
                }
            }
            setReservedDetailsList(reservedDetails);
            console.log("reservedDetails: ", reservedDetails);

        } catch (error) {
            console.log("Error fetching requests: ", error);
        }
    };

    useEffect(() => {
        getUserName();
        fetchCurrentUserRequest();
    }, []);

    useEffect(() => {
        unsub = onSnapshot(
            collection(db, `UserProfiles/${auth.currentUser.uid}/Reserved`),
            (snapshot) => {
                console.log("active");

                snapshot.docChanges().forEach((change) => {
                    const statusChanged = change.doc.data();
                    statusChanged.id = change.doc.id;
                    if (change.type === "added") {
                        console.log("New ", change.doc.id);

                    }
                    if (change.type === "modified") {
                        console.log("Modified ", change.doc.id);

                        let target = reservedDetails.filter((a)=>{
                            if(a.carID == change.doc.data().CarID && a.date == change.doc.data().date){
                                return a;
                            }
                        }) 

                        const m = reservedDetails.filter((a)=>{
                            if(!(a.carID == change.doc.data().CarID && a.date == change.doc.data().date)){
                                return a;
                            }
                        })
                        target[0].userStatus = change.doc.data().status
                        target[0].confirmationCode = change.doc.data().confirmationCode
                        m.push(target[0])
                        setReservedDetailsList(m)

                    }
                    if (change.type === "removed") {
                        console.log("Removed ", change.doc.id);

                    }

                });
            }
        );
        return () => {
            console.log("unmounted");
            unsub();
        };
    }, []);

    const getUserName = async () => {
        try {
            const querySnapshot = await getDoc(
                doc(db, "UserProfiles", auth.currentUser.uid)
            );
            if (querySnapshot.exists()) {
                setCurrentUserName(querySnapshot.data().name);
            }
        } catch (error) {
            console.log("Error getting name: ", error);
        }
    };

    const getItemDate = (currItem) => {
        const i = currItem.waitingList.filter((currItem) => {
            if (currItem.name == currentUserName) {
                return currItem;
            }
        });
    };

    const renderCarItem = ({ item }) => {
        console.log(item.waitingList);
        return (
            <View style={styles.carItem}>
                <Text style={styles.carBrand}>
                    {item.brand} {item.model}
                </Text>
                <Text style={styles.carInfo}>Booking date: {item.date}</Text>
                <Text style={styles.carInfo}>
                    License Plate: {item.licensePlate}
                </Text>
                <Text style={styles.carInfo}>
                    Pickup Location: {item.street}
                </Text>
                <Text style={styles.carInfo}>Price: ${item.price}</Text>
                <Text style={styles.carInfo}>Owner: {item.ownerName}</Text>
                {/* <Image/> */}
                <Text style={styles.carInfo}>Status: {item.userStatus}</Text>
                <Text style={styles.carInfo}>Confirmation Code: {item.confirmationCode}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchCurrentUserRequest}
            >
                <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
            <FlatList
                data={reservedDetailsList}
                renderItem={renderCarItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    refreshButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    flatListContent: {
        paddingBottom: 10,
    },
    carItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    carBrand: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    carInfo: {
        marginBottom: 4,
    },
});
