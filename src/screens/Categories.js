import { StyleSheet, Text, View, StatusBar, ActivityIndicator, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import loadingMessage from '../constants/loadingMessage';
import pageBackground from '../constants/pageBackground';
import eachCategory from '../constants/eachCategory';

export default function Categories({navigation}) {
// default categories is an array, when it is updated, array must be used.
  const [categories, setCategories] = useState([]);
// true by default, false after finish loading.
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function getCategories() {
      try {
// shows loading when retrieving data.
        setLoading(true);
// Get products from API
        const response = await fetch("https://fakestoreapi.com/products/categories");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
// Retrieve categories and convert to object because string objects are received.
        const products_categories = await response.json();
// update categories from empty [] to API categories.
        setCategories(products_categories);
// display error message including custom error message made.
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
// stops loading after operation (whether success or fail).
        setLoading(false);
      }
    }
// run the function to get unique categories.
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
       <View style={eachCategory.titleContainer}>
         <Text style={eachCategory.titleText}>Categories</Text>
       </View>
      {
// map each category out as Pressable buttons that will route user to ProductList page of selected category.
        categories.map((category)=>(
          <Pressable
// unique key for React to run
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
