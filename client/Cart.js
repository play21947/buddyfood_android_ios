import axios from 'axios'
import React from 'react'
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, Button } from "react-native"
import { useSelector, useDispatch } from 'react-redux'
import { ClearCart, Decrement, Increment, RemoveProduct } from './actions/CartActions'
import Sound from 'react-native-sound'
import io from 'socket.io-client'

const Cart = () => {

    let sound = new Sound('purchase.mp3')

    let dispatch = useDispatch()

    let cart_product = useSelector(state => state.cart.cart)
    let user = useSelector(state => state.authen.phone)

    let total = cart_product.reduce((sum, item) => {
        return sum + (item.quantity * item.food_price)
    }, 0)

    let phone = useSelector((state)=>{
        return state.authen.phone
    })

    // console.log(cart_product)


    let ProvideToOrders=()=>{

        // console.log("cart_id : ", cart_product)
        let socket = io.connect("http://play2api.ddns.net:3001")

        axios.post('http://play2api.ddns.net:3001/ProvideToOrders',{
            cart: JSON.stringify(cart_product),
            owner: user,
        }).then((res)=>{
            if(res.data.inserted){
                Alert.alert("สั่งซื้อสำเร็จ")
                socket.emit("send_text", {text: "มีออเดอร์เข้ามา +1", owner_market: cart_product[0].owner_id})
                // socket.emit('play2:send_notify', {text: 'มีออเดอร์เข้ามา +1', owner: cart_product[0].owner}) //นำการสั่งซื้อเอาไปให้ ร้านค้า
                playSound()
                dispatch(ClearCart())
            }else{
                Alert.alert("สั่งซื้อไม่สำเร็จ")
            }
        })
    }

    let playSound=()=>{
        sound.play()
    }

    return (
        <ScrollView style={{ padding: 10 }}>
            <Text style={{ fontFamily: 'prompt-medium', fontSize: 22, color: '#1a1a1a' }}>สินค้าในตะกร้า</Text>
            {cart_product && cart_product.length > 0 ? cart_product.map((item) => {
                return (
                    <View key={item.id} style={{ backgroundColor: 'white', padding: 10, borderRadius: 8, marginTop: 10, elevation: 1, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', borderWidth: 1, padding: 15, borderColor: '#cbd5e1', borderRadius: 5, marginRight: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => {
                                dispatch(Increment(item.id))
                            }}><Text style={{color: '#1a1a1a'}}>+</Text></TouchableOpacity>
                            <Text style={{ fontFamily: 'prompt-medium', color: '#1a1a1a'}}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => {
                                dispatch(Decrement(item.id))
                            }}><Text style={{color: '#1a1a1a'}}>-</Text></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => {
                            dispatch(RemoveProduct(item.id))
                        }} style={{ backgroundColor: 'pink', position: 'absolute', right: 10, top: 10, width: 20, alignItems: 'center', borderRadius: 3 }}>
                            <Text style={{ color: 'black', fontFamily: 'prompt-medium' }}>X</Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', padding: 5, borderWidth: 1, borderRadius: 8, borderColor: '#f1f5f9' }}>
                            <Image style={{ width: 70, height: 80, borderRadius: 8 }} source={{ uri: item.food_img }} />
                        </View>
                        <View style={{ marginLeft: 7 }}>
                            <Text style={{ fontFamily: 'prompt-medium', fontSize: 16, color: '#1a1a1a' }}>{item.food_name}</Text>
                            <Text style={{ fontFamily: 'prompt-medium', fontSize: 13, color: '#0ea5e9' }}>฿{item.food_price}</Text>
                        </View>
                    </View>
                )
            }) : <Text style={{ fontFamily: 'prompt', color: 'black' }}>ไม่มีสินค้าในตะกร้า</Text>}


            {cart_product && cart_product.length > 0 ? <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>ราคาในตะกร้า</Text>
                    <Text style={{ fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>฿{total}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>ค่าส่ง</Text>
                    <Text style={{ fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>฿5</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>รวมทั้งสิ้น</Text>
                    <Text style={{ fontFamily: 'prompt', fontSize: 16, color: '#1a1a1a' }}>฿{total + 5}</Text>
                </View>

                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={()=>{
                        Alert.alert('test', 'test', [{text: 'ยืนยัน', onPress:()=>{
                            console.log("Good")
                            ProvideToOrders()
                            // socket.emit("send_text", {text: "มีออเดอร์ + 1", id_market: 1})
                        }}, {text: 'ยกเลิก', onPress:()=>{
                            console.log("cancel")
                        }}])
                    }} style={{ backgroundColor: '#0ea5e9', width: '90%', alignItems: 'center', justifyContent: 'center', padding: 13, borderRadius: 8, marginTop: 20 }}><Text style={{ fontFamily: 'prompt', fontSize: 16, color: 'white' }}>Checkout(เก็บเงิน)</Text></TouchableOpacity>
                </View>
            </View> : null}
        </ScrollView>
    )
}

export default Cart