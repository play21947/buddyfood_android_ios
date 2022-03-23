import React, { useEffect } from 'react'
import { View, Text, Image } from "react-native"
import { useDispatch } from 'react-redux'
import { Check, Loaded } from './actions/AuthenticationActions'
import { LoginAction } from './actions/AuthenticationActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'

const LoadingScreen = () => {

    let dispatch = useDispatch()

    let login = async () => {
        const user = await AsyncStorage.getItem('phone')
        const role = await AsyncStorage.getItem('role')

        if (user && role) {
            console.log("role Asnyc: ", role)
            dispatch(LoginAction(user, '123456', role)) // Load หน้า Screen เเละ login
        } else {
            dispatch(Loaded()) // Load หน้า Screen อย่างเดียวไม่ login
        }
    }

    useEffect(() => {
        setTimeout(() => {
            login() // phone : 01
        }, 2000)
    }, [])

    return (
        <View style={{flex: 1}}>
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <LottieView source={require('./assets/rider.json')} autoPlay loop={false} />
                <Text style={{fontFamily: 'prompt', fontSize: 21, color: '#1a1a1a', position: 'absolute', bottom: 50}}>BuddyFood Delivery</Text>
            </View>
        </View>
    )
}

export default LoadingScreen