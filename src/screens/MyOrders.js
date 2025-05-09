import { StatusBar, Text, View, FlatList, Image, Pressable, Alert, ActivityIndicator, ScrollView, SectionList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import SmallButton from '../components/SmallButton';
import buttonStyle from '../constants/buttonStyle';
import pageBackground from '../constants/pageBackground';
import { useEffect, useMemo, useState } from 'react';
import { fetchOrders, updateOrder} from '../redux/orderThunks';
import ordersStyle from '../constants/ordersStyle';

export default function MyOrders({navigation}) {

// exactly how it was define in store.js and orderSlice. orders is an object with items array
// useSelector subscribes to the store and gets latest data from the store about order.
  const ordersInfo = useSelector((state) => state.order.orders);

  const token = useSelector((state)=>state.auth.token);

// to simplify useDispatch for later use.
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated);

// by default, shows every type of orders.
  const [showNew, setShowNew] = useState(true);
  const [showPaid, setShowPaid] = useState(true);
  const [showDelivered, setShowDelivered] = useState(true);

// loading for fetch
  const [isLoading, setIsLoading] = useState(false);


// when user logs in, retrieve orders from the server, pass it to setOrders
// setOrders will then provide cart products of the user
  useEffect(()=>{

// when the user has signed out, dont save
    if(!token){
      console.log("MyOrders: Token is required for fetching Orders.");

      return;
    }

    if(isAuthenticated && token){
// isLoading starts when user signs in to restore orders.
      setIsLoading(true);

      dispatch(fetchOrders(token))

        .unwrap()

        .catch(e=>{
          console.error("MyOrders: Failed to fetch orders:", e);
        })

// stop running after operation regardless of the result.
        .finally(()=>setIsLoading(false));
    
    }
// useEffect is triggered when there is changes in token.
// token and dispatch are included in the dependency to use it inside useEffect.
// When user logs in, the token changes from null to a valid string,
// get latest orders from the server, save them to the store.js.
  }, [token, isAuthenticated, dispatch]);


// total new orders.
  const totalNewOrders = useSelector((state)=> state.order.newOrderQuantity);


// useMemo elements wont be changed when the screen re-renders. it will only be updated when there is changes in ordersInfo.
// if ordersInfo remains the same after re-render, useMemo will return the 
// previously calculated categorisedOrders object.
// useMemo can cache the result to improve performance. 
  const categorisedOrders = useMemo(()=>{

    const newOrdersList = ordersInfo.filter(eachOrder => eachOrder.is_paid===0 && eachOrder.is_delivered===0);
    const paidOrdersList = ordersInfo.filter(eachOrder => eachOrder.is_paid===1 && eachOrder.is_delivered===0);
    const deliveredOrdersList = ordersInfo.filter(eachOrder => eachOrder.is_paid===1 && eachOrder.is_delivered===1);

    return {newOrdersList, paidOrdersList, deliveredOrdersList};

  }, [ordersInfo]);

// segregate orders in 3 sections for new, paid and delivered.
  const sections = useMemo(()=> {

  // initialise eachSection as empty array, each object in this array will represent a section in the list.
      const ordersSection = [];
  
      ordersSection.push({
  
        title: 'New Orders',
  
  // data contains the orders to render if section is shown.
        data: showNew ? categorisedOrders.newOrdersList : [],
  
  // used by renderSectionHeader to toggle visibility and show correct icon.
        showContentAndIcon: showNew,
  
  // function to toggle visibility.
        setShowContentAndIcon: setShowNew,
  
  // for display in header
        eachOrderNumberOfProducts: categorisedOrders.newOrdersList.length,
  
  // for no orders message
        noOrders: showNew && categorisedOrders.newOrdersList.length === 0,
      });
  
  
      ordersSection.push({
  
        title: 'Paid Orders',
  
  // data contains the orders to render if section is shown.
        data: showPaid ? categorisedOrders.paidOrdersList : [],
  
  // used by renderSectionHeader to toggle visibility and show correct icon.
        showContentAndIcon: showPaid,
  
  // function to toggle visibility.
        setShowContentAndIcon: setShowPaid,
  
  // for display in header
        eachOrderNumberOfProducts: categorisedOrders.paidOrdersList.length,
  
  // for no orders message
        noOrders: showPaid && categorisedOrders.paidOrdersList.length === 0,
      });
  
      ordersSection.push({
  
        title: 'Delivered Orders',
  
  // data contains the orders to render if section is shown.
        data: showDelivered ? categorisedOrders.deliveredOrdersList : [],
  
  // used by renderSectionHeader to toggle visibility and show correct icon.
        showContentAndIcon: showDelivered,
  
  // function to toggle visibility.
        setShowContentAndIcon: setShowDelivered,
  
  // for display in header
        eachOrderNumberOfProducts: categorisedOrders.deliveredOrdersList.length,
  
  // for no orders message
        noOrders: showDelivered && categorisedOrders.deliveredOrdersList.length === 0,
      });
  
  // it will be a section with different order categories.
      return ordersSection;
  
  // when there is any changes in categorisedOrders, it should update ordersSection to reflect correct orders.
  // when there is any changes in showNew, showPaid, showDelivered, it should update ordersSection to
  // reflect the correct status.
  }, [categorisedOrders, showNew, showPaid, showDelivered]);
  

  const paymentConfirmed = async (id) => {

    if(!token){
      Alert.alert('Error', 'You must sign in first.');
      return;
    }

// dispatch updateOrder to save the paid order to the server.
    try{
      await dispatch(updateOrder({id: id, is_paid:1, is_delivered:0, token:token})).unwrap();

      Alert.alert('Paid Successfully!');

    } catch(e){

      console.error('Payment Failed for order:', id, e);

      Alert.alert('Payment Failed', e.message || 'Could not process payment.')
    }
  };
  
  const deliveryConfirmed = async (id) => {

    if(!token){
      Alert.alert('Error', 'You must sign in first.');
      return;
    }

// dispatch updateOrder to save the delivered order to the server.
    try{

      await dispatch(updateOrder({id: id, is_delivered:1, is_paid:1, token:token})).unwrap();

      Alert.alert("Enjoy your purchase!");

    } catch(e){

      console.error("Delivery Confirmation Failed", e);

      Alert.alert("Delivery Confirmation Failed", e.message || 'Could not process delivery.');

    }
  };

  // display each product in every order.
  const eachProductOfOrder = ({item}) => {
    return (
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
    );
  };

  // Make caret up icon.
  const caretUpIcon = <Ionicons name="arrow-up-circle"
    size={20}
    color="#004D66"
    style={ordersStyle.caretIcon}    
  />;

  // Make caret down icon.
  const caretDownIcon = <Ionicons name="arrow-down-circle"
    size={20}
    color="#004D66"
    style={ordersStyle.caretIcon}
  />;

  // collapsible order row for new, paid and delivered orders.
  const OrderRow = ({order}) => {

  // order row is collapsed by default.
    const [isExpanded, setIsExpanded] = useState(false);

  // order is not updated by default.
    const [isUpdating, setIsUpdating] = useState(false);



    // Make Receive icon.
    const receiveIcon = <Ionicons name="car"
      size={25}
      color="#004D66"
      style={buttonStyle.iconStyle}
    />;

    // Make Pay icon.
    const payIcon = <Ionicons name="card"
      size={25}
      color="#004D66"
      style={buttonStyle.iconStyle}
    />;



  // set isUpdating true when it is processing payment. 
    const handlePay = async () => {

      if(isUpdating) return;

      setIsUpdating (true);

      await paymentConfirmed(order.id);

      setIsUpdating(false);
    };

  // set isUpdating true when it is processing delivery confirmation.
    const handleReceive = async () => {

      if(isUpdating) return;

      setIsUpdating (true);

      await deliveryConfirmed(order.id);

      setIsUpdating(false);
    };

  // if there is order_items, set it as productsInOrder. if no order, then empty array.
    const productsInOrder = order.order_items || [];

    if(isExpanded){
      console.log(`OrderRow (ID:${order.id}) - productsInOrder keys:`, JSON.stringify(
        productsInOrder.map(product => product.prodID || product.id)));
    }

    return (
      <View style={ordersStyle.orderItemContainer}>

  {/* default is collapsed, expand on first click, collapse on next click. */}
        <Pressable onPress={()=> setIsExpanded(!isExpanded)} style={ordersStyle.orderCompactRowPressable}>
          <Text style={ordersStyle.orderCompactTextBold}>ID: {order.id}</Text>
          <Text style={ordersStyle.orderCompactText}>Products: {order.item_numbers}</Text>
          <Text style={ordersStyle.orderCompactText}>Total: ${(order.total_price/ 100).toFixed(2)}</Text>

  {/* isExpanded shows Up Icon. Collapsed shows Down Icon. */}
          {isExpanded? caretUpIcon : caretDownIcon}
        </Pressable>

  {/* if expanded, show flatlist and button */}
        {isExpanded && (
          <View style={ordersStyle.orderExpandedDetailsContainer}>

  {/* display products of the order*/}
            <FlatList 
              data={productsInOrder}
              renderItem={eachProductOfOrder}
              keyExtractor={(product, index)=>(product.prodID||product.id || index).toString()}
            />

            <View style={ordersStyle.actionButtonContainer}>
              {order.is_paid ===0 && (
                <SmallButton 
                  func= {handlePay}
                  label="Pay"
                  icon={payIcon}
                  style={ordersStyle.orderActionButton}
                  
  // disable the button when it is updating.
                  disabled= {isUpdating}
                />
              )}

              {order.is_paid ===1 && order.is_delivered===0 && (
                <SmallButton 
                  func= {handleReceive}
                  label="Receive"
                  icon={receiveIcon}
                  style={ordersStyle.orderActionButton}
                  
  // disable the button when it is updating.
                  disabled= {isUpdating}
                />
              )}

              {isUpdating && <ActivityIndicator
                style={ordersStyle.actionLoadingIndicator}
                size='large'
                color='#004D66'
              />}

            </View>
          </View>
        )}
      </View>
    );};

// when user does not have any order except when it is loading.
  if((ordersInfo.length===0 || !ordersInfo) && !isLoading){
    return (
      <View style={pageBackground}>
        <View style={ordersStyle.titleContainer}>
          <Text style={ordersStyle.titleText}>My Orders</Text>
        </View>        
        <Text style={ordersStyle.emptyText}>You have no order.</Text>
        <StatusBar style="auto" />
      </View>
    )
  };


// isLoading runs when loading orders including first time loading orders.
  if(isLoading && (!ordersInfo || ordersInfo.length===0)){
    return(
      <View style={[pageBackground, ordersStyle.loadingContainer]}>

        <ActivityIndicator size='large' color="#F5E8C7"/>
        <Text style={ordersStyle.loadingText}>Loading Your Orders...</Text>
        <StatusBar style="auto" />

      </View>
    );
  };



  return (
    <View style={pageBackground}>


      <SectionList
      
        sections={sections}
        keyExtractor={(item, index) => item.id.toString() +index}
        renderItem={({item}) => <OrderRow order={item}/>}
        renderSectionHeader={({section}) => (
          <Pressable
            onPress={()=> section.setShowContentAndIcon(!section.showContentAndIcon)}

            style={ordersStyle.categoryHeaderPressable}
          
          >
          
            <Text style={ordersStyle.categoryHeaderText}>
              {section.title}: {section.eachOrderNumberOfProducts}</Text>
            {section.showContentAndIcon? caretUpIcon: caretDownIcon}
          </Pressable>
      )}

// the footer only appears when there is no order. it displays No orders under the header.
        renderSectionFooter={({section}) => {
          if(section.noOrders){
            return(
              <Text style={ordersStyle.emptyText}>
                No orders in this order category.
              </Text>

            );
          }

// no footer if section is not empty or not shown.
          return null;
        }}

// header of the page, before the section list.
        ListHeaderComponent={
          <>
            <View style={ordersStyle.titleContainer}>
              <Text style={ordersStyle.titleText}>My Orders</Text>
            </View>

            {isLoading && ordersInfo && ordersInfo.length > 0 && <ActivityIndicator
              color='#FFBF00'
              style={{marginVertical:5}}
            
            />}

          </>
        }

        contentContainerStyle={{paddingHorizontal: ordersStyle.categorySection.marginHorizontal}}

        SectionSeparatorComponent={()=>(
          <View style={{height: ordersStyle.categorySection.marginBottom}}/>
        )}

        stickySectionHeadersEnabled={true}

        style={ordersStyle.mainScrollContainer}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}
