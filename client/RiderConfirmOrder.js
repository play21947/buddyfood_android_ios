import React, { useEffect, useState } from 'react'
import { View, Text, Animated, Button, TouchableOpacity } from 'react-native'

const RiderConfirmOrder = ({ navigation, route }) => {


    let box = useState(new Animated.Value(0))[0]


    let [time, setTime] = useState(3)

    let order = route.params.payload
    let owner_bill = route.params.owner_bill
    let id = route.params.id


    let total = order.reduce((sum, item) => {
        return sum = sum + (item.food_price * item.quantity)
    }, 0)


    const FadeIn = () => {
        Animated.spring(box, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
        }).start()
    }


    const CloseAll=()=>{
        Animated.spring(box, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (time <= 0) {
                FadeIn()
            }
            setTime(time - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    return (
        <View style={{ padding: 10, flex: 1, backgroundColor: time <= 0 ? 'rgba(52, 52, 52, 0.8)' : null }}>

            {time > 0 ? <Text>{time}</Text> : null}

            <Animated.View style={[{ backgroundColor: 'white', width: '100%', height: '43%', position: 'absolute', zIndex: 1, opacity: time > 0 ? 0 : box, alignSelf: 'center', bottom: '25%', elevation: 5, padding: 10, borderRadius: 8, justifyContent: 'center' }]}>
                <Text style={{fontFamily: 'prompt', fontSize: 22, color: '#1a1a1a'}}>ได้รับอาหารแล้วใช่ไหม?</Text>
                <Text style={{fontFamily: 'prompt', fontSize: 16, color: 'gray'}}>หลังจากยืนยัน เราจะพาคุณไปยังสถานที่จัดส่งให้ลูกค้า</Text>
                <TouchableOpacity onPress={()=>{
                    CloseAll()
                    setTime(3)
                }} style={{padding: 20, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, marginTop: 30, borderColor: 'gray'}}><Text style={{fontFamily: 'prompt-medium', fontSize: 20, color: '#0ea5e9'}}>ใช่ได้รับเเล้ว</Text></TouchableOpacity>
                <TouchableOpacity style={{padding: 20, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, marginTop: 10, borderColor: 'gray'}}><Text style={{fontFamily: 'prompt-medium', fontSize: 20, color: '#0ea5e9'}}>ไม่ กำลังรออยู่</Text></TouchableOpacity>
            </Animated.View>

            <Text style={{ fontFamily: 'prompt', color: 'gray', fontSize: 16, marginBottom: 10 }}>ตรวจสอบว่ารายการอาหารถูกต้องหรือไม่</Text>

            <View style={{ marginBottom: 10 }}>

                <Text style={{ fontFamily: 'prompt' }}>ลูกค้า</Text>
                <Text style={{ fontFamily: 'prompt-medium', fontSize: 18, color: '#1a1a1a' }}>{owner_bill}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontFamily: 'prompt' }}>รหัสการจอง</Text>
                <Text style={{ fontFamily: 'prompt-medium', color: 'green', fontSize: 18 }}>BDF-{id}</Text>
            </View>

            <Text style={{ fontFamily: 'prompt' }}>คำสั่งซื้อของลูกค้า</Text>

            <View style={{ marginBottom: 10 }}>
                {order && order.length > 0 ? order.map((item) => {
                    return (
                        <View key={item.id}>
                            <Text style={{ fontFamily: 'prompt-medium', color: '#1a1a1a', fontSize: 18 }}>{item.food_name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'prompt-medium', color: '#1a1a1a', fontSize: 16 }}>x {item.quantity}</Text>
                                <Text style={{ fontFamily: 'prompt-medium', color: '#1a1a1a', fontSize: 16 }}>{item.quantity * item.food_price}</Text>
                            </View>
                        </View>
                    )
                }) : null}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'gray', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ fontFamily: 'prompt-medium', fontSize: 22, color: "#1a1a1a" }}>ทั้งหมด</Text>
                <Text style={{ fontFamily: 'prompt-medium', color: 'green', fontSize: 22, color: 'green' }}>THB {total}</Text>
            </View>
        </View>
    )
}

export default RiderConfirmOrder