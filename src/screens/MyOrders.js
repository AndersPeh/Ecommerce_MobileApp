import { StatusBar, Text, View, FlatList, Image, Pressable, Alert, ActivityIndicator, ScrollView, SectionList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import SmallButton from '../components/SmallButton';
import buttonStyle from '../constants/buttonStyle';
import pageBackground from '../constants/pageBackground';
import { useMemo, useState } from 'react';
import { updateOrder} from '../redux/orderThunks';
import ordersStyle from '../constants/ordersStyle';

export default function MyOrders({navigation}) {

// exactly how it was define in store.js and orderSlice. orders is an object with items array
// useSelector subscribes to the store and gets latest data from the store about order.
  const ordersInfo = useSelector((state) => state.order.orders);

  const token = useSelector((state)=>state.auth.token);

// to simplify useDispatch for later use.
  const dispatch = useDispatch();

// by default, shows every type of orders.
  const [showNew, setShowNew] = useState(true);
  const [showPaid, setShowPaid] = useState(true);
  const [showDelivered, setShowDelivered] = useState(true);

// useMemo elements wont be changed when the screen re-renders. it will only be updated when there is changes in ordersInfo.
// if ordersInfo remains the same after re-render, useMemo will return the 
// previously calculated categorisedOrders object.
// useMemo can cache the result to improve performance. 
  const categorisedOrders = useMemo(()=>{

// use filter to return orders of different categories.
    const newOrdersList = ordersInfo.filter(eachOrder => eachOrder.is_paid===0 && eachOrder.is_delivered===0);

    const paidOrdersList = ordersInfo.filter(eachOrder => eachOrder.is_paid===1 && eachOrder.is_delivered===0);
    
    const deliveredOrdersList = ordersInfo.filter(eachOrder => eachOrder.is_paid===1 && eachOrder.is_delivered===1);

    return {newOrdersList, paidOrdersList, deliveredOrdersList};

  }, [ordersInfo]);

  const newOrdersSectionData = useMemo(()=>({

    title: 'New Orders',
  
// display new orders if it is pressed.
    data: showNew ? categorisedOrders.newOrdersList : [],

// showNew decides if new orders and and different caret icons will be displayed.
    showContentAndIcon: showNew,

// will be used in button to enable/ disable setShowNew
    setShowContentAndIcon: setShowNew,

// display number of products in each order.
    eachOrderNumberOfProducts: categorisedOrders.newOrdersList.length,

// for no orders message
    noOrders: showNew && categorisedOrders.newOrdersList.length === 0,

// when there is any changes in categorisedOrders, it should update ordersSection to reflect correct orders.
// when there is any changes in showNew, it should update ordersSection to
// show or hide orders.
  }),  [categorisedOrders.newOrdersList, showNew]);


  const paidOrdersSectionData = useMemo(()=>({

    title: 'Paid Orders',
  
    data: showPaid ? categorisedOrders.paidOrdersList : [],

    showContentAndIcon: showPaid,

    setShowContentAndIcon: setShowPaid,

    eachOrderNumberOfProducts: categorisedOrders.paidOrdersList.length,

    noOrders: showPaid && categorisedOrders.paidOrdersList.length === 0,

// when there is any changes in categorisedOrders, it should update ordersSection to reflect correct orders.
// when there is any changes in showPaid, it should update ordersSection to
// show or hide orders.
  }),  [categorisedOrders.paidOrdersList, showPaid]);

  const deliveredOrdersSectionData = useMemo(()=>({

    title: 'Delivered Orders',
  
    data: showDelivered ? categorisedOrders.deliveredOrdersList : [],

    showContentAndIcon: showDelivered,

    setShowContentAndIcon: setShowDelivered,

    eachOrderNumberOfProducts: categorisedOrders.deliveredOrdersList.length,

    noOrders: showDelivered && categorisedOrders.deliveredOrdersList.length === 0,

// when there is any changes in categorisedOrders, it should update ordersSection to reflect correct orders.
// when there is any changes in showDelivered, it should update ordersSection to
// show or hide orders.
  }),  [categorisedOrders.deliveredOrdersList, showDelivered]);


// put 3 sections (new, paid and delivered) objects into an array.
  const sections = useMemo(()=> [
  
    newOrdersSectionData, paidOrdersSectionData, deliveredOrdersSectionData,

  ], [newOrdersSectionData, paidOrdersSectionData, deliveredOrdersSectionData]);
  

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
    size={25}
    color="black"
    style={ordersStyle.caretIcon}    
  />;

  // Make caret down icon.
  const caretDownIcon = <Ionicons name="arrow-down-circle"
    size={25}
    color="black"
    style={ordersStyle.caretIcon}
  />;

  // collapsible order row for each order in new, paid and delivered orders.
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

    return (
      <View style={ordersStyle.orderItemContainer} >

  {/* default is collapsed, expand on first click, collapse on next click. */}
        <Pressable onPress={()=> setIsExpanded(!isExpanded)} style={ordersStyle.orderCompactRowPressable}>

          <Text style={ordersStyle.orderCompactText}>ID: {order.id}</Text>
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

// when user does not have any order, show no order.
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
  };


  return (
    <View style={pageBackground}>

      <View style={ordersStyle.titleContainer}>
        <Text style={ordersStyle.titleText}>My Orders</Text>
      </View>

      <SectionList
      
// everything different sections (new, paid, delivered) need is inside sections.
        sections={sections}

// item refers to each order of every section (new, paid, delivered).
// index is the position of that order object in that category array.
// combination of order id and index ensures uniqueness of the key.

// keyExtractor is designed to take item directly, no need to destructure.
        keyExtractor={(item, index) => item.id.toString() +index}

// when SectionList renders every order in new, paid and delivered sections,
// it will put order being rendered in OrderRow to display it.
// For example,
// sections = 
// [{ title : 'New Orders', data : [ {newOrder1} , {newOrder2} ]  },          <<< newOrders object
// {},            <<< paidOrders object
// {}]            <<< deliveredOrders object
// item refers to {newOrder1}, {newOrder2} for newOrders categories.

// renderItem actually receives an object named info containing item, index, section and separators.
// destructures item to use every order of all categories directly in OrderRow because only
// order object is needed.
        renderItem={({item}) => <OrderRow order={item}/>}

// for every section, the header is pressable which will show/ hide content of orders.
        renderSectionHeader={({section}) => (

          
            <Pressable
  // when pressed, it will show/ hide the orders of that specific category.
              onPress={()=> section.setShowContentAndIcon(!section.showContentAndIcon)}

              style={ordersStyle.categoryHeaderPressable}

              disabled={section.eachOrderNumberOfProducts===0}
            
            >
            
  {/* For the pressable, display title like New Orders and number of products for that order category. */}
              <Text style={ordersStyle.categoryHeaderText}>

                {section.title}: {section.eachOrderNumberOfProducts}</Text>

              {section.eachOrderNumberOfProducts===0? ''
              :(section.showContentAndIcon? caretUpIcon: caretDownIcon)}

            </Pressable>
      )}

// style to separate every section (new, paid, delivered)
        SectionSeparatorComponent={()=>(
          <View style={{height: ordersStyle.categorySection.marginBottom}}/>
        )}

// style of how the page can be scrolled.
        style={ordersStyle.mainScrollContainer}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}
