import { StyleSheet, Text, Pressable, View } from 'react-native';
import buttonStyle from '../constants/buttonStyle';
// Import StyleSheet from buttonStyle

// It takes empty function as the function is carried from previous page 
// that specifies which page to navigate to.
// label is specified from previous page.
// icon refers to icon passed from previous page.
export default function FormButton({label, func=()=>{}, icon, style={}}){
    return(
// {pressed} destructures pressed to find out if the state of the button is pressed.
// if pressed, the button is applied with style of that specific button 
// passed from previous screen and opacity change.
// when it is not pressed, the button is only applied with style of that specific button
// passed from previous screen.
        <Pressable style={({pressed})=>pressed?[style, {opacity:0.5}]
            :[style]}
            onPress={func}>
{/* Display label of the Button defined in whichever file that uses it. */}
            <View style={buttonStyle.content}>
                {icon}
                {label?<Text style={buttonStyle.text}>{label}</Text>:null}
            </View>
        </Pressable>
    );
}
