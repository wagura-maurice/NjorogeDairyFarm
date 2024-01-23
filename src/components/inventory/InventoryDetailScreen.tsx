// src/components/inventory/InventoryDetailScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const InventoryDetailScreen = ({ route }) => {
  const { inventoryData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Details</Text>
      <View style={styles.card}>
        {inventoryData.category.image && (
          <Image
            source={{ uri: inventoryData.category.image }}
            style={styles.productImage}
          />
        )}
        <View style={styles.details}>
          <Text style={styles.detailTitle}>Inventory ID: #{inventoryData._pid}</Text>
          <Text style={styles.detailText}>Product: {inventoryData.name}</Text>
          <Text style={styles.detailText}>Quantity: {inventoryData.quantity}</Text>
          <Text style={styles.detailText}>Price: ${inventoryData.price}</Text>
          <Text style={styles.detailText}>Category: {inventoryData.category.title}</Text>
          <Text style={styles.detailText}>Supplier: {inventoryData.supplier.company_name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ebe6',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  productImage: {
    width: 150,
    height: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009a9a",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default InventoryDetailScreen;
