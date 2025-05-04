import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "../screens/ProductList";
import ProductDetail from "../screens/ProductDetail";
import Categories from "../screens/Categories";

const Stack = createStackNavigator();

export default function ProductStackNav() {
  return (
// first screen to show up when routed to ProductStackNav is Categories
    <Stack.Navigator
      initialRouteName='Categories' 

    >
{/* When user clicks a category on Categories screen, the user will be routed
to ProductList screen. When user clicks a Product in ProductList screen, the user will
be routed to ProductDetail screen. so it is necessary to put 3 of them in Stack Screen.
*/}
      <Stack.Screen name="Categories" component={Categories}
      options={{ headerShown: false }}/>
      <Stack.Screen name="ProductList" component={ProductList}
      options={{ headerShown: false }}/>
      <Stack.Screen name="ProductDetail" component={ProductDetail}
      options={{ headerShown: false }}/>

    </Stack.Navigator>
  );
}
