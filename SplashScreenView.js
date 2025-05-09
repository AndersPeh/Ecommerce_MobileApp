import { StyleSheet, View, Image } from "react-native";
import splashScreen from "./assets/splashScreen.png";

export default function SplashScreen(){
    return (
        <View style={styles.container}>
            <Image 
                source={splashScreen}
                style={styles.image}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFDAB9',
    },
    image:{
        resizeMode:'contain',
        width:'100%',
        height:'100%',
    },
});