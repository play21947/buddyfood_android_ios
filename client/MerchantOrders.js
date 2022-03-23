import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MerchantOrders = ({ navigation }) => {

    let [orders, setOrders] = useState([])


    const GetUser = async (api) => {
        let phone = await AsyncStorage.getItem('phone')
        return new Promise((resolve, reject) => {
            axios.post(api, {
                phone: phone
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const GetOrdersUser = async (api, market) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                market: market
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const GetAPI = async () => {
        let user = await GetUser('http://play2api.ddns.net:3001/get_market_user')
        let here = await GetOrdersUser('http://play2api.ddns.net:3001/get_orders_user', user[0].owner_store)

        setOrders(here)
    }


    const MerchantAccept = (id) => {
        axios.post('http://play2api.ddns.net:3001/merchant_accept', {
            id: id
        }).then((res) => {
            if (res.data.success) {
                Alert.alert("Success")
                navigation.navigate('HOME')
                navigation.navigate('MERCHANT_ORDERS')
            }
        })
    }


    useEffect(() => {
        GetAPI()
    }, [])

    return (
        <View style={{ padding: 10 }}>


            <ScrollView>
                <Text style={{ color: 'black' }}>MerchantOrders</Text>

                <TouchableOpacity onPress={() => {
                    navigation.navigate("HANDLE_STORE")
                }} style={{ position: 'absolute', right: 10, top: 10 }}><Text style={{ fontFamily: 'prompt', color: 'gray', fontSize: 18 }}>จัดการร้านค้า</Text></TouchableOpacity>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {orders && orders.length > 0 ? orders.map((item) => {
                        let cvt_orders = JSON.parse(item.bill_orders)

                        let total = cvt_orders.reduce((sum, product) => sum + (product.food_price * product.quantity), 0)

                        return (
                            <View key={item.id} style={{ width: '48%', backgroundColor: 'white', padding: 10, borderRadius: 8, marginTop: 10, elevation: 5 }}>
                                <Text style={{ color: 'black' }}># {item.id}</Text>
                                {cvt_orders.map((items) => {
                                    return (
                                        <View key={items.id}>
                                            <View key={items.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontFamily: 'prompt', color: 'black' }}>{items.food_name}</Text>
                                                <Text style={{ fontFamily: 'prompt', color: 'black' }}>{items.quantity} ชิ้น</Text>
                                                <Text style={{ fontFamily: 'prompt', color: 'black' }}>฿{items.food_price * items.quantity}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                <View style={{ borderBottomWidth: 1 }}>

                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'prompt', color: 'green' }}>ราคารวมทั้งสิ้น</Text>
                                    <Text style={{ fontFamily: 'prompt', color: 'green' }}>฿{total}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => {
                                        MerchantAccept(item.id)
                                    }} style={{ width: '100%', height: 30, backgroundColor: 'green', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}><Text style={{ color: 'white', fontFamily: 'prompt' }}>ยืนยันออเดอร์</Text></TouchableOpacity>
                                </View>
                            </View>
                        )
                    }) : null}
                </View>
            </ScrollView>
        </View>
    )
}

export default MerchantOrders