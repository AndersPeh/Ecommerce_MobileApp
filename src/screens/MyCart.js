import { StatusBar, Text, View, FlatList, Image, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeProduct } from '../redux/cartSlice';
import Ionicons from "react-native-vector-icons/Ionicons";
import SmallButton from '../components/SmallButton';
import buttonStyle from '../constants/buttonStyle';
import cartStyle from '../constants/cartStyle';
import pageBackground from '../constants/pageBackground';
import { saveCart, fetchCart } from '../redux/cartThunks';
import { useEffect, useRef } from 'react';

export default function MyCart({navigation}) {
// exactly how it was define in store.js and cartSlice. cart is an object with items array
// useSelector subscribes to the store and gets latest data from the store about cart.
  const cartProducts = useSelector((state) => state.cart.products);

  const token = useSelector((state)=>state.auth.token);

// to simplify useDispatch for later use.
  const dispatch = useDispatch();

// keep track of previous token value. useRef ensures token value persists
// across component re-renders.
// intialise previousToken.current to token when the screen first loaded.
// For example, when token changes later, previousToken.current will stay the same
// unless it is updated manually.
  const previousToken = useRef(token);

// when user logs in, retrieve cart products from the server, pass it to setCart
// setCart will then provide cart products of the user
  useEffect(()=>{
// when the user has signed out, dont save
    if(!token){
      console.log("MyCart: Token is required for fetching Cart.");

// set previous token to null because there is no token. as such, the next
// useEffect will not be triggered due to token changes upon signing out.
      previousToken.current = null;
      return;
    }

    dispatch(fetchCart(token))
      .unwrap()
      .catch(e=>{
        console.error("MyCart: Failed to fetch cart:", e);
      });
    
// useEffect is triggered when there is changes in token.
// token and dispatch are included in the dependency to use it inside useEffect.
// When user logs in, the token changes from null to a valid string,
// get latest cartProducts from stores.js, save them to the server.
  }, [token, dispatch]);

  useEffect(()=>{
// token has changed when current token !== previous token
    const tokenChanged = previousToken.current !== token;
// previousToken is assigned to current token. Because this useEffect
// is triggered when token changes.
    previousToken.current=token;

// when the user has signed out or there is no product, dont save
    if(!token || !cartProducts){
      console.log("MyCart: Both Token and cartProducts are required.");
      return;

// dont dispatch saveCart when token changes to prevent potential overwriting issue.
// because when token changes, fetchCart has to run first to fetch data from the server,
// then setCart, for products in store.js to have to latest products from the server,
// then cartProducts will correctly reflect data in the server. 
    } else if(tokenChanged){
      console.log("MyCart: Token changes are ignored.");
      return;
    };

// whenever user modifies cartProducts, dispatch saveCart 
// to save cartProducts to the server.
    dispatch(saveCart({products: cartProducts, token}))
      .unwrap()
      .catch(e=>{
        console.error("MyCart: Failed to save cart:", e);
      });

// useEffect is triggered when there is changes in cartProducts.
// token and dispatch are included in the dependency to use it inside useEffect.
  }, [cartProducts, token, dispatch]);

  // Make Increase icon.
  const increaseIcon = <Ionicons name="add-circle"
    size={25}
    color="#004D66"
  />;

  // Make Decrease icon.
  const decreaseIcon = <Ionicons name="remove-circle"
    size={25}
    color="#004D66"
  />;

  // Make Remove icon.
  const removeIcon = <Ionicons name="trash"
    size={25}
    color="#004D66"
  />;

  // Make Checkout icon.
  const checkoutIcon = <Ionicons name="wallet"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

// total products of that cart.
  const totalProducts = cartProducts.reduce((sum, eachProduct)=>
    sum+eachProduct.quantity
  ,0);
// total price to be paid.
  const totalPrice = cartProducts.reduce((sum, eachProduct)=>
    sum+eachProduct.price*eachProduct.quantity
  ,0);




// render each product in the cart
  const renderCartProduct = ({item}) => (
    <View style={cartStyle.cartProductRow}>
      <Image source={{uri: item.image}} style={cartStyle.productImage} />
      <View style={cartStyle.detailsQuantityColumn}>
        <View style={cartStyle.productDetails}>
          <Text style={cartStyle.productTitle}>{item.title}</Text>
          <Text style={cartStyle.productPrice}>Price: ${item.price.toFixed(2)} per item</Text>
        </View>
        <View style={cartStyle.quantityAdjustRow}>
          
{/* action.payload will contain item.id passed from here to stores.js 
then to cartSlice
Only need item.id for increase quantity, decrease quantity and remove product*/}

          <SmallButton 
            func= {() =>dispatch(increaseQuantity({id:item.id}))}
            icon={increaseIcon}
            style={cartStyle.quantityButton}
          />

          <Text style={cartStyle.productQuantity}>Quantity: {item.quantity}</Text>

          <SmallButton 
            func= {() =>dispatch(decreaseQuantity({id:item.id}))}
            icon={decreaseIcon}
            style={cartStyle.quantityButton}
          />

          <SmallButton 
            func= {() =>dispatch(removeProduct({id:item.id}))}
            icon={removeIcon}
            style={cartStyle.removeButton}
          />
        </View>
      </View>
    </View>
  );

// when user hasn't added any product to the cart.
  if(cartProducts.length===0 || !cartProducts){
    return (
      <View style={pageBackground}>
        <View style={cartStyle.titleContainer}>
          <Text style={cartStyle.titleText}>My Cart</Text>
        </View>        
        <Text style={cartStyle.emptyText}>Your cart is empty.</Text>
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={pageBackground}>
      <View style={cartStyle.titleContainer}>
        <Text style={cartStyle.titleText}>My Cart</Text>
      </View>
      
{/* display cart products */}
      <FlatList 
        data={cartProducts}
        renderItem={renderCartProduct}
        keyExtractor={(item)=>item.id.toString()}
        style={cartStyle.list}
        contentContainerStyle={cartStyle.listContentContainer}
      />
{/* show total number of products and price in the cart before checkout */}
      <View style={cartStyle.totalRow}>
        <Text style={cartStyle.totalText}>Products: {totalProducts}</Text>
        <Text style={cartStyle.totalText}>Total Price: ${totalPrice.toFixed(2)}</Text>
      </View>

{/* checkout button */}
      <SmallButton
        label="Check Out"
        func={()=> Alert.alert("Checkout feature coming soon!")}
        icon={checkoutIcon}
        style={buttonStyle.checkoutButton}
      ></SmallButton>
      
      <StatusBar style="auto" />
    </View>
  );
}
