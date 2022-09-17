import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import React from "react";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <View style={tw("p-2 flex-row items-center justify-between")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw("p-2")}>
          <Ionicons name="chevron-back-outline" size={34} color="#FFD580" />
        </TouchableOpacity>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={tw("rounded-full mr-4 p-2 bg-red-500")}>
          <Foundation name="telephone" size={20} color="#FFD580" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
