// src/components/order/OrderListingScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet,
  Image, RefreshControl, TouchableOpacity, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import { getData } from '../../utils/Storage';
import api from '../../utils/API';

const placeholderImage = require('../../assets/img/product_placeholder.png');
const STATUS_MAP = {
  "": "ALL",
  0: "PENDING",
  1: "PROCESSING",
  2: "PROCESSED",
  3: "COMPLETED",
  4: "CANCELLED",
};

const OrderListingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const [isDriver, setIsDriver] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      if (rolesData) {
        const roles = JSON.parse(rolesData);
        setIsDriver(roles.includes('driver'));
        setIsCustomer(roles.includes('customer'));
      }

      const userDataJson = await getData("userData"); // Get user data from storage
      const userData = userDataJson ? JSON.parse(userDataJson) : null; // Parse user data
      setUserData(userData);
    };

    initialize();
  }, []);

  // Function to fetch orders
  const fetchOrders = async (pageNumber = 1, status = selectedStatus, start = startDate, end = endDate, isLoadMore = false) => {
    if (loading && !isLoadMore) return; // Prevent multiple loads
    setLoading(true);
    setIsFetchingMore(isLoadMore);
  
    try {
      // Start constructing the query string
      let queryParams = `page[number]=${encodeURIComponent(pageNumber)}&include=order_category,produce_category,customer,driver`;
  
      if (selectedStatus) {
        queryParams += `&filter[_status]=${encodeURIComponent(selectedStatus)}`;
      }
      queryParams += `&filter[_timestamp][start]=${encodeURIComponent(startDate.toISOString().substring(0, 10))}`;
      queryParams += `&filter[_timestamp][end]=${encodeURIComponent(endDate.toISOString().substring(0, 10))}`;

      if (isCustomer) {
        queryParams += `&filter[customer_id]=${encodeURIComponent(userData?.customer?.id)}`;
      }
      
      if (isDriver) {
        queryParams += `&filter[driver_id]=${encodeURIComponent(userData?.driver?.id)}`;
      }
  
      // Make the API call using the api utility
      const response = await api.get(`/order/catalog?${queryParams}`);
      const jsonResponse = response.data;
      setOrders(isLoadMore ? [...orders, ...jsonResponse.data] : jsonResponse.data);
      setCurrentPage(jsonResponse.meta.current_page);
      setLastPage(jsonResponse.meta.last_page);
  
      // Scroll to the last item of the newly fetched data
      if (isLoadMore) {
        flatListRef.current.scrollToIndex({ index: orders.length - 1 });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: `An error occurred: ${error.message}`,
      });
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };  

  useEffect(() => {
    fetchOrders(); // Initial fetch
  }, []);

  useEffect(() => {
    if (startDate > endDate) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Invalid Date Range',
        text2: 'Start date cannot be later than end date.',
      });
    } else {
      fetchOrders(1); // Fetch with the first page and applied filters
    }
  }, [selectedStatus, startDate, endDate]);
  
  const onRefresh = () => {
    fetchOrders(1); // Always refresh with the first page
  };
  
  const loadMore = () => {
    if (currentPage < lastPage && !isFetchingMore) {
      fetchOrders(currentPage + 1, true);
    }
  };
  
  const toggleFilterCard = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setStartDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    setEndDate(new Date());
    setIsFilterVisible(false);
    setCurrentPage(1);
    setLastPage(null);
  };

  const data = searchQuery
    ? orders.filter((order) =>
      (order.order_category.name && order.order_category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.produce_category && order.produce_category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : orders;
  
  const OrderItem = ({ item }) => (
  <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', { orderId: item.id })}>
    <View style={styles.card}>
      <Image
      source={item?.produce_category?.image ? { uri: item.produce_category.image } : placeholderImage}
      style={styles.productImage}
      />
      <View style={styles.details}>
          <Text style={styles.cardTitle}>{item.produce_category.name} - ({item.id}:{item?.customer?.id}:{item?.driver?.id})</Text>
        <Text style={styles.cardText}>category: {item?.order_category?.name}</Text>
        <Text style={styles.cardText}>quantity: {Number(item.quantity).toFixed(2)}</Text>
        <Text style={styles.cardText}>total amount: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(item.total_amount)}</Text>
        <Text style={styles.status}>{STATUS_MAP[item._status] || 'Unknown'}</Text>
      </View>
      <View style={styles.statusAndPidContainer}>
        <Text style={styles.pid}>#{item._pid}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );
  
  const renderItem = ({ item }) => <OrderItem item={item} />;
  
  const renderFooter = () => {
    if (!isFetchingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text style={styles.loadingFooterText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search order listings..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <TouchableOpacity onPress={toggleFilterCard} style={styles.filterIcon}>
          <Icon name={isFilterVisible ? "close" : "filter-list"} size={24} color="#b37400" />
        </TouchableOpacity>
      </View>
      {isFilterVisible && (
        <View style={styles.filterCard}>
          <Text style={styles.filterTitle}>Filter By:</Text>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
          >
            {Object.entries(STATUS_MAP).map(([value, label]) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>Select Date Range</Text>
          </TouchableOpacity>
          {isDatePickerVisible && (
            <View>
              <DatePicker
                mode="date"
                date={startDate}
                onDateChange={setStartDate}
              />
              <DatePicker
                mode="date"
                date={endDate}
                onDateChange={setEndDate}
              />
            </View>
          )}
          <View style={styles.dateConfirmButtons}>
            <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
      ) : (
        <AnimatedFlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.noOrders}>No order items found.</Text>}
          refreshControl={
            <RefreshControl refreshing={loading && !isFetchingMore} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 5,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    paddingRight: 35,
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    textAlign: 'center',
  },
  filterIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  filterCard: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: "uppercase",
    marginBottom: 5,
    color: "#b37400",
  },
  picker: {
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#dddddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#00b31a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusAndPidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  status: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#00b31a",
  },
  pid: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#b37400",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  cardTitle: {
    textTransform: "capitalize",
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: "#009a9a",
  },
  cardText: {
    textTransform: "capitalize",
    fontSize: 14,
    marginBottom: 2,
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingFooterText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555' // Set the color that suits your app theme
  }
});

export default OrderListingScreen;
