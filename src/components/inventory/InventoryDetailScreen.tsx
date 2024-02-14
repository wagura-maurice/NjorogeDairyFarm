// src/components/inventory/InventoryDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { getData } from '../../utils/Storage';
import api from '../../utils/API';

const INVENTORY_STATUS_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "PROCESSED",
  3: "COMPLETED",
  4: "CANCELLED",
};

const INVOICE_STATUS_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "PROCESSED",
  3: "REJECTED",
  4: "ACCEPTED",
};

const InventoryDetailScreen = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isSupplier, setIsSupplier] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [inventoryDetails, setInventoryDetails] = useState(null);
  const [inventoryId, setInventoryId] = useState(route.params?.inventoryId);
  const [supplierId, setSupplierId] = useState(null);
  const [userIsSupplierOfItem, setUserIsSupplierOfItem] = useState(false);

  const scrollViewRef = useRef(null);
  const placeholderImage = require('../../assets/img/product_placeholder.png');

  useEffect(() => {
    const initialize = async () => {
      const rolesData = await getData("userRoles");
      if (rolesData) {
        const roles = JSON.parse(rolesData);
        setIsSupplier(roles.includes('supplier'));
      }

      const userDataJson = await getData("userData");
      if (userDataJson) {
        const parsedData = JSON.parse(userDataJson);
        setUserData(parsedData);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    setSupplierId(userData?.supplier?.id);
  }, [userData]);

  useEffect(() => {
    fetchInventoryDetails(inventoryId, supplierId);
  }, [supplierId]);

  useEffect(() => {
    const initialize = async () => {
      setUserIsSupplierOfItem(inventoryDetails?.supplier?.id === supplierId);
    };

    initialize();
  }, [inventoryDetails, supplierId]);

  const fetchInventoryDetails = async (inventory_id, supplier_id = null) => {
    try {
      const response = await api.get(`/inventory/catalog/${inventory_id}?include=category,supplier,invoices`);
      let inventoryData = response.data.data;
  
      let filteredInvoices;
      // Check if supplier_id is provided and not null or empty
      if (supplier_id) {
        // Filter invoices by supplier ID of the logged-in user
        filteredInvoices = inventoryData.invoices.filter(invoice => invoice.supplier_id === supplier_id);
      } else {
        // If no supplier_id is provided, use all invoices
        // filteredInvoices = inventoryData.invoices;
      }

      if (filteredInvoices) {
        // Sort by 'created_at' to get the latest invoice
        filteredInvoices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const currentInvoice = filteredInvoices[0]; // The latest invoice is now the first item
    
        // Set the current invoice and other inventory details
        setInventoryDetails({
          ...inventoryData,
          currentInvoice,
        });
    
        // Set the initial quote price to the latest invoice's payable amount
        if (currentInvoice) {
          setQuotePrice(currentInvoice.payable);
          setCurrentInvoice(currentInvoice);
        }
      } else {
        setInventoryDetails(inventoryData);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to fetch inventory details:',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const submitQuote = async () => {
    if (!quotePrice) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Quote Price is required.',
      });
      return;
    }
  
    try {
      await api.post('invoice/catalog', {
        category_id: 1, // Replace with actual category ID if necessary
        payable: quotePrice,
        _inventories: [inventoryDetails?._pid],
        supplier_id: supplierId, // Use the supplier ID of the logged-in user
      });
  
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Quote submitted successfully!',
      });
  
      fetchInventoryDetails(inventoryId, supplierId);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to submit quote:',
        text2: error.message,
      });
    }
  };
  

  const markAsCompleted = async () => {
    if (!inventoryId || !supplierId) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Missing inventory or supplier information.',
      });
      return;
    }

    if (!userIsSupplierOfItem) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'You do not have permission to complete this action.',
      });
      return;
    }

    try {
      // Assuming the API endpoint to mark inventory as completed is `/inventory/mark-completed`
      await api.put(`/inventory/catalog/${inventoryId}`, {
        _status: 4,
      });

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Inventory marked as completed successfully!',
      });

      // Optionally, refresh the inventory details to reflect the new status
      fetchInventoryDetails(inventoryId, supplierId);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to mark inventory as completed:',
        text2: error.message,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!inventoryDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>No inventory details available.</Text>
      </View>
    );
  }

  return (
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.imageContainer}>
        <Image
          source={inventoryDetails?.category?.image ? { uri: inventoryDetails?.category?.image } : placeholderImage}
          style={styles.productImage}
        />
        <Text style={styles.watermark}>
          #{inventoryDetails?._pid}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        {/* <Text style={styles.detailTitle}>inventory item: #{inventoryDetails?._pid}</Text> */}
        <Text style={styles.detailTitle}>{inventoryDetails?.name}</Text>
        <Text style={styles.detailText}>inventory category: {inventoryDetails?.category?.name}</Text>
        <Text style={styles.detailText}>unit quantity: {Number(inventoryDetails?.quantity).toFixed(2)}</Text>
        <Text style={styles.detailText}>unit price: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(inventoryDetails?.price)}</Text>
        {userIsSupplierOfItem && (<Text style={styles.detailText}>active supplier: {inventoryDetails?.supplier?.company_name}</Text>)}
        <Text style={styles.pid}>{INVENTORY_STATUS_MAP[inventoryDetails?._status] || 'Unknown'}</Text>
        {userIsSupplierOfItem && inventoryDetails?.currentInvoice?._status === 4 && (
          <TouchableOpacity
            style={styles.button}
            onPress={markAsCompleted}
            disabled={!inventoryId || !supplierId} // Button is disabled if either ID is not available
          >
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </TouchableOpacity>        
        )}
        {isSupplier && supplierId && inventoryDetails?._status !== 3 && (
          <View>
            <TextInput
              style={styles.quoteInput}
              placeholder="Enter quote price"
              keyboardType="numeric"
              value={null}
              onChangeText={(text) => {
                const numericValue = parseFloat(text);
                if (!isNaN(numericValue) || text === '') {
                  setQuotePrice(text); // Set to text, allowing any numeric value
                } else {
                  Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Please enter a valid numeric value.',
                  });
                }
              }}
            />            
            <TouchableOpacity
              style={styles.button}
              onPress={submitQuote}
            >
              <Text style={styles.buttonText}>Quote</Text>
            </TouchableOpacity>
          </View>
        )}
        {currentInvoice && (
          <View style={styles.quotedPriceContainer}>
            <Text style={styles.detailSubTitle}>current quote:</Text>
            <Text style={styles.detailText}>
              {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(quotePrice ?? currentInvoice?.payable)}
            </Text>
            <Text style={styles.detailText}>
              {new Intl.DateTimeFormat('en-KE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              }).format(new Date(currentInvoice?._timestamp ?? null))}
            </Text>
            {currentInvoice?.supplier?.company_name && (<Text style={styles.detailText}>{currentInvoice?.supplier?.company_name}</Text>)}
            <Text style={styles.status}>{INVOICE_STATUS_MAP[currentInvoice?._status] || 'Unknown'}</Text>
            <View style={styles.statusAndPidContainer}>
              <Text style={styles.pid}>#{currentInvoice?._pid}</Text>
            </View>
          </View>
        )}
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ebe6',
    paddingHorizontal: 10,
  },
  imageContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 5,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    position: 'relative', // Ensure the container is relative for absolute positioning of children
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  detailTitle: {
    textTransform: "capitalize",
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: "#009a9a",
  },
  detailSubTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#009a9a",
    marginBottom: 8,
  },
  detailText: {
    textTransform: "capitalize",
    fontSize: 14,
    marginBottom: 2,
  },
  statusAndPidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10, // You can adjust this value to increase the space from the bottom
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
  quotedPriceContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    shadowColor: "#00b31a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#00b31a",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  quoteInput: {
    borderColor: '#ccc',
    borderWidth: 2.5,
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default InventoryDetailScreen;
