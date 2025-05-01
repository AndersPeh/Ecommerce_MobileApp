import { Text, View, StatusBar, ActivityIndicator, Pressable, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import loadingMessage from '../constants/loadingMessage';
import pageBackground from '../constants/pageBackground';
import SmallButton from '../components/SmallButton';
import Ionicons from "react-native-vector-icons/Ionicons";
import buttonStyle from '../constants/buttonStyle';
import detailsStyle from '../constants/detailsStyle';
import { useDispatch } from 'react-redux';
import {addProduct} from '../redux/cartSlice';

export default function ProductDetail({navigation, route}) {
// default details is null.
  const [details, setDetails] = useState(null);
// true by default, false after finish loading.
  const [loading, setLoading] = useState(true);
// for getting product selected information passed from ProductList screen.
  const productSelected = route.params?.product;
// simplify useDispatch for later use.
  const dispatch = useDispatch();


  // Make a back icon.
  const backIcon = <Ionicons name="backspace"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

  // Make a cart icon.
  const cartIcon = <Ionicons name="cart"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

  useEffect(()=>{
    async function getDetails() {
      try {
// shows loading when retrieving data.
        setLoading(true);
// Get details from API with product selected.
        const response = await fetch(`https://fakestoreapi.com/products/${productSelected.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
// Retrieve details and convert to object because string objects are received.
        const detailsData = await response.json();
// update details from null to selected product details.
        setDetails(detailsData);
// display error message including custom error message made.
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
// stops loading after operation (success or fail)
        setLoading(false);
      }
    }
// run the function to get details of selected product.
    getDetails();
// trigger useEffect when id of product selected from ProductList screen changes.
  }, [productSelected?.id]);

// when the app is loading, show loading message.
  if (loading){
    return (
      <View style={loadingMessage.body}>
          <ActivityIndicator size="large" color="#F5E8C7" />
          <Text style={loadingMessage.text}>Loading Details...</Text>
      </View>
    );
  }

  const addProductToCart = () => {
    if(details){
// dispatch the addItem action with product details which will be inside action.payload.
      dispatch(addProduct({
        id: details.id,
        title: details.title,
        price: details.price,
        image: details.image,
        })
      );
// show success message after adding to cart.
      Alert.alert(`Great choice!`, `You have added ${details.title} to your shopping cart!`);
    }
  };

  return (
    <View style={pageBackground}>

       <View style={detailsStyle.titleContainer}>
         <Text style={detailsStyle.titleText}>Product Details</Text>
       </View>

       <View style={detailsStyle.body}>
          <Image source={{uri: details.image}} style={detailsStyle.image}></Image>
          <Text style={detailsStyle.productTitle}>{details.title}</Text>
          <View style={detailsStyle.threeItems_sameRow}>
            <Text style={detailsStyle.threeItems_Text}>Rate: {details.rating?.rate}</Text>
            <Text style={detailsStyle.threeItems_Text}>Count: {details.rating?.count}</Text>
            <Text style={detailsStyle.threeItems_Text}>Price: ${details.price?.toFixed(2)}</Text>
          </View>
        </View> 

        <View style={detailsStyle.descriptionBox}>
          <Text style={detailsStyle.descriptionLabel}>Description: </Text>
{/* Use ScrollView in case Description is very long */}
          <ScrollView style={detailsStyle.descriptionScrollView} nestedScrollEnabled={true}>
            <Text style={detailsStyle.descriptionText}>{details.description}</Text>
          </ScrollView>
        </View>

      <View style={buttonStyle.twoButtons_sameRow}>
{/* Go Back */}
        <SmallButton 
            label="Back" 
            func= {() =>navigation.goBack()}
            icon={backIcon}
            style={buttonStyle.detailButtons}
        ></SmallButton>
{/* Add to Cart*/}
        <SmallButton 
            label="Add to Cart" 
            func= {addProductToCart}
            icon={cartIcon}
            style={buttonStyle.detailButtons}
        ></SmallButton>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}