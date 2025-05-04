import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProductStackNav from "../navigators/ProductStackNav";
import MyOrders from "../screens/MyOrders";
import MyCart from "../screens/MyCart";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import UserProfile from "../screens/UserProfile";
import { Alert } from "react-native";

const Tab = createBottomTabNavigator();

// To display bottom tab navigator in following screens.
export default function TabNav() {

// get cart items to calculate total quantity for the badge
  const cartProducts = useSelector((state)=> state.cart.products);
  const totalQuantity = cartProducts.reduce((sum, eachProduct)=>
    sum+=eachProduct.quantity
  ,0);

// get authentication status
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated);

// if user is not signed in, user cannot use tab navigation. User will be routed to User Profile screen to login.
  const tabProtection = (pressTab, navigation) => {
    if(!isAuthenticated){
// the default action of pressTab event is to navigate in tab navigator (from tabPress)
// when unauthenticated user tries to press any of the tab,
// the user wont be able to navigate to any screen.
      pressTab.preventDefault();
      Alert.alert(
        "You must sign in to use the app.", null,
        [{text:'Sign In', onPress:()=>navigation.navigate('User Profile')}]
      );
    }
  };

  return (
    <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
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
// destructures navigation to use it in tabProtection.
// pass navigation to tabProtection to navigate user to User Profile screen later.
// tabPress is the event that runs when the user pressed the bottom tab of this screen.
// listener listens to tabPress then puts event information into pressTab object.
// pass pressTab to tabProtection to restrict user from using default action later.
        listeners={({navigation})=>({
          tabPress: pressTab => tabProtection(pressTab, navigation),
        })}
      />
      
      <Tab.Screen name="My Cart" 
        component={MyCart} 
        options={{
// only show badge when there is quantity
          tabBarBadge: isAuthenticated&&totalQuantity > 0? totalQuantity:null,
          tabBarBadgeStyle:{backgroundColor:"red", colour:"white"},
          headerShown: false
        }}
        listeners={({navigation})=>({
          tabPress: pressTab => tabProtection(pressTab, navigation),
        })}
      />

      <Tab.Screen name="My Orders" 
        component={MyOrders} 
        options={{ headerShown: false }}
        listeners={({navigation})=>({
          tabPress: pressTab => tabProtection(pressTab, navigation),
        })}
      />

      <Tab.Screen name="User Profile" 
        component={UserProfile} 
        options={{ headerShown: false }}
      />

    </Tab.Navigator>
  );
}
