import { StatusBar, Text, View, FlatList, Image, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeProduct } from '../redux/cartSlice';
import Ionicons from "react-native-vector-icons/Ionicons";
import SmallButton from '../components/SmallButton';
import buttonStyle from '../constants/buttonStyle';
import cartStyle from '../constants/cartStyle';
import pageBackground from '../constants/pageBackground';

export default function MyCart({navigation}) {
// exactly how it was define in store.js and cartSlice, cart, an object with items array
// useSelector subscribes to the store and gets latest data from the store about cart.
  const cartProducts = useSelector((state) => state.cart.products);

// to simplify useDispatch for later use.
  const dispatch = useDispatch();

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
  {/* action.payload will contain item.id passed from here to cartSlice and run on store.js */}
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
  if(cartProducts.length===0){
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
