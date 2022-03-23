import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import setting from './configs'
import { useDispatch, useSelector } from 'react-redux'
import { Loaded, LoginAction } from './actions/AuthenticationActions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = ({ navigation }) => {


    let dispatch = useDispatch()

    let user = useSelector(state => state.authen.phone)


    let [phone, setPhone] = useState('')
    let [password, setPassword] = useState('')



    return (
        <View style={{ padding: 20, justifyContent: 'center', flex: 1 }}>


            <Text style={{ fontFamily: 'prompt', fontSize: 21, color: '#1a1a1a' }}>ยินดีต้อนรับ</Text>
            <Text style={{ fontFamily: 'prompt', fontSize: 16, marginBottom: 10, color: '#1a1a1a' }}>เข้าสู่ระบบ เพื่อทำการใช้งาน</Text>
            <TextInput style={{ width: '100%', height: 40, marginBottom: 20, borderWidth: 1, borderRadius: 8 }} onChangeText={(text) => {
                setPhone(text)
            }}></TextInput>
            <TextInput style={{ width: '100%', height: 40, marginBottom: 20, borderWidth: 1, borderRadius: 8 }} onChangeText={(text) => {
                setPassword(text)
            }}></TextInput>

            <TouchableOpacity onPress={() => {
                if (phone && password) {
                    axios.post('http://play2api.ddns.net:3001/login', {
                        phone: phone,
                        password: password
                    }).then((res) => {
                        if (res.data.success) {
                            Alert.alert("Logged")
                            setPhone('')
                            setPassword('')
                            AsyncStorage.setItem('phone', phone)
                            AsyncStorage.setItem('role', String(res.data.user_data[0].role))
                            console.log("Login Role : ", res.data.user_data[0].role)
                            dispatch(LoginAction(phone, password, res.data.user_data[0].role))
                        } else {
                            Alert.alert("Fail")
                        }
                    })
                } else {
                    Alert.alert("Put In fill")
                }
            }} style={{ width: '100%', backgroundColor: 'green', alignItems: 'center', height: 40, justifyContent: 'center', borderRadius: 8 }}><Text style={{ color: 'white', fontSize: 18, fontFamily: 'prompt' }}>เข้าสู่ระบบ</Text></TouchableOpacity>

            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                <View>
                    <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>Don't have an account?</Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('SIGN_UP')
                    }}><Text style={{ fontFamily: 'prompt', color: 'darkblue' }}>Sign Up</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Login