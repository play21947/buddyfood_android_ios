import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { LoginAction } from './actions/AuthenticationActions'


const RiderSignUp = ({navigation}) => {

    let dispatch = useDispatch()

    let [radio, setRadio] = useState(false)

    let [rider_name, setRider_name] = useState('')
    let [rider_lastname, setRider_lastname] = useState('')
    let [rider_age, setRider_age] = useState('')

    let phone = useSelector((state)=>{
        return state.authen.phone
    })

    const RegisterRider=()=>{

        axios.post('http://play2api.ddns.net:3001/register_rider',{
            rider_name: rider_name,
            rider_lastname: rider_lastname,
            rider_age: rider_age,
            phone: phone
        }).then((res)=>{
            if(res.data.register_success){
                dispatch(LoginAction(phone, '123456', 2))
                AsyncStorage.setItem('role', String(2))
                Alert.alert("สมัครเป็นไรเดอร์เสร็จสิ้น")
                navigation.navigate("ACCOUNT")
            }
        })
    }

    return (
        <View style={{ padding: 10 }}>
            <View style={{ borderBottomWidth: 1 }}>
                <Text style={{ fontFamily: 'prompt', fontSize: 22, color: '#1a1a1a' }}>สมัครเป็นไรเดอร์</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ width: '45%' }}>
                    <Text style={{ fontFamily: 'prompt', fontSize: 18, color: '#1a1a1a' }}>ชื่อ</Text>
                    <TextInput onChangeText={(text)=>{
                        setRider_name(text)
                    }} style={{ borderWidth: 1, borderRadius: 8, fontFamily: 'prompt' }}></TextInput>
                </View>
                <View style={{ width: '45%' }}>
                    <Text style={{ fontFamily: 'prompt', fontSize: 18, color: '#1a1a1a' }}>นามสกุล</Text>
                    <TextInput onChangeText={(text)=>{
                        setRider_lastname(text)
                    }} style={{ borderWidth: 1, borderRadius: 8, fontFamily: 'prompt' }}></TextInput>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <Text style={{ fontFamily: 'prompt', fontSize: 18, color: '#1a1a1a' }}>อายุ</Text>
                <TextInput onChangeText={(text)=>{
                    setRider_age(text)
                }} style={{ borderWidth: 1, borderRadius: 8, fontFamily: 'prompt' }}></TextInput>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>

                {radio == false ? <TouchableOpacity onPress={() => {
                    setRadio(!radio)
                }}>
                    <View style={{ borderWidth: 1, width: 15, height: 15, borderRadius: 8 }}>

                    </View>
                </TouchableOpacity> : <TouchableOpacity onPress={() => {
                    setRadio(!radio)
                }}><View style={{ borderWidth: 1, width: 15, height: 15, borderRadius: 8, backgroundColor: '#1a1a1a' }} /></TouchableOpacity>}
                <Text style={{ marginLeft: 10, fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>ข้าพเจ้ายอมรับและตกลงข้อเสนอ</Text>
            </View>

            <TouchableOpacity onPress={()=>{
                RegisterRider()
            }} style={{ width: '100%', height: 50, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginTop: 10 }}><Text style={{ fontFamily: 'prompt', fontSize: 18, color: 'white' }}>ยืนยัน</Text></TouchableOpacity>
        </View>
    )
}

export default RiderSignUp