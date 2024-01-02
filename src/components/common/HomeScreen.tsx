// src/components/common/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Welcome to NJOROGE DAIRY FARM</Text>
        
        {/* Add your content here */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            Discover our range of fresh dairy products!
          </Text>
          <Button
            title="View Products"
            onPress={() => navigation.navigate('MarketplaceScreen')}
          />
          {/* Add more buttons or content as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
