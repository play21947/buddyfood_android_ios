import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Linking, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'

const RiderGetTask = ({ navigation, route }) => {

    let phone = useSelector((state) => {
        return state.authen.phone
    })

    let [user_data, setUser_data] = useState([])

    let order = route.params.payload
    let lat_owner_bill = route.params.lat_owner_bill
    let lng_owner_bill = route.params.lng_owner_bill
    let lat_market = route.params.lat_market
    let lng_market = route.params.lng_market
    let owner_bill = route.params.owner_bill
    let id = route.params.id

    // console.log(lat)
    // console.log(lng)

    console.log(order)

    let total_money = order.reduce((sum, item) => {
        return sum = sum + (item.food_price * item.quantity)
    }, 0)


    useEffect(() => {
        axios.post('http://play2api.ddns.net:3001/get_user', {
            phone: phone
        }).then((res) => {
            setUser_data(res.data)
        })
    }, [])

    return (
        <View style={{ backgroundColor: '#171717', flex: 1 }}>

            <TouchableOpacity onPress={()=>{
                navigation.navigate("RIDER_ORDERS")
            }}>
                <Image source={require('./vector/left-arrows.png')} style={{ width: 40, height: 40, tintColor: 'white', marginTop: 10 }}></Image>
            </TouchableOpacity>

            <View style={{ marginBottom: 10, paddingLeft: 10 }}>
                {order && order.length > 0 ? <View><Text style={{ fontFamily: 'prompt', fontSize: 22, color: 'white' }}>{order[0].owner}</Text></View> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontFamily: 'prompt', fontSize: 16 }}>BUDDY FOOD</Text>
                    <Text style={{ color: 'white', fontFamily: 'prompt', fontSize: 16, marginLeft: 10, color: '#16a34a' }}>แนะนำ</Text>
                    <Image source={require('./vector/check.png')} style={{ width: 15, height: 15, marginLeft: 5 }}></Image>
                    <Text style={{ color: 'white', fontFamily: 'prompt', fontSize: 16, marginLeft: 10 }}>฿{total_money}</Text>

                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {
                        Linking.openURL("https://www.google.co.th/maps/dir/+" + user_data[0].latitude + "+, " + user_data[0].longitude + "/" + lat_market + ", " + lng_market + "/data=!4m2!4m1!3e0?hl=th")

                    }}><Image source={require('./vector/gps.png')} style={{ width: 15, height: 15, tintColor: 'white' }}></Image></TouchableOpacity>
                </View>
            </View>


            <View style={{ width: '100%', height: '70%' }}>
                <MapView
                    initialRegion={{
                        latitude: 18.514118241365964,
                        longitude: 98.83959330818614,
                        latitudeDelta: 0,
                        longitudeDelta: 0.09,
                    }}

                    mapType='standard'
                    style={{ width: '100%', height: '100%' }}>

                    {user_data && user_data.length > 0 ? <Marker coordinate={{ latitude: user_data[0].latitude, longitude: user_data[0].longitude }}></Marker> : null}

                    <Marker coordinate={{ latitude: lat_owner_bill, longitude: lng_owner_bill }}><Image source={require('./vector/person.png')} style={{ width: 20, height: 20, tintColor: 'green' }}></Image></Marker>

                    <Marker coordinate={{ latitude: lat_market, longitude: lng_market }}><Image source={require('./vector/merchant.png')} style={{ width: 20, height: 20, tintColor: 'green' }}></Image></Marker>

                </MapView>

                <View style={{ marginLeft: 10, marginTop: 20 }}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("RIDER_CONFIRM_ORDER", {payload: order, owner_bill: owner_bill, id: id })
                    }} style={{ backgroundColor: '#15803d', height: 50, alignItems: 'center', justifyContent: 'center', width: '60%', borderRadius: 6 }}><Text style={{ fontFamily: 'prompt', color: 'white', fontSize: 22 }}>ฉันมาถึงร้านอาหารเเล้ว</Text></TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default RiderGetTask