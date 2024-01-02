// src/components/customer/OrderListingScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { getData } from "../../utils/Storage";
import useOrders from "../../hooks/useOrders";

// Function to convert strings to title case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const OrderListingScreen = () => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { orders, loading, error, refresh } = useOrders(userData?.customer?.id, {
    "page[number]": 1,
    include: "order_category,produce_category,customer,driver",
  });

  // Status mapping
  const STATUS_MAP = {
    0: "PENDING",
    1: "PROCESSING",
    2: "PROCESSED",
    3: "COMPLETED",
    4: "CANCELLED",
  };

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh(); // Use the refreshOrders method from the hook
    } catch (error) {
      Alert.alert("Error refreshing orders:", error);
    }
    setRefreshing(false);
  }, [refresh]);
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noOrders}>Failed to load order(s): {error}</Text>
      </View>
    );
  }

  const filteredOrders = searchQuery
    ? orders.filter((order) => order.produce_category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : orders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for orders..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
    <FlatList
      data={filteredOrders}
      keyExtractor={(item) => item._pid}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.produce_category.image && (
            <Image
              source={{ uri: item.produce_category.image }}
              style={styles.productImage}
            />
          )}
          <View style={styles.details}>
            <Text style={styles.cardTitle}>ORDER ID: # {item._pid}</Text>
            <Text style={styles.cardText}>
              Product: {toTitleCase(item.produce_category.name)}
            </Text>
            <Text style={styles.cardText}>
              Quantity: {item.quantity.toFixed(2)}
            </Text>
            <Text style={styles.cardText}>
              Total Amount: KES {item.total_amount}
            </Text>
            <Text style={styles.status}>STATUS: {STATUS_MAP[item._status]}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noOrders}>No order(s) found. Please try again later!</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ebe6',
    paddingHorizontal: 8,
  },
  header: {
    // Style for the header if needed
  },
  searchInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  productImage: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3,
  },
  status: {
    fontSize: 16,
    fontWeight: "500",
    color: "green",
    marginTop: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrders: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 50,
  }
});

export default OrderListingScreen;
