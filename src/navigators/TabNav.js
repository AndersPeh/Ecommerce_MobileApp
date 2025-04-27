import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProductStackNav from "../navigators/ProductStackNav";
import MyOrders from "../screens/MyOrders";
import MyCart from "../screens/MyCart";
import UserProfile from "../screens/UserProfile";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
export default function TabNav() {

  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerStyle: {
                backgroundColor: '#1A3D4F',
            },
            headerTintColor: '#F5E8C7',
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;
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
        })}
            tabBarOptions={{
            activeTintColor: "blue",
            inactiveTintColor: "gray",
            }}
    >
      <Tab.Screen
        name="Products"
        component={ProductStackNav}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="My Cart" component={MyCart} />
      <Tab.Screen name="My Orders" component={MyOrders} />
      <Tab.Screen name="User Profile" component={UserProfile} />

    </Tab.Navigator>
  );
}
