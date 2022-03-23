import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateRole } from './actions/AuthenticationActions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MerchantSignUp = ({navigation, route}) => {

    let phone = route.params.payload
    let [name_store, setName_store] = useState('')

    let role = useSelector(state => state.authen.role)

    let dispatch = useDispatch()

    const CreateMerchant=()=>{

        if(name_store){
            if(name_store.length > 5){
                axios.post('http://play2api.ddns.net:3001/merchant_create',{
                    phone: phone,
                    name_store: name_store
                }).then((res)=>{
                    if(res.data.create_success){
                        AsyncStorage.setItem('role', String(1)) // If Create Success SET Cookie Role = 1 and if this through to redux and go to the reducers That is gonna set role from cookie
                        dispatch(UpdateRole()) // Update State temp only they don't refresh page show role 1 to them
                        Alert.alert("สร้างร้านค้าสำเร็จ")
                        navigation.navigate('ACCOUNT')
                    }else{
                        Alert.alert("บางอย่างผิดพลาดโปรดลองใหม่ (Something went wrong pls do it again)")
                    }
                })
            }else{
                Alert.alert("ใส่ชื่อร้านมากกว่า 5 ตัวอักษรขึ้นไป")
            }
        }else{
            Alert.alert("โปรดใส่ชื่อร้าน!")
        }

    }

    return (
        <View style={{ justifyContent: 'center', flex: 1, padding: 20 }}>

            <View style={{ position: 'absolute', top: 10, left: 10 }}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('ACCOUNT')
                }}>
                    <Image style={{ width: 30, height: 30 }} source={require('./vector/left-arrow.png')} />
                </TouchableOpacity>
            </View>

            <Text style={{ color: '#1a1a1a', fontFamily: 'prompt', fontSize: 22 }}>ยินดีต้อนรับสู่การเป็นร้านค้า</Text>
            <Text style={{ color: '#1a1a1a', fontFamily: 'prompt', fontSize: 16 }}>ชื่อร้านค้า</Text>
            <TextInput onChangeText={(text)=>{
                setName_store(text)
            }} placeholder='ส้มตำอุดร' style={{ backgroundColor: 'white', width: '100%', borderRadius: 8, elevation: 5, fontFamily: 'prompt' }}></TextInput>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                    CreateMerchant()
                }} style={{ elevation: 5, backgroundColor: 'green', padding: 10, alignItems: 'center', borderRadius: 8, width: 200 }}><Text style={{ color: 'white', fontFamily: 'prompt', fontSize: 18 }}>สร้างร้านค้า</Text></TouchableOpacity>
            </View>
        </View>
    )
}


export default MerchantSignUp