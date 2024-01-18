// src/components/order/OrderListingScreen.tsx
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

  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());  

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const navigation = useNavigation();

  const navigateToOrderDetail = (orderId) => {
    navigation.navigate('OrderDetailScreen', { orderId });
  };

  // Status mapping
  const STATUS_MAP = {
    0: "PENDING",
    1: "PROCESSING",
    2: "PROCESSED",
    3: "COMPLETED",
    4: "CANCELLED",
  };

  // Prepare filter options for useOrders hook
  const filterOptions = {
    "page[number]": 1,
    include: "order_category,produce_category,customer,driver",
    ...(selectedStatus && { "filter[_status]": selectedStatus }),
    ...(startDate && { "filter[date_range][start]": startDate.toISOString().substring(0, 10) }),
    ...(endDate && { "filter[date_range][end]": endDate.toISOString().substring(0, 10) }),
    ...(userData?.customer?.id && { "filter[customer_id]": userData.customer.id }),
    ...(userData?.driver?.id && { "filter[driver_id]": userData.driver.id }),
  };

  // Call useOrders with the updated filter options
  const { orders, loading, error, refresh } = useOrders(filterOptions);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };

    fetchData();
  }, []);

  const refreshOrders = () => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  };
  
  // Use useEffect to call refreshOrders when filters change
  useEffect(() => {
    refreshOrders();
  }, [selectedStatus, startDate, endDate]);

  const onRefresh = React.useCallback(() => {
    refreshOrders();
  }, [refreshOrders]);
  
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

  const handleStatusChange = (itemValue, itemIndex) => {
    setSelectedStatus(itemValue);
  };

  const toggleFilterCard = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const filteredOrders = searchQuery
    ? orders.filter((order) => order.produce_category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : orders;

  return (
    <View style={styles.container}>
      <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products ordered..."
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
            <Picker
              selectedValue={selectedStatus}
              onValueChange={handleStatusChange}
              style={styles.picker}
            >
              {Object.entries(STATUS_MAP).map(([status, description]) => (
                <Picker.Item key={status} label={description} value={status} />
              ))}
            </Picker>
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
            />
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
            />
          </View>
        )}
    </View>
    <FlatList
      data={filteredOrders}
      keyExtractor={(item) => item._pid}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToOrderDetail(item.id)}
          >
        <View style={styles.card}>
          {item.produce_category.image && (
            <Image
              source={{ uri: item.produce_category.image }}
              style={styles.productImage}
            />
          )}
          <View style={styles.details}>
            <Text style={styles.cardTitle}>0rder ID: #{item._pid}</Text>
            <Text style={styles.cardText}>
              Product: {toTitleCase(item.produce_category.name)}
            </Text>
            <Text style={styles.cardText}>
              Quantity: {Number(item.quantity).toFixed(2)}
            </Text>
            <Text style={styles.cardText}>
              Total Amount: KES {item.total_amount}
            </Text>
            <Text style={styles.status}>{STATUS_MAP[item._status]}</Text>
          </View>
            </View>
            </TouchableOpacity>
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
    color: "#009a9a", // "b37400",
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

export default OrderListingScreen;
