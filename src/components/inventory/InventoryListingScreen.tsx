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
import useInventories from "../../hooks/useInventories";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import { getData } from "../../utils/Storage";

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

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const placeholderImage = require('../../assets/img/product_placeholder.png');

  const STATUS_MAP = {
    0: "PENDING",
    1: "PROCESSING",
    2: "AVAILABLE",
    3: "OUT OF STOCK",
  };

  const filterOptions = {
    "page[number]": 1,
    include: "category,supplier",
    ...(selectedStatus && { "filter[_status]": selectedStatus }),
    ...(startDate && { "filter[_timestamp][start]": startDate.toISOString().substring(0, 10) }),
    ...(endDate && { "filter[_timestamp][end]": addDays(endDate, 1).toISOString().substring(0, 10) }),
    ...(userData?.supplier?.id && { "filter[supplier_id]": userData.supplier.id }),
  };

  const { inventories, loading, error, refresh: refreshInventories } = useInventories(filterOptions);

  useEffect(() => {
    const fetchData = async () => {
      const userDataJson = await getData("userData");
      const userData = userDataJson ? JSON.parse(userDataJson) : null;
      setUserData(userData);
    };
  
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshInventories();
    setRefreshing(false);
  }, [refreshInventories]);

  const handleStatusChange = (itemValue, itemIndex) => {
    setSelectedStatus(itemValue);
  };

  const toggleFilterCard = () => {
    setIsFilterVisible(!isFilterVisible);
  };

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
        data={inventories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToInventoryDetail(item.id)}
          >
            <View style={styles.card}>
              {item.category.image ? (
                <Image
                  source={{ uri: item?.category?.image }}
                  style={styles.productImage}
                />
              ) : (
                <Image
                  source={placeholderImage}
                  style={styles.productImage}
                />
              )}
              <View style={styles.details}>
                <Text style={styles.cardTitle}>Inventory ID: #{item._pid}</Text>
                <Text style={styles.cardText}>
                  Product: {toTitleCase(item.category.name)}
                </Text>
                <Text style={styles.cardText}>
                  Quantity: {Number(item.quantity).toFixed(2)}
                </Text>
                <Text style={styles.status}>{STATUS_MAP[item._status]}</Text>
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
  productImage: {
    width: 100,
    height: '100%',
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
