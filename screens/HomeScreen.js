import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../helpers/generateId";

const HomeScreen = () => {
  const navigation = useNavigation();
  const swiperRef = useRef(null);
  const [profiles, setProfiles] = useState([]);
  const { user } = useAuth();

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log("You swiped PASS on", userSwiped);
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
ß
    const loggedInUserProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();
    const userSwiped = profiles[cardIndex];

    getDoc(doc(db, "users", userSwiped.id, "yeses", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log("you matched each other");
          setDoc(
            doc(db, "users", user.uid, "yeses", userSwiped.id),
            userSwiped
          );

          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInUserProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp()
          });

          navigation.navigate("Match", {
            loggedInUserProfile,
            userSwiped
          });
        } else {
          console.log("You swiped YEEEP on", userSwiped);
          setDoc(
            doc(db, "users", user.uid, "yeses", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) navigation.navigate("Modal");
      }),
    []
  );

  useEffect(() => {
    const DUMMY_DATA = [
      {
        name: "Dogs Name",
        about: "Adorable dog",
        age: "2 years",
        photoURL:
          "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
        id: 123
      },
      {
        name: "Rex",
        about: "Police dog",
        age: "4 years",
        photoURL:
          "https://www.akc.org/wp-content/uploads/2017/06/gsd_police_dog_hero.jpg",
        id: 456
      },
      {
        name: "Spot",
        about: "Awesome",
        age: "10 months",
        photoURL:
          "https://ichef.bbci.co.uk/news/976/cpsprodpb/17638/production/_124800859_gettyimages-817514614.jpg",
        id: 789
      }
    ];

    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const yeses = await getDocs(
        collection(db, "users", user.uid, "yeses")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const yesedUserIds = yeses.length > 0 ? yeses : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...yesedUserIds])
        ),
        (snapshot) => {
          setProfiles([
            ...snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data()
              })),
            ...DUMMY_DATA
          ]);
        }
      );
    };
    fetchCards();
    return unsub;
  }, [db]);

  return (
    <SafeAreaView style={tw("flex-1")}>
      <View style={tw("items-center relative")}>
        <TouchableOpacity
          style={tw("absolute left-5 top-3")}
          onPress={() => navigation.navigate("Modal")}
        >
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image style={tw("h-14 w-14")} source={require("../dogo.png")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw("absolute right-5 top-5")}
          onPress={() => navigation.navigate("Chat")}
        >
          <Ionicons name="chatbubbles-sharp" size={30} color="#FFD580" />
        </TouchableOpacity>
      </View>

      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swiperRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red"
                }
              }
            },
            right: {
              title: "YEEEP",
              style: {
                label: {
                  color: "green"
                }
              }
            }
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative h-3/4 bg-white rounded-xl")}
              >
                <Image
                  style={tw("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-white w-full h-20 justify-between flex-row px-5 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>{card.name}</Text>
                    <Text>{card.about}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white w-full h-3/4 justify-center items-center"
                  ),
                  styles.cardShadow
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <Entypo name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  }
});
