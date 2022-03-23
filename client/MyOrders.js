import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Logout } from './actions/AuthenticationActions'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

const MyOrders = ({ navigation }) => {

    let dispatch = useDispatch()
    let [orders, setOrders] = useState([])


    let phone = useSelector(state => state.authen.phone)

    useEffect(() => {
        axios.post("http://play2api.ddns.net:3001/get_order", {
            phone: phone,
        }).then((res) => {
            setOrders(res.data)
        })
    }, [])

    return (
        <ScrollView>
            <View>
                {orders && orders.length > 0 ? orders.map((item, index) => {
                    let cvt_orders = JSON.parse(item.bill_orders)

                    let total = cvt_orders.reduce((sum, item) => sum + (item.quantity * item.food_price), 0)
                    // console.log(cvt_orders)
                    return (
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('SPECIFIC_ORDER', { payload: item.id })
                        }} key={index}>
                            <View style={{ backgroundColor: 'white', marginTop: 10, width: '100%', flexDirection: 'row', padding: 20 }}>
                                <Image style={{ width: 80, height: 80, borderWidth: 1, borderColor: 'gray', padding: 10 }} source={require('./img/food-package.png')}></Image>
                                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                    <Text style={{ fontFamily: 'prompt', color: 'black' }}># {item.id}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', width: '70%' }}>
                                        <Text style={{ fontFamily: 'prompt', color: 'black' }}>ผู้สั่งซื้อ : {item.owner_bill}</Text>
                                        <Text style={{ fontFamily: 'prompt', color: 'black' }}>฿{total}</Text>
                                    </View>
                                    <Text style={{color: 'black', fontFamily: 'prompt'}}>ร้านค้าที่สั่งซื้อ : {item.market}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }) : <View>
                        <Text style={{fontFamily: 'prompt', color: 'black', fontSize: 20}}>ยังไม่มีรายการสั่งซื้อ</Text>
                    </View>}
            </View>
        </ScrollView>
    )
}

export default MyOrders