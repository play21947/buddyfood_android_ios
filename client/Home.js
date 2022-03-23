import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, Button, Alert } from 'react-native'
import { useSelector } from 'react-redux'
import Sound from 'react-native-sound'
import io from 'socket.io-client'

let socket = io.connect("http://play2api.ddns.net:3001")


const Home = ({ navigation }) => {

    let phone = useSelector(state => state.authen.phone)

    let sound = new Sound('purchase.mp3')

    let picture = ['banner.jpg', 'banner2.jpg']
    let [select_pic, setSelect_Pic] = useState('')
    let [user, setUser] = useState([])

    let categories = [{ name: 'main_course', logo: './img/vegetable.png' }, { name: 'dessert', logo: './img/dessert.png' }, { name: 'juice', logo: './img/drink.png' }]

    useEffect(() => {
        socket.emit("room_id", phone)

        socket.on("notify", (payload)=>{
            Alert.alert(payload)
            sound.play()
        })
    }, [])

    return (
        <ScrollView>
            <View>

                <View style={{ width: '100%', height: 120 }}>
                    <Image style={{ width: '100%', height: '100%', opacity: 0.8 }} source={require('./img/market.jpg')} />
                </View>
                <TextInput placeholder='Product Search' placeholderTextColor="gray" style={{ width: '90%', height: 50, backgroundColor: 'white', position: 'relative', top: -25, left: 20, borderRadius: 8, elevation: 5, paddingLeft: 20 }}></TextInput>
                <View style={{ padding: 20, paddingTop: 0 }}>
                    {/* <Text style={{ fontFamily: 'prompt' }}>Home</Text> */}
                    <Image style={{ width: '100%', height: 210, borderRadius: 8 }} source={require('./img/banner.jpg')} />

                    <Text style={{ fontFamily: 'prompt', color: '#1a1a1a', marginTop: 20 }}>Product Categories</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>


                        <TouchableOpacity style={{ width: '48%', height: 150, backgroundColor: 'white', marginTop: 15, borderRadius: 8, padding: 20 }} onPress={() => {
                            navigation.navigate('PRODUCTS', { payload: 'main_course' })
                        }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: '80%', height: '100%' }} source={require('./img/hamburger.png')} />
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={{ width: '48%', height: 150, backgroundColor: 'white', marginTop: 15, borderRadius: 8, padding: 20 }} onPress={() => {
                            navigation.navigate('PRODUCTS', { payload: 'dessert' })
                        }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: '80%', height: '100%' }} source={require('./img/dessert.png')} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: '48%', height: 150, backgroundColor: 'white', marginTop: 15, borderRadius: 8, padding: 20 }} onPress={() => {
                            navigation.navigate('PRODUCTS', { payload: 'drink' })
                        }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: '80%', height: '100%' }} source={require('./img/drink.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Home