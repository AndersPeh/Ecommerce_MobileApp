import TabNav from "./src/navigators/TabNav";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
{/* route to TabNav. The first Tab screen is Products, which makes
Products the initial Tab screen. User will be routed to ProductStackNav when the app first opened. */}
      <TabNav/>
    </NavigationContainer>
  );
}
