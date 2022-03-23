import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { useDispatch } from 'react-redux'
import { LoginAction } from './actions/AuthenticationActions'

const SignUp = ({ navigation }) => {

    let [phone_number, setPhone_number] = useState('')
    let [password, setPassword] = useState('')

    let dispatch = useDispatch()


    const Register = () => {
        axios.post('http://play2api.ddns.net:3001/sign_up', {
            phone: phone_number,
            password: password
        }).then((res) => {
            if (res.data.sign_up_success) {
                AsyncStorage.setItem('phone', phone_number)
                AsyncStorage.setItem('role', String(0))
                dispatch(LoginAction(phone_number, password, 0)) // for Push to Home Page
                navigation.navigate('WARP_HOME')
            }else{
                Alert.alert("มีบัญชีนี้เเล้ว")
            }
        })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontFamily: 'prompt', color: '#1a1a1a', fontSize: 22 }}>สมัครสมาชิก</Text>
            <Text style={{ fontFamily: 'prompt', color: '#1a1a1a', fontSize: 16 }}>มาเป็นครอบครัวเดียวกันเถอะ!</Text>
            <TextInput onChangeText={(text) => {
                setPhone_number(text)
            }} placeholder='เบอร์โทรศัพท์' style={{ width: '100%', borderWidth: 1, borderRadius: 8, marginTop: 10, fontFamily: 'prompt' }}></TextInput>
            <TextInput onChangeText={(text) => {
                setPassword(text)
            }} placeholder='รหัสผ่าน' style={{ width: '100%', borderWidth: 1, borderRadius: 8, marginTop: 10, fontFamily: 'prompt' }}></TextInput>
            <TouchableOpacity onPress={() => {
                Register()
            }} style={{ width: '100%', backgroundColor: 'green', height: 45, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}><Text style={{ color: 'white', fontFamily: 'prompt', fontSize: 18 }}>สมัครสมาชิก</Text></TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <View>
                    <Text style={{fontFamily: 'prompt', color: '#1a1a1a'}}>Have an account?</Text>
                </View>
                <View style={{marginLeft: 10}}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('LOGIN')
                    }}><Text style={{fontFamily: 'prompt', color: 'darkblue'}}>Sign In</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


export default SignUp