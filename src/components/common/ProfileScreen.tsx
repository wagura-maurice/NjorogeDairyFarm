// src/components/common/ProfileScreen.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../context/AuthContext";
import NotificationModal from "../common/NotificationModal";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../utils/Storage";

const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setModalMessage("You have been successfully logged out.");
      setModalVisible(true);
      setTimeout(() => navigation.replace("SignInScreen"), 1500);
    } catch (error) {
      setModalMessage(error.message || "An error occurred during logout.");
      setModalVisible(true);
    }
  };

  const navigateToCart = () => {
    // Navigate to the shopping cart screen
    // navigation.navigate('CheckOutScreen'); // Replace 'CheckOutScreen' with the actual route name
  };

  // Process roles to a string
  const rolesString =
    userData?.roles?.map((role) => role.name).join(" | ") || "Default Roles";

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable onPress={navigateToCart} style={styles.cartButton}>
        <Icon name="cart-outline" size={30} color="#333" />
      </Pressable>
      <View style={styles.container}>
        <Image
          source={{
            uri: userData?.avatar || "https://via.placeholder.com/120",
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userData?.name}</Text>
        <Text style={styles.userRoles}>{rolesString}</Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Logout</Text>
        </Pressable>
      </View>
      <NotificationModal
        isVisible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        type="info"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0ebe6",
  },
  cartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  userRoles: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "lowercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default ProfileScreen;
