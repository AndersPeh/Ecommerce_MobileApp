import TabNav from "./src/navigators/TabNav";
import { NavigationContainer } from '@react-navigation/native';
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
  {/* route to TabNav. The first Tab screen is Products, which makes
  Products the initial Tab screen. User will be routed to ProductStackNav when the app first opened. */}
        <TabNav/>
      </NavigationContainer>
    </Provider>
  );
}
