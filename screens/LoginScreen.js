import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-rn";

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        source={{ uri: "https://tinder.com/static/tinder.png" }}
        resizeMode="cover"
        style={tw("flex-1")}
      >
        <Text
          style={[
            tw(
              "absolute top-40 font-semibold text-3xl text-white w-full"
            ),
            { marginHorizontal: "20%" }
          ]}
        >
          Tinder 4 your pets
        </Text>
        <TouchableOpacity
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" }
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw("text-center font-semibold text-xl")}>Sign in</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
