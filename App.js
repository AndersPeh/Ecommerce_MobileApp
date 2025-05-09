import TabNav from "./src/navigators/TabNav";
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import SplashScreen from './SplashScreenView';

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

// when the app is first loading, show the splash screen for 2 seconds
// to simulate a loading process.
  useEffect(()=>{

    setTimeout(()=>{

      setIsLoading(false);

    }, 2000);

  }, []);

  if(isLoading){
    return <SplashScreen />;
  }

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
