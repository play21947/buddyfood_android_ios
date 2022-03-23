import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Button, ScrollView } from 'react-native'
import axios from 'axios'

const RiderOrders = ({navigation}) => {

    let [allOrders, setAllOrders] = useState([])

    let Today = new Date().getDate()
    let This_Month = new Date().getMonth()
    let This_Year = new Date().getFullYear()

    let start = Today - 2
    let end = Today + 2
    let week = []

    let TotalDayOfThisMonth = new Date(This_Year, This_Month + 1, 0).getDate() // Count All day of this month


    const GetAllOrders = () => {
        return new Promise((resolve, reject) => {
            axios.get('http://play2api.ddns.net:3001/rider_orders').then((res) => {
                resolve(setAllOrders(res.data))
                // console.log(res.data)
            })
        })
    }

    for (let i = start; i <= end; i++) {
        week.push(i)
    }

    useEffect(() => {
        GetAllOrders()
    }, [])


    return (
        <View>
            <ScrollView>
                {/* <Text>Rider Orders</Text> */}


                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                    {week && week.length > 0 ? week.map((item, index) => {
                        let GetDay = new Date(This_Year, This_Month, item).toDateString()
                        // console.log(GetDay)
                        return (
                            <View key={index}>
                                {GetDay ? <View><Text style={{fontFamily: 'prompt', color: '#1a1a1a'}}>{GetDay.split(' ')[0]}</Text></View> : null}
                                {item == Today ? <View style={{ backgroundColor: 'green', alignItems: 'center', borderRadius: 50, padding: 5 }}><Text style={{ color: 'white', fontFamily: 'prompt' }}>{item}</Text></View> : <View style={{ padding: 5 }}><Text style={{fontFamily: 'prompt', color: '#1a1a1a'}}>{item}</Text></View>}
                            </View>
                        )
                    }) : null}
                </View>

                <View style={{paddingLeft: 20, paddingRight: 20, marginTop: 20}}>
                    <Text style={{fontFamily: 'prompt', color: '#1a1a1a', fontSize: 22}}>รายได้ : 660 บาท</Text>
                </View>



                <View>
                    {allOrders && allOrders.length > 0 ? allOrders.map((item) => {
                        let cvt_item = JSON.parse(item.bill_orders)
                        console.log(item)
                        return (
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate("RIDER_GET_TASK", {payload: cvt_item, lat_owner_bill: item.lat_owner_bill, lng_owner_bill: item.lng_owner_bill, lat_market: item.lat_market, lng_market: item.lng_market, owner_bill: item.owner_bill, id: item.id})
                            }} key={item.id} style={{ padding: 20, marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'prompt', color: "#1a1a1a", fontSize: 22 }}>{item.market}</Text>
                                    <Image style={{ width: 20, height: 20 }} source={require('./vector/next.png')}></Image>
                                </View>
                                <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ผู้สั่งซื้อ : {item.owner_bill}</Text>
                                <View style={{ backgroundColor: '#d1d5db', width: 60, alignItems: 'center', borderRadius: 8, height: 22, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>เงินสด</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }) : null}
                </View>
            </ScrollView>
        </View>
    )
}


export default RiderOrders