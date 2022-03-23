import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Animated, TextInput, ScrollView } from "react-native"
import { useDispatch } from 'react-redux'
import { AddToCart } from './actions/CartActions'

const Products = ({ route }) => {


    let dispatch = useDispatch()

    let type = route.params.payload

    console.log("Type : ", type)

    let [foods, setFoods] = useState([])
    let [select, setSelect] = useState([])

    let [search, setSearch] = useState('')

    let searchProduct = []

    if (foods && foods.length > 0) {
        searchProduct = foods.filter((item) => {
            return item.food_name.includes(search)
        })
    }

    useEffect(() => {
        axios.post("http://play2api.ddns.net:3001/getTypeFoods", {
            type: type
        }).then((res) => {
            console.log(res.data)
            setFoods(res.data)
        })
    }, [])


    let SelectProduct = (product_id) => {
        axios.post('http://play2api.ddns.net:3001/SelectProduct', {
            id: product_id
        }).then((res) => {
            if (res.data) {
                setSelect(res.data)
            }
        })
    }

    let Buy = (product) => {
        let resultProduct = {
            id: product[0].id,
            food_name: product[0].food_name,
            food_price: product[0].food_price,
            food_type: product[0].food_type,
            food_img: product[0].food_img,
            owner: product[0].owner,
            owner_id: product[0].owner_id,
            quantity: 1
        }

        dispatch(AddToCart(resultProduct))
    }

    return (
        <View style={{ flex: 1 }}>

            {select && select.length > 0 ?
                <View style={{ alignItems: 'center', width: '100%', height: 550, position: 'absolute', bottom: 0, zIndex: 1 }}>
                    <View style={{ width: '95%', height: 550, backgroundColor: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12, position: 'absolute', bottom: 0, elevation: 5 }}>
                        <TouchableOpacity onPress={() => {
                            setSelect('')
                        }} style={{ position: 'absolute', left: 10, top: 10 }}><Image style={{ width: 35, height: 35, zIndex: 1, opacity: 0.5 }} source={require('./img/back.png')} /></TouchableOpacity>
                        <Image style={{ width: '100%', height: '45%', borderTopLeftRadius: 12, borderTopRightRadius: 12, zIndex: -1 }} source={{ uri: select[0].food_img }} />
                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'prompt-medium', color: '#1a1a1a', fontSize: 22 }}>{select[0].food_name}</Text>
                                <Text style={{ fontFamily: 'prompt-medium', color: '#1a1a1a', fontSize: 22 }}>฿{select[0].food_price}</Text>
                            </View>
                            <Text style={{ fontFamily: 'prompt' }}>Description</Text>
                            <View style={{ width: 70, marginTop: 20 }}>
                                <Text style={{ borderRadius: 12, backgroundColor: '#9ca3af', textAlign: 'center', color: 'black', fontFamily: 'prompt' }}>{select[0].owner}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => {
                        Buy(select)
                        setSelect('')
                    }} style={{ width: 270, height: 50, backgroundColor: '#6366f1', position: 'absolute', bottom: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontFamily: 'prompt', color: 'white', fontSize: 18 }}>สั่งซื้อ ฿{select[0].food_price} THB</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                : null}

                

            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, flexWrap: 'wrap', flex: 1 }}>

                    <TextInput onChangeText={(text) => {
                        setSearch(text)
                    }} placeholder='ทานอะไรดี...' placeholderTextColor="gray" style={{ width: '100%', height: 50, backgroundColor: 'white', elevation: 3, borderRadius: 8, fontFamily: 'prompt' }}></TextInput>


                    {searchProduct && searchProduct.length > 0 ? searchProduct.map((item) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                if (!select || select.length <= 0) {
                                    SelectProduct(item.id)
                                } else {
                                    if (item.id != select[0].id) {
                                        SelectProduct(item.id)
                                    }
                                }
                            }} style={{ width: '48%', height: 180, backgroundColor: 'white', borderRadius: 8, padding: 10, elevation: 5, marginTop: 15 }} key={item.id}>
                                <View>
                                    <Image style={{ width: '100%', height: '80%', borderRadius: 8 }} source={{ uri: item.food_img }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'prompt', marginTop: 10, color: 'black' }}>{item.food_name}</Text>
                                        <Text style={{ fontFamily: 'prompt', marginTop: 10, color: 'green' }}>฿{item.food_price}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }) : <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}><Text style={{ fontFamily: 'prompt', color: 'black', fontSize: 20 }}>ไม่มีสินค้าชิ้นนี้</Text></View>}
                </View>
            </ScrollView>
        </View>
    )
}


export default Products