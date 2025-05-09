import { useState } from 'react';
import { Text, View, TextInput, Alert, ActivityIndicator, StatusBar, Pressable, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import { signInSuccess, signUpSuccess, signOut,updateUserSuccess } from '../redux/authSlice';
import FormButton from '../components/FormButton';
import pageBackground from '../constants/pageBackground';
import buttonStyle from '../constants/buttonStyle';
import userProfileStyle from '../constants/userProfileStyle';
import loadingMessage from '../constants/loadingMessage';
import { clearCart } from '../redux/cartSlice';
import { fetchCart } from '../redux/cartThunks';
import { CommonActions } from '@react-navigation/native';
import { clearOrders } from '../redux/orderSlice';
import { useEffect } from 'react';
import { fetchOrders } from '../redux/orderThunks';

export default function UserProfile({navigation, route}) {
// URL to run on local machine
  const API_URL = 'http://10.0.2.2:3000'; 

// simplify useDispatch to use it later for dispatching action to control state.
  const dispatch= useDispatch();

// useSelection subscribes to the store to get the latest update about auth slice.
// {user, token. isAuthenticated} destructure the returned object to 
// get respective values only.
  const {user, token, isAuthenticated} = useSelector((state)=>state.auth);

// false by default, true when user presses button.
  const [loading, setLoading] = useState(false);

// switch between Sign In and Sign Up. Initialise in sign in mode (false)
  const [signUpMode, setSignUpMode] = useState(false);

// sign up information
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

// sign in information
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

// update information and update mode
  const [updateName, setUpdateName] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [updateMode, setUpdateMode] = useState(false);


// Make a cancel icon.
  const cancelIcon = <Ionicons name="close-circle"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

// Make a confirm icon.
  const confirmIcon = <Ionicons name="checkmark-circle"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

// Make a sign out icon.
  const signOutIcon = <Ionicons name="log-out"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

  // Make a clear icon.
  const clearIcon = <Ionicons name="remove-circle"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

    // Make an update icon.
  const updateIcon = <Ionicons name="push"
    size={25}
    color="#004D66"
    style={buttonStyle.iconStyle}
  />;

// when user logs in, retrieve orders from the server, pass it to setOrders
// setOrders will then provide cart products of the user
  useEffect(()=>{

// when the user has signed out, dont save
    if(!token){
      console.log("MyOrders: Token is required for fetching Orders.");

      return;
    }

    if(isAuthenticated && token){
// isLoading starts when user signs in to restore orders.
      setLoading(true);

      dispatch(fetchOrders(token))

        .unwrap()

        .catch(e=>{
          console.error("MyOrders: Failed to fetch orders:", e);
        })

// stop running after operation regardless of the result.
        .finally(()=>setLoading(false));
    
    }
// useEffect is triggered when there is changes in token.
// token and dispatch are included in the dependency to use it inside useEffect.
// When user logs in, the token changes from null to a valid string,
// get latest orders from the server, save them to the store.js.
  }, [token, isAuthenticated, dispatch]);


// clear sign in fields after signing in
  const clearSignIn = () =>{
    setSignInEmail('');
    setSignInPassword('');
  }

// clear sign up fields after signing up
  const clearSignUp = () =>{
    setSignUpEmail('');
    setSignUpName('');
    setSignUpPassword('');
    // setSignUpMode(false);
  }

// clear update fields after updating or cancelling
  const clearUpdate = () =>{
    setUpdateName('');
    setUpdatePassword('');
    setUpdateMode(false);

  }

  // clear everything to sign out
  const signOutConfirmed =()=>{

// set user and token to null. isAuthenticated to false.
    dispatch(signOut());

// clearCart for the next user.
    dispatch(clearCart());

// clear Orders for the next user.
    dispatch(clearOrders());

// reset the TabNavigator state after sign out so next user won't see 
// screen selected by previous user.
    navigation.dispatch(

// after reset, the app will go to index 3 screen which is User Profile screen.
      CommonActions.reset({
        index:3,
        
// reset these routes.
        routes:[
          {name:'Products'},
          {name:'My Cart'},
          {name:'My Orders'},
          {name:'User Profile'}

        ]
      })
    );

  }

  // prefill user name and open update form by activating update mode.
  const openUpdateForm = () => {
    setUpdateName(user.name?user.name:"");
    setUpdatePassword('');
    setUpdateMode(true);
  }


// handle the event when user clicks sign in
const signInConfirmed = async ()=> {

  if(!signInEmail ||!signInPassword){
      Alert.alert('Error', 'Email and Password are required.')
      return;
  }

// loading starts when confirm button is pressed and all details are provided.
  setLoading(true);

  try {

// set the POST request to the URL inside fetch() to sign in
      const response = await fetch(`${API_URL}/users/signin`,{
          method:'POST',
          headers:{

// tell the server json data is being sent
              'Content-Type':'application/json',
          },

// actual data sent contains an stringified object with email and password.
// Because HTTP request only accepts string value.
          body: JSON.stringify({email:signInEmail, password:signInPassword}),
// when the middle_ware\user.js receives it, it will destructures email and password from the body.
//   const { email, password } = req.body;
// then dn\index.js will check sign in  information
// const checkUser = async ({ email, password }) => {
  // const query = `select * from users where email=$email and password = $password`;
      });

// get the response from the POST request
      const data = await response.json();

// data.status will be ok when the POST request is successful
// when there is an error, the status should be error instead of OK.
      if (data.status==='OK'){

// dispatch to store.js to put user information after check returns ok from server.
// then store.js will run authReducer which uses the authSlice
          dispatch(signInSuccess({user:{id:data.id, name:data.name, email:data.email}, 
            token:data.token,}));
            
// retrieve cart information through cartThunks
          if(data.token){
            dispatch(fetchCart(data.token))
// unwrap to catch rejection
              .unwrap()
// in case there is any dispatch rejection.
              .catch(e=>console.error("Failed to fetch cart after Sign In:", e));

            
          }

// clear input fields after successfully sign in.
          clearSignIn();  
      }else{
          Alert.alert('Sign In failed', data.message?data.message:'');
      }

  } catch (e) {
// the issue is with the server connection if the function is not working properly.
// title is Network Error and Message is Server Connection Issue.

    Alert.alert('Network Error', 'Server Connection Failed.');
  } finally {

// stop loading after the operation.
    setLoading(false);
  }
};



// handle the event when user clicks sign up
  const signUpConfirmed = async ()=> {

    if(!signUpEmail ||!signUpName|| !signUpPassword){
        Alert.alert('Error', 'Email, Name and Password are required.')
        return;
    }

// loading starts when confirm button is pressed and all details are provided.
    setLoading(true);

    try {

// set the POST request to the URL inside fetch() to sign up
      const response = await fetch(`${API_URL}/users/signup`,{
          method:'POST',
          headers:{

// tell the server json data is being sent
              'Content-Type':'application/json',
          },

// actual data sent contains an stringified object with email, name and password.
// Because HTTP request only accepts string value.
          body: JSON.stringify({name:signUpName, email:signUpEmail, password:signUpPassword}),
// when the middle_ware\user.js receives it, it will destructures email, name and password from the body.
//   const { name, email, password } = req.body;
// then dn\index.js will create table for new user
// const createUser = async ({ name, email, password }) => {
//   const insertUserSql = `insert into users (name,email,password) 
//         values (?,?,?)`;
      });

// get the response from the POST request
      const data = await response.json();

// data.status will be ok when the POST request is successful
// when there is an error, the status should be error instead of OK.
      if (data.status==='OK'){

// dispatch to store.js to put user information after check returns ok from server.
// then store.js will run authReducer which uses the authSlice
// token is generated from middle_ware/auth.js
          dispatch(signUpSuccess({user:{id:data.id, name:data.name, email:data.email}, 
            token:data.token,}));

          // retrieve cart information through cartThunks
          if(data.token){
            dispatch(fetchCart(data.token))
          // unwrap to catch rejection
              .unwrap()
          // in case there is any dispatch rejection.
              .catch(e=>console.error("Failed to fetch cart after Sign In:", e));
          }

// clear input fields after successfully sign up.
          clearSignUp();
          setSignUpMode(false);  

      }else{
          Alert.alert('Sign Up failed', data.message?data.message:'');
      }

    } catch (e) {

      Alert.alert('Network Error', 'Server Connection Failed.');

    } finally {

  // stop loading after the operation.
      setLoading(false);
    }
  };


// handle the event when user clicks confirm on update form
  const updateConfirmed = async ()=> {
      if(!updateName ||!updatePassword){
          Alert.alert('Error', 'New name and new password are required.')
          return;
      }

      try {
// set the POST request to the URL inside fetch() to update
          const response = await fetch(`${API_URL}/users/update`,{
              method:'POST',
              headers:{
// tell the server json data is being sent
                  'Content-Type':'application/json',
// the server will know the user is logged in and authorised to update the profile
                  'Authorization': `Bearer ${token}`,
              },
// actual data sent contains an stringified object with updatename and updatepassword.
// Because HTTP request only accepts string value.
              body: JSON.stringify({name:updateName, password:updatePassword}),
// when the middle_ware\user.js receives it, it will destructures name and password from the body.
//   const { name, password } = req.body;
// then dn\index.js will update the database
// const updateUser = async ({ userID, name, password }) => {
//   const query = `update users set name = $name, password = $password where id = $id`;
//   if (!name || !password)
//   try {
//     await dbRun(query, { $name: name, $password: password, $id: userID });
          });

// get the response from the POST request
          const data = await response.json();
// data.status will be ok when the POST request is successful
// when there is an error, the status should be error instead of OK.
          if (data.status==='OK'){

// dispatch to store.js to update user name after updating database.
// then store.js will run authReducer which uses the authSlice
              dispatch(updateUserSuccess({name:data.name}));

// Title is Updated Successfully,
// Button is OK and will route user back to UserProfile screen.
              Alert.alert('Updated Successfully!');
              clearUpdate();
          }else{
            Alert.alert('Profile Update failed', data.message?data.message:'');
          }
      } catch (e) {

        Alert.alert('Network Error', 'Server Connection Issue.');

      }
  };

// when the app is loading, show loading message.
  if (loading){
    return (
      <View style={loadingMessage.body}>
          <ActivityIndicator size="large" color="#F5E8C7" />
          <Text style={loadingMessage.text}>Loading...</Text>
      </View>
    );
  }

  return(
      <View style={pageBackground}>

          <View style={userProfileStyle.titleContainer}>
              <Text style={userProfileStyle.titleText}>User Profile</Text>
          </View>
{/* when the system has true isAuthenticated and has user object, shower user profile */}
          {isAuthenticated && user?(
            <>
              <View style={userProfileStyle.profileInfoContainer}>
                <Text style={userProfileStyle.infoText}>
                  <Text style={userProfileStyle.infoLabel}>User Name: </Text> {user.name}
                </Text>

                <Text style={userProfileStyle.infoText}>
                  <Text style={userProfileStyle.infoLabel}>Email: </Text> {user.email}
                </Text>
              </View>

              <View style={userProfileStyle.buttonRow}>
                <FormButton 
                  label="Update" 
                  func= {openUpdateForm}
                  icon={updateIcon}
                  style={buttonStyle.formButton}
                ></FormButton>

                <FormButton 
                    label="Sign Out" 
                    func= {signOutConfirmed}
                    icon={signOutIcon}
                    style={buttonStyle.formButton}
                ></FormButton>
              </View>
            </>
          ):(
// When user is not signed in, show sign in form because signupMode is false by default.
            <View style={userProfileStyle.formContainer}>
{/* show sign up form when sign up mode is true */}
              {signUpMode? (
                <>
                  <Text style={userProfileStyle.formTitle}>Sign Up as a New User</Text>

                  <Text style={userProfileStyle.inputLabel}>User Name</Text>

                  <TextInput
                    style={userProfileStyle.input}
                    placeholder='Enter your name'
                    value={signUpName}
                    onChangeText={setSignUpName}
                    autoCapitalize='words'
                  />

                  <Text style={userProfileStyle.inputLabel}>Email</Text>

                  <TextInput
                    style={userProfileStyle.input}
                    placeholder='Enter your email'
                    value={signUpEmail}
                    onChangeText={setSignUpEmail}
                    keyboardType='email-address'
                  />

                  <Text style={userProfileStyle.inputLabel}>Password</Text>

                  <TextInput
                    style={userProfileStyle.input}
                    placeholder='Enter your password'
                    value={signUpPassword}
                    onChangeText={setSignUpPassword}
                    secureTextEntry
                  />

                  <View style={userProfileStyle.formButtonRow}>
                    <FormButton 
                      label="Clear" 
                      func= {clearSignUp}
                      icon={clearIcon}
                      style={buttonStyle.formButton}
                    ></FormButton>

                    <FormButton 
                        label="Sign Up" 
                        func= {signUpConfirmed}
                        icon={confirmIcon}
                        style={buttonStyle.formButton}
                    ></FormButton>

                  </View>

                  <Pressable onPress={()=>setSignUpMode(false)}>
                    <Text style={userProfileStyle.switchFormText}>Switch to: Sign In with Existing Account</Text>
                  </Pressable>

                </>
              ):(
                <>
                  <Text style={userProfileStyle.formTitle}>Sign In with your Email and Password</Text>

                  <Text style={userProfileStyle.inputLabel}>Email</Text>

                  <TextInput
                    style={userProfileStyle.input}
                    placeholder='Enter your email'
                    value={signInEmail}
                    onChangeText={setSignInEmail}
                    keyboardType='email-address'
                  />

                  <Text style={userProfileStyle.inputLabel}>Password</Text>

                  <TextInput
                    style={userProfileStyle.input}
                    placeholder='Enter your password'
                    value={signInPassword}
                    onChangeText={setSignInPassword}
                    secureTextEntry
                  />

                  <View style={userProfileStyle.formButtonRow}>
                    <FormButton 
                      label="Clear" 
                      func= {clearSignIn}
                      icon={clearIcon}
                      style={buttonStyle.formButton}
                    ></FormButton>

                    <FormButton 
                        label="Sign In" 
                        func= {signInConfirmed}
                        icon={confirmIcon}
                        style={buttonStyle.formButton}
                    ></FormButton>

                  </View>

                  <Pressable onPress={()=>setSignUpMode(true)}>
                    <Text style={userProfileStyle.switchFormText}>Switch to: Sign Up as a New User</Text>
                  </Pressable>

                </>
              )}
            </View>
          )}
{/* present content temporarily without navigating away from the screen. */}
          <Modal
            animationType='fade'
            transparent={true}
            visible={updateMode}
            onRequestClose={clearUpdate}
          >
            <View style={userProfileStyle.updateContainer}>
              <View style={userProfileStyle.updateContainerView}>

                <Text style={userProfileStyle.updateInputLabel}>New User Name</Text>
                <TextInput 
                    style={userProfileStyle.updateInput}
                    placeholder='Enter new user name'
                    value={updateName}
                    onChangeText={setUpdateName}
// capitalise first letter of each word
                    autoCapitalize='words'
                />

                <Text style={userProfileStyle.updateInputLabel}>New Password</Text>
                <TextInput 
                    style={userProfileStyle.updateInput}
                    placeholder='Enter new password'
                    value={updatePassword}
                    onChangeText={setUpdatePassword}
// it will show the password in special characters to increase security
                    secureTextEntry
                />
{/* if loading is true, show loading screen and deactivates all buttons*/}
                {loading && (
                  <View style={loadingMessage.body}>
                    <ActivityIndicator size="large" color="#F5E8C7" />
                    <Text style={loadingMessage.text}>Loading...</Text>
                  </View>
                )}
                <View style={userProfileStyle.updateButtonRow}>
                    <FormButton 
                        label="Confirm" 
                        func= {updateConfirmed}
                        icon={confirmIcon}
                        style={buttonStyle.formButton}
  // when loading, buttons cannot be pressed.
                        disabled={loading}
                    ></FormButton>

                    <FormButton 
                        label="Cancel" 
                        func= {clearUpdate}
                        icon={cancelIcon}
                        style={buttonStyle.formButton}
                        disabled={loading}
                    ></FormButton>
                </View>
              </View>
            </View>
          </Modal>

          <StatusBar style="auto" />

      </View>
  );
}