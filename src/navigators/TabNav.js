import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProductStackNav from "../navigators/ProductStackNav";
import MyOrders from "../screens/MyOrders";
import MyCart from "../screens/MyCart";
import UserProfile from "../screens/UserProfile";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

// To display bottom tab navigator in following screens.
export default function TabNav() {

// get cart items to calculate total quantity for the badge
  const cartProducts = useSelector((state)=> state.cart.products);
  const totalQuantity = cartProducts.reduce((sum, eachProduct)=>
    sum+=eachProduct.quantity
  ,0);

  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
// Header style of each Tab screen.
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerStyle: {
                backgroundColor: '#091235',
            },
            headerTintColor: '#F5E8C7',
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;
// When it is focused, show solid icon. Else, show icon with outline only, hollow body.
            if (route.name === "Products") {
                iconName = focused ? "home" : "home-outline";
            } else if (route.name === "My Cart") {
                iconName = focused ? "cart" : "cart-outline";
            } else if (route.name === "My Orders") {
                iconName = focused ? "gift" : "gift-outline";
            } else if (route.name === "User Profile") {
                iconName = focused ? "person-circle" : "person-circle-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
            },
// match Bottom Tab Navigator theme with Header theme to ensure consistency.
            tabBarStyle: {
              backgroundColor: '#091235', 
              borderTopWidth: 0,
            },
            // selected tab will become gold.
            tabBarActiveTintColor: "#FFBF00", 
            tabBarInactiveTintColor: "white", 
        })}
    >
      <Tab.Screen
        name="Products"
// The initial route of ProductStackNav is Category screen, which means user will see Categories
// when the app is first opened.
        component={ProductStackNav}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="My Cart" 
        component={MyCart} 
        options={{
// only show badge when there is quantity
          tabBarBadge: totalQuantity > 0? totalQuantity:null,
          tabBarBadgeStyle:{backgroundColor:"red", colour:"white"},
          headerShown: false
        }}
      />
      <Tab.Screen name="My Orders" component={MyOrders} />
      <Tab.Screen name="User Profile" component={UserProfile} />

    </Tab.Navigator>
  );
}
