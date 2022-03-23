import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'

const Rider = ({navigation}) => {

    let phone = useSelector((state) => {
        return state.authen.phone
    })

    let [allOrders, setAllOrders] = useState([])

    let [user_data, setUser_data] = useState([])


    const GetUserdata = () => {
        return new Promise((resolve, reject) => {
            axios.post('http://play2api.ddns.net:3001/get_user', {
                phone: phone
            }).then((res) => {
                resolve(setUser_data(res.data))
            })
        })
    }

    const GetAllOrders = () => {
        return new Promise((resolve, reject) => {
            axios.get('http://play2api.ddns.net:3001/rider_orders').then((res) => {
                resolve(setAllOrders(res.data))
                // console.log(res.data)
            })
        })
    }

    const GetAllApi = async () => {
        await GetUserdata()
        await GetAllOrders()
    }

    useEffect(() => {
        GetAllApi()
    }, [])

    return (
        <View style={{ alignItems: 'center' }}>

            <View style={{ width: '30%', height: 45, position: 'absolute', left: 20, backgroundColor: 'white', top: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 25, flexDirection: 'row', elevation: 5 }}>
                <Image source={require('./vector/income.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'prompt', fontSize: 18, color: '#1a1a1a', marginLeft: 10 }}>รายได้</Text>
            </View>

            <MapView style={{ width: '100%', height: '100%', zIndex: -1 }}
                initialRegion={{
                    latitude: 18.514118241365964,
                    longitude: 98.83959330818614,
                    latitudeDelta: 0,
                    longitudeDelta: 0.09,
                }}

                mapType='standard'
            >


                {/* <Marker draggable coordinate={{latitude: user_data[0], longitude: 98.82764656975222}}></Marker> */}

                {user_data && user_data.length > 0 ? <Marker coordinate={{ latitude: user_data[0].latitude, longitude: user_data[0].longitude }} title="ฉัน" description='ลากฉันสิ!'></Marker> : null}

                {/* <Polygon strokeColor='#1a1a1a' fillColor={'rgba(11, 156, 49, 0.5)'} coordinates={area} /> */}

            </MapView>

            {/* {allOrders && allOrders.length > 0 ? allOrders.map((item) => {
                let cvt_item = JSON.parse(item.bill_orders)
                console.log(cvt_item)
                return(
                    <View style={{}}>
                        {cvt_item.map((items)=>{
                            console.log(items)
                            return(
                                <View>
                                    <Text>{items.food_name}</Text>
                                </View>
                            )
                        })}
                    </View>
                )
            }) : null} */}


            <View style={{ backgroundColor: 'white', width: '90%', height: 100, position: 'absolute', bottom: 25, borderRadius: 8, elevation: 5, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={{alignItems: 'center'}}>
                        <View style={{ backgroundColor: '#d1d5db', width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('./vector/destination.png')} style={{ width: 30, height: 30 }}></Image>
                        </View>
                        <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ปลายทางของฉัน</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('RIDER_ORDERS')
                    }} style={{alignItems: 'center'}}>
                        <View style={{ backgroundColor: '#d1d5db', width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('./vector/electric.png')} style={{ width: 30, height: 30 }}></Image>
                        </View>
                        <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>รับงาน</Text>
                    </TouchableOpacity>
                </View>
            </View>



        </View>
    )
}

export default Rider