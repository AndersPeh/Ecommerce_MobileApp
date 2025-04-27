import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "../screens/ProductList";
import ProductDetail from "../screens/ProductDetail";
import Category from "../screens/Category";

const Stack = createStackNavigator();

export default function ProductStackNav() {
  return (
// the first screen defined within a navigator automatically becomes the default screen.
    <Stack.Navigator
      initialRouteName='Category' 
      screenOptions={{
        headerTitleAlign:'center',
        headerTitleStyle:{
          fontWeight:'bold'
        },
        headerStyle: {
          backgroundColor: '#1A3D4F',
        },
        headerTintColor: '#F5E8C7',
      }}
    >
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
}
