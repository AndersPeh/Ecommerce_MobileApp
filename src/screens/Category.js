import { StyleSheet, Text, View, StatusBar, ActivityIndicator, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import loadingMessage from '../constants/loadingMessage';
import pageBackground from '../constants/pageBackground';
import eachCategory from '../constants/eachCategory';

export default function Category({navigation}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function getCategories() {
      try {
// shows loading when retrieving data.
        setLoading(true);
// Get products from API
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
// Retrieve products and convert to object because stringified objects are received.
        const products = await response.json();
// Only keep categories from each product
        const products_categories = products.map(product=>product.category);
// Only keep unique categories
        const uniqueCategories = new Set(products_categories);
// convert from Set to Array because categories in useState is [] by default. 
        const uniqueCategories_array = [...uniqueCategories];
        setCategories(uniqueCategories_array);

      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
// stops loading after operation (success or fail)
        setLoading(false);
      }
    }
// run the function when the app is first loaded for one time only.
    getCategories();
// trigger useEffect when user first loads the app for one time only.
  }, []);

// when the app is loading, show loading message.
  if (loading){
    return (
      <View style={loadingMessage.body}>
          <ActivityIndicator size="large" color="#F5E8C7" />
          <Text style={loadingMessage.text}>Loading Categories...</Text>
      </View>
    );
  }

  return (
    <View style={pageBackground}>
      {
        categories.map((category)=>(
          <Pressable
            key={category}
            style={eachCategory.categoryItem}
            onPress={()=>{
// navigate to ProductList of selected category by passing the category name
              navigation.navigate("ProductList", {category: category});
            }}
          >
{/* Display each category */}
            <Text style={eachCategory.text}>{category}</Text>
          </Pressable>
        ))
      }
      <StatusBar style="auto" />
    </View>
  );
}
