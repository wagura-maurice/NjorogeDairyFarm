// src/components/common/CustomerOrdersScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getData } from "../../utils/Storage";
import useOrders from "../../hooks/useOrders";

const CustomerOrdersScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);

  const { orders, loading, error } = useOrders(userData?.customer?.id, {
    "page[number]": 1,
    include: "order_category,produce_category,customer,driver",
  });

  // Status mapping
  const STATUS_MAP = {
    0: "Pending",
    1: "Processing",
    2: "Processed",
    3: "Completed",
    4: "Cancelled",
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  if (!orders || orders.length === 0) {
    return (
      <Text style={styles.noOrdersText}>
        No orders found for this customer.
      </Text>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item._pid}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order ID: # {item._pid}</Text>
          <Text style={styles.cardText}>
            Product: {item.produce_category.name}
          </Text>
          <Text style={styles.cardText}>
            Quantity: {item.quantity.toFixed(2)}
          </Text>
          <Text style={styles.cardText}>
            Total Amount: ${item.total_amount}
          </Text>
          <Text style={styles.status}>Status: {STATUS_MAP[item._status]}</Text>
        </View>
      )}
      refreshing={loading}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007bff",
    marginTop: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noOrdersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CustomerOrdersScreen;
