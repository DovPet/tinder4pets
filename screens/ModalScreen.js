import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const ModalScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState();
  const [about, setAbout] = useState();
  const [age, setAge] = useState();
  const [name, setName] = useState();

  const isIncompleteForm = !image || !about || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      about: about,
      age: age,
      name: name,
      timestamp: serverTimestamp()
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={tw("flex-1 items-center pt-10")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="center"
        source={require("../dogo.png")}
      />
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Profile picture URL
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        style={tw("text-xl text-center pb-2")}
        placeholder="Enter picture URL"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Your Name
      </Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        style={tw("text-xl text-center pb-2")}
        placeholder="Enter something about you"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        About you
      </Text>
      <TextInput
        value={about}
        onChangeText={(text) => setAbout(text)}
        style={tw("text-xl text-center pb-2")}
        placeholder="Enter something about you"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>Age</Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw("text-xl text-center pb-2")}
        placeholder="Enter Your age"
      />

      <View style={tw("absolute bottom-10")}>
        <TouchableOpacity
          onPress={updateUserProfile}
          disabled={isIncompleteForm}
          style={[
            tw("w-64 p-3 rounded-xl items-center"),
            isIncompleteForm ? tw("bg-gray-400") : tw("bg-red-400")
          ]}
        >
          <Text>Update profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
          disabled={isIncompleteForm}
          style={tw("w-64 p-3 rounded-xl items-center bg-red-600 mt-2")}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalScreen;
