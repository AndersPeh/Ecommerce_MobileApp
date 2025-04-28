import { StyleSheet, Text, View, StatusBar, ActivityIndicator, Pressable, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import loadingMessage from '../constants/loadingMessage';
import pageBackground from '../constants/pageBackground';
import eachProduct from '../constants/eachProduct';
import SmallButton from '../components/SmallButton';
import Ionicons from "react-native-vector-icons/Ionicons";
import buttonStyle from '../constants/buttonStyle';

export default function ProductList({navigation, route}) {
// default products is an array, when it is updated, array must be used.
  const [products, setProducts] = useState([]);
// true by default, false after finish loading.
  const [loading, setLoading] = useState(true);
  const categorySelected = route.params?.category;

  // Make a back icon.
  const backIcon = <Ionicons name="backspace-outline"
  size={25}
  color="#004D66"
  style={buttonStyle.iconStyle}/>;

  useEffect(()=>{
    async function getProducts() {
      try {
// shows loading when retrieving data.
        setLoading(true);
// Get products from API with category selected.
        const response = await fetch(`https://fakestoreapi.com/products/category/${categorySelected}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
// Retrieve products and convert to object because string objects are received.
        const productsData = await response.json();
// Only need to display image, title and price. Return each product in object.
        const productsContent = productsData.map(product=>({
          id: product.id,
          image: product.image,
          title: product.title,
          price: product.price
        }));
// update Products from empty {} to selected category products.
        setProducts(productsContent);
// display error message including custom error message made.
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
// stops loading after operation (success or fail)
        setLoading(false);
      }
    }
// run the function to get products of selected category and put inside products.
    getProducts();
// trigger useEffect when category selected from Category screen changes.
  }, [categorySelected]);

// when the app is loading, show loading message.
  if (loading){
    return (
      <View style={loadingMessage.body}>
          <ActivityIndicator size="large" color="#F5E8C7" />
          <Text style={loadingMessage.text}>Loading Products...</Text>
      </View>
    );
  }

// render each product to display them properly.
  const renderProduct = ({item}) => (
    <Pressable
      style={eachProduct.product}
      onPress={()=>{
// navigate to ProductDetail of selected Product by passing the Product item.
        navigation.navigate("ProductDetail", {product: item});
      }}
    >
      <Image source={{uri: item.image}} style={eachProduct.image}></Image>
      <View style={eachProduct.productTextContainer}>
        <Text style={eachProduct.productTitle}>{item.title}</Text>
        <Text style={eachProduct.price}>Price: ${item.price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={pageBackground}>
       <View style={eachProduct.titleContainer}>
         <Text style={eachProduct.titleText}>{categorySelected}</Text>
       </View>        
{/* Use FlatList to improve performance because items scroll off screen are recycled. */}
        <FlatList
// data takes products passed from getProducts();.
          data={products}
// renderItem takes renderProduct function to display product one by one using Task style.
          renderItem={renderProduct}
// keyExtractor generates unique keys for each item to update only item that changes.
          keyExtractor={(item) =>item.id.toString()}
          contentContainerStyle={eachProduct.listContentContainer}
          style={eachProduct.listStyle}          
        />
      <SmallButton 
          label="Back" 
// navigate back Categories screen.
          func= {() =>navigation.goBack()}
          icon={backIcon}
          style={buttonStyle.backButton}
      ></SmallButton>
      <StatusBar style="auto" />
    </View>
  );
}