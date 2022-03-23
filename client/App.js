import React, { useEffect, useState } from 'react'
import { View, Text, Alert, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AllReducers from './AllReducers'
import Login from './Login'
import Home from './Home'
import Cart from './Cart'
import MyOrders from './MyOrders'
import Products from './Products'
import { LoginAction } from './actions/AuthenticationActions'
import Account from './Account'
import SpecificOrder from './SpecificOrder'
import LoadingScreen from './LoadingScreen'
import MerchantOrders from './MerchantOrders'
// import io from 'socket.io-client'
import MerchantSignUp from './MerchantSignUp'
import HandleStore from './HandleStore'
import SignUp from './SignUp'
import GoogleMap from './GoogleMap'
import RiderSignUp from './RiderSignUp'
import Rider from './Rider'
import RiderOrders from './RiderOrders'
import RiderGetTask from './RiderGetTask'
import RiderConfirmOrder from './RiderConfirmOrder'
import Chat from './Chat'

const store = createStore(AllReducers)

const Stack = createNativeStackNavigator()
const Bottom = createBottomTabNavigator()


const WarpHome = () => {

  let cart = useSelector(state => state.cart.cart)

  let phone = useSelector((state)=>{
    return state.authen.phone
  })

  let role = useSelector(state => state.authen.role)

  let cart_length = cart.reduce((total, item) => {
    return total + item.quantity
  }, 0)


  return (
    <Bottom.Navigator>

      <Bottom.Screen name='HOME' component={Home} options={{
        headerShown: false, tabBarLabel: 'หน้าหลัก', tabBarLabelStyle: { fontFamily: 'prompt' }, tabBarIcon: ({ focused, color, size }) => {
          return (
            <View>
              <Image style={{ width: size, height: size, tintColor: focused ? color : 'gray' }} source={require('./vector/home.png')}></Image>
            </View>
          )
        }
      }}></Bottom.Screen>

      <Bottom.Screen name='CART' component={Cart} options={{ headerShown: false, tabBarLabel: 'ตะกร้า', tabBarLabelStyle: { fontFamily: 'prompt' }, tabBarBadge: cart_length == 0 ? null : cart_length, tabBarIcon: ({focused, color, size})=>{
        return(
          <View>
            <Image style={{width: size, height: size, tintColor: focused ? color : 'gray'}} source={require('./vector/bag.png')}></Image>
          </View>
        )
      } }}></Bottom.Screen>

      <Bottom.Screen name='MY_ORDERS' component={MyOrders} options={{ headerShown: false, tabBarLabel: 'การสั่งซื้อ', tabBarLabelStyle: { fontFamily: 'prompt' }, unmountOnBlur: true, tabBarIcon: ({focused, color, size})=>{
        return(
          <View>
            <Image style={{width: size, height: size, tintColor: focused ? color : 'gray'}} source={require('./vector/package-box.png')}></Image>
          </View>
        )
      } }}></Bottom.Screen>
      
      <Bottom.Screen name='SPECIFIC_ORDER' component={SpecificOrder} options={{ headerShown: false, tabBarItemStyle: { display: 'none' }, unmountOnBlur: true }}></Bottom.Screen>
      
      <Bottom.Screen name='MERCHANT_ORDERS' component={MerchantOrders} options={{ tabBarItemStyle: { display: role !== 1 ? 'none' : 'flex' }, tabBarLabel: 'ร้านค้า', tabBarLabelStyle: { fontFamily: 'prompt' }, headerShown: false, unmountOnBlur: true, tabBarIcon: ({focused, color, size})=>{
        return(
          <View>
            <Image source={require('./vector/store.png')} style={{width: size, height: size, tintColor: focused ? color : 'gray'}}></Image>
          </View>
        )
      } }}></Bottom.Screen>

      <Bottom.Screen name='RIDER_SIGN_UP' component={RiderSignUp} options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}></Bottom.Screen>
      
      <Bottom.Screen name='RIDER' component={Rider} options={{headerShown: false, tabBarItemStyle: {display: role !== 2 ? 'none' : 'flex'}, tabBarLabel: 'การส่งของ', tabBarLabelStyle: {fontFamily: 'prompt'}, unmountOnBlur: true , tabBarIcon: ({focused, color, size})=>{
        return(
          <View>
            <Image style={{width: size, height: size, tintColor: focused ? color : 'gray'}} source={require('./vector/rider.png')}/>
          </View>
        )
      }}}></Bottom.Screen>

      <Bottom.Screen name='RIDER_ORDERS' component={RiderOrders} options={{headerShown: false, tabBarItemStyle: {display: 'none'}, unmountOnBlur: true}}></Bottom.Screen>

      <Bottom.Screen name='ACCOUNT' component={Account} options={{ headerShown: false, tabBarLabel: 'ผู้ใช้', tabBarLabelStyle: { fontFamily: 'prompt' }, unmountOnBlur: true, tabBarIcon: ({focused, color, size})=>{
        return(
          <View>
            <Image source={require('./vector/user.png')} style={{width: size, height: size, tintColor: focused ? color : 'gray'}}></Image>
          </View>
        )
      } }}></Bottom.Screen>

      <Bottom.Screen name='PRODUCTS' component={Products} options={{ tabBarItemStyle: { display: 'none' }, unmountOnBlur: true }}></Bottom.Screen>
      <Bottom.Screen name='MerchantSignUp' component={MerchantSignUp} options={{ tabBarItemStyle: { display: 'none' }, unmountOnBlur: true, headerShown: false }}></Bottom.Screen>
      <Bottom.Screen name='HANDLE_STORE' component={HandleStore} options={{ tabBarItemStyle: { display: 'none' }, headerShown: false, unmountOnBlur: true }}></Bottom.Screen>
      <Bottom.Screen name='MAP' component={GoogleMap} options={{ tabBarItemStyle: { display: 'none' }, headerShown: false, unmountOnBlur: true }}></Bottom.Screen>
      <Bottom.Screen name='RIDER_GET_TASK' component={RiderGetTask} options={{tabBarItemStyle: {display: 'none'}, headerShown: false, tabBarStyle: {display: 'none'}}}></Bottom.Screen>
      <Bottom.Screen name='RIDER_CONFIRM_ORDER' component={RiderConfirmOrder} options={{tabBarItemStyle: {display: 'none'}, headerShown: false, tabBarStyle: {display: 'none'}}}></Bottom.Screen>
      <Bottom.Screen name='CHAT' component={Chat} options={{tabBarItemStyle: {display: 'none'}, unmountOnBlur: true}}></Bottom.Screen>
    </Bottom.Navigator>
  )
}


const App = () => {

  let dispatch = useDispatch()

  let phone = useSelector(state => state.authen.phone)
  let loadScreen = useSelector(state => state.authen.loadScreen)

  // let login=async()=>{
  //   const user = await AsyncStorage.getItem('phone')

  //   if(user){
  //     dispatch(LoginAction(user, '123456'))
  //   }
  // }


  // useEffect(()=>{
  //   login()
  // }, [])

  // console.log(phone)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!loadScreen ? <Stack.Screen name='LOADING_SCREEN' component={LoadingScreen} options={{ headerShown: false }}></Stack.Screen> : !phone ? <Stack.Screen name='LOGIN' component={Login} options={{ headerShown: false }}></Stack.Screen> : <Stack.Screen name='WARP_HOME' component={WarpHome} options={{ headerShown: false }}></Stack.Screen>}
        <Stack.Screen name='SIGN_UP' component={SignUp} options={{headerShown: false}}></Stack.Screen>
        {/* {!phone ? <Stack.Screen name='LOGIN' component={Login} options={{ headerShown: false }}></Stack.Screen> : <Stack.Screen name='WARP_HOME' component={WarpHome} options={{headerShown: false}}></Stack.Screen>} */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}


const Warp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Warp