import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';

export default function ManageScreen() {
  const [bookings, setBookings] = useState([]);
  const [reservedDetailsList, setReservedDetailsList] = useState();
  const [currentUserName, setCurrentUserName] = useState('');



  useEffect(() => {
    getUserName();
    fetchCurrentUserRequest();
  }, []);

  const getUserName = async () => {
    try {
      const querySnapshot = await getDoc(doc(db, 'UserProfiles', auth.currentUser.uid));
      if (querySnapshot.exists()) {
        setCurrentUserName(querySnapshot.data().name);
      }
    } catch (error) {
      console.log('Error getting name: ', error);
    }
  };

  const fetchCurrentUserRequest = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'UserProfiles', auth.currentUser.uid, 'Reserved'));
      const currentUserRequest = querySnapshot.docs.map((doc) => doc.data().CarID);
      setBookings(currentUserRequest);
      fetchRequestedCarDetails();
    } catch (error) {
      console.log('Error fetching requests: ', error);
    }
  };

  const fetchRequestedCarDetails = async () => {
    try {
      const docsSnap = await getDocs(collection(db, 'OwnerProfiles'));
      const ownerList = docsSnap.docs.map((doc) => doc.id);
      const reservedDetails = [];

      for (const currentOwner of ownerList) {
        for (const currCar of bookings) {
          const documentRef = doc(db, 'OwnerProfiles', currentOwner, 'Listing', currCar);
          const documentSnapshot = await getDoc(documentRef);
          const documentData = documentSnapshot.data();

          if (documentSnapshot.exists()) {
            reservedDetails.push(documentData);
          }
          console.log(reservedDetailsList)
        }
      }

      setReservedDetailsList(reservedDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const getItemDate = (currItem) => {
    const i = currItem.waitingList.filter((currItem)=>{
      if (currItem.name == currentUserName){
          return currItem
      }
  })
  }

  const renderCarItem = ({ item }) => (
    <View style={styles.carItem}>
      <Text style={styles.carBrand}>{item.brand} {item.model}</Text>
      <Text style={styles.carInfo}>Booking date: {getItemDate(item)}</Text>
      <Text style={styles.carInfo}>License Plate: {item.licensePlate}</Text>
      <Text style={styles.carInfo}>Pickup Location: {item.street}</Text>
      <Text style={styles.carInfo}>Price: ${item.price}</Text>
      <Text style={styles.carInfo}>Owner: {item.ownerName}</Text>
      {/* <Image/> */}
      <Text style={styles.carInfo}>Status: </Text>
      <Text style={styles.carInfo}>Confirmation Code: </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchCurrentUserRequest}>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 10,
  },
  carItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  carBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  carInfo: {
    marginBottom: 4,
  },
});
