import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text } from "react-native"

const SpecificOrder = ({ route }) => {

    let id = route.params.payload


    let [order, setOrder] = useState([])

    const GetSpecificOrder = () => {
        axios.post("http://play2api.ddns.net:3001/specific_order", {
            id: id
        }).then((res) => {
            // console.log(res.data)
            setOrder(res.data)
        })
    }

    useEffect(() => {
        GetSpecificOrder()
    }, [])

    return (
        <View style={{ padding: 10 }}>
            {order && order.length > 0 ? order.map((item, index) => {
                console.log(item.bill_orders)
                let cvt = JSON.parse(item.bill_orders)

                return (
                    <View key={index}>
                        {!item.pending_market ? <Text style={{ fontFamily: 'prompt', color: 'gold' }}>กำลังรอรายการ</Text> : <Text style={{ fontFamily: 'prompt', color: 'green' }}>รายการเสร็จสมบูรณ์</Text>}
                        <Text style={{ fontFamily: 'prompt', color: 'black' }}>ออเดอร์ #{item.id}</Text>
                        {cvt.map((items, indexs) => {
                            return (
                                <View key={indexs}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'prompt', color: 'black' }}>{items.food_name}</Text>
                                        <Text style={{ fontFamily: 'prompt', color: 'black' }}>฿{items.food_price}</Text>
                                    </View>
                                    <View style={{ borderTopWidth: 1, color: 'black', width: '100%' }}>

                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )
            }) : null}
        </View>
    )
}

export default SpecificOrder