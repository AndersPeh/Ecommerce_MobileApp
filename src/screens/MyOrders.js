import { StatusBar, Text, View, FlatList, Image, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import SmallButton from '../components/SmallButton';
import buttonStyle from '../constants/buttonStyle';
import pageBackground from '../constants/pageBackground';
import { useEffect } from 'react';
import { updateDelivered, updatePaid } from '../redux/orderSlice';
import { fetchOrders, updateOrder} from '../redux/orderThunks';
import ordersStyle from '../constants/ordersStyle';
import { clearCart } from '../redux/cartSlice';

export default function MyOrders({navigation}) {

// exactly how it was define in store.js and orderSlice. orders is an object with items array
// useSelector subscribes to the store and gets latest data from the store about order.
  const ordersInfo = useSelector((state) => state.order.orders);

  const token = useSelector((state)=>state.auth.token);

// to simplify useDispatch for later use.
  const dispatch = useDispatch();

// when user logs in, retrieve orders from the server, pass it to setOrders
// setOrders will then provide cart products of the user
  useEffect(()=>{

// when the user has signed out, dont save
    if(!token){
      console.log("MyOrders: Token is required for fetching Orders.");

      return;
    }

    dispatch(fetchOrders(token))
      .unwrap()
      .catch(e=>{
        console.error("MyOrders: Failed to fetch orders:", e);
      });
    
// useEffect is triggered when there is changes in token.
// token and dispatch are included in the dependency to use it inside useEffect.
// When user logs in, the token changes from null to a valid string,
// get latest orders from the server, save them to the store.js.
  }, [token, dispatch]);

  // Make Receive icon.
  const receiveIcon = <Ionicons name="car"
    size={25}
    color="#004D66"
  />;

  // Make Pay icon.
  const payIcon = <Ionicons name="card"
    size={25}
    color="#004D66"
  />;


// total new orders.
  const totalNewOrders = ordersInfo.reduce((sum, eachOrder)=>
    {
      if(eachOrder.isPaid==0 &&eachOrder.isDelivered==0){
      sum+=1
      }
    }
  ,0);

// total price of new orders.
  const totalPriceNewOrders = ordersInfo.reduce((sum, eachOrder)=>
    {
      if(eachOrder.isPaid==0 &&eachOrder.isDelivered==0){
      sum+=eachOrder.total_price
      }
    }
  ,0);

// total paid orders.
  const totalPaidOrders = ordersInfo.reduce((sum, eachOrder)=>
  {
    if(eachOrder.isPaid==1 &&eachOrder.isDelivered==0){
      sum+=1
    }
  }
  ,0);

// total price of paid orders.
  const totalPricePaidOrders = ordersInfo.reduce((sum, eachOrder)=>
    {
      if(eachOrder.isPaid==1 &&eachOrder.isDelivered==0){
      sum+=eachOrder.total_price
      }
    }
  ,0);

// total delivered orders.
  const totalDeliveredOrders = ordersInfo.reduce((sum, eachOrder)=>
    {
      if(eachOrder.isDelivered==1){
        sum+=1
      }
    }
  ,0);

// total price of delivered orders.
  const totalPriceDeliveredOrders = ordersInfo.reduce((sum, eachOrder)=>
    {
      if(eachOrder.isDelivered==1){
      sum+=eachOrder.total_price
      }
    }
  ,0);

  const paymentConfirmed = (orderID) => {

    if(!token){
      Alert.alert('Error', 'You must sign in first.');
      return;
    }

// dispatch updatePaid to change the status to paid in front end.
    dispatch(updatePaid({orderID:orderID}))

// dispatch updateOrder to save the paid order to the server.
    dispatch(updateOrder({orderID: orderID, isPaid:1, token:token}))

      .unwrap()

      .then(()=>{
        Alert.alert("Paid Successfully!")
      })

      .catch(e=>{
        console.error("Payment Failed", e);
      });
  };
  
  const deliveryConfirmed = (orderID) => {

    if(!token){
      Alert.alert('Error', 'You must sign in first.');
      return;
    }

// dispatch updateDelivered to change the status to delivered in front end.
    dispatch(updateDelivered({orderID:orderID}))

// dispatch updateOrder to save the delivered order to the server.
    dispatch(updateOrder({orderID: orderID, isDelivered:1, token:token}))

      .unwrap()

      .then(()=>{
        Alert.alert("Enjoy your purchase!")
      })

      .catch(e=>{
        console.error("Payment Failed", e);
      });
  };

// render each item in every order.
  const renderEachOrderEachItem = ({item}) => {

    return (
      <>
        <View style={ordersStyle.eachProductRow}>
          <Image source={{uri: item.image}} style={ordersStyle.productImage} />
          <View style={ordersStyle.eachProductDetailsColumn}>
              <Text style={ordersStyle.eachProductTitle}>{item.title}</Text>
              <View style={ordersStyle.eachProductPriceQuantityRow}>
                <Text style={ordersStyle.eachProductPrice}>Price: ${item.price.toFixed(2)} per item</Text>
                <Text style={ordersStyle.eachProductQuantity}>Quantity: {item.quantity}</Text>
              </View>
          </View>
        </View>
      </>
    );
  }

// render each order.
  const renderEachOrder = ({item}) => {

    return (
      <>
{/* display products of the order*/}
        <FlatList 
          data={item.products}
          renderItem={renderEachOrderEachItem}
          keyExtractor={(item)=>item.orderID.toString()}
          style={ordersStyle.eachProductlist}
          contentContainerStyle={ordersStyle.eachProductlistContentContainer}
        />
        
{/* button for paying the order */}
        {item.isPaid==0 &&(
          <SmallButton 
            func= {() =>paymentConfirmed}
            label="Pay"
            icon={payIcon}
            style={ordersStyle.button}
          />

        )}

{/* button for confirming delivery of the order */}
        {item.isPaid==1&&item.isDelivered==0&&(
            <SmallButton 
              func= {() =>deliveryConfirmed}
              label="Received"
              icon={receiveIcon}
              style={ordersStyle.button}
            />
        )}
      </>
    );
  }

// when user does not have any order.
  if(ordersInfo.length===0 || !ordersInfo){
    return (
      <View style={pageBackground}>
        <View style={ordersStyle.titleContainer}>
          <Text style={ordersStyle.titleText}>My Orders</Text>
        </View>        
        <Text style={ordersStyle.emptyText}>You have no order.</Text>
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={pageBackground}>
      <View style={ordersStyle.titleContainer}>
        <Text style={ordersStyle.titleText}>My Orders</Text>
      </View>
      


      
      <StatusBar style="auto" />
    </View>
  );
}
