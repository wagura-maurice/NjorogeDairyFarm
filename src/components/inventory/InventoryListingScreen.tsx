// src/components/inventory/InventoryListingScreen.tsx
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
  TouchableOpacity,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import { getData } from "../../utils/Storage";
import useInventories from "../../hooks/useInventories";

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const InventoryListingScreen = () => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());  

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const navigation = useNavigation();

  const navigateToInventoryDetail = (inventoryId) => {
    navigation.navigate('InventoryDetailScreen', { inventoryId });
  };

  const STATUS_MAP = {
    0: "AVAILABLE",
    1: "OUT_OF_STOCK",
    // Add more status mappings as needed
  };

  const filterOptions = {
    "page[number]": 1,
    include: "category,supplier",
    // Add more filter options as needed
  };

  const { inventories, loading, error, refresh } = useInventories(filterOptions);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);

  const refreshInventories = () => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  };
  
  useEffect(() => {
    refreshInventories();
  }, [selectedStatus, startDate, endDate]);

  const onRefresh = React.useCallback(() => {
    refreshInventories();
  }, [refreshInventories]);
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noInventories}>Failed to load inventory item(s): {error}</Text>
      </View>
    );
  }

  const handleStatusChange = (itemValue, itemIndex) => {
    setSelectedStatus(itemValue);
  };

  const toggleFilterCard = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const filteredInventories = searchQuery
    ? inventories.filter((inventory) => inventory.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : inventories;

  return (
    <View style={styles.container}>
      <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for inventory items..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Icon
        name="arrow-drop-down"
        size={24}
        onPress={toggleFilterCard}
        style={styles.iconStyle}
        />
        {isFilterVisible && (
          <View style={styles.filterCard}>
            {/* Add filter components for inventory status, date range, etc. as needed */}
          </View>
        )}
    </View>
    <FlatList
      data={filteredInventories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigateToInventoryDetail(item.id)}
        >
          <View style={styles.card}>
            {/* Adjust the inventory item properties based on the actual structure */}
            <View style={styles.details}>
              <Text style={styles.cardTitle}>Inventory ID: #{item.id}</Text>
              <Text style={styles.cardText}>
                Product: {toTitleCase(item.category.name)}
              </Text>
              <Text style={styles.cardText}>
                Quantity: {item.quantity}
              </Text>
              {/* Add more inventory item details as needed */}
              <Text style={styles.status}>{STATUS_MAP[item.status]}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.noInventories}>No inventory item(s) found. Please try again later!</Text>}
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
  searchInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009a9a",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    color: "#b37400",
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInventories: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 50,
  },
  iconStyle: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  filterCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 3,
  },
  picker: {
    width: '100%',
  },
});

export default InventoryListingScreen;
