import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Button, Alert, Platform, PermissionsAndroid, Image } from "react-native"
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Logout } from './actions/AuthenticationActions'
import axios from 'axios'
import Geolocation from '@react-native-community/geolocation'
import { request } from 'react-native-permissions'

const Account = ({ navigation }) => {

    let dispatch = useDispatch()

    let phone = useSelector(state => state.authen.phone)

    let role = useSelector(state => state.authen.role)

    let [user_data, setUser_data] = useState([])

    // console.log("Check Role : ", typeof(role))

    useEffect(() => {
        axios.post('http://play2api.ddns.net:3001/get_user', {
            phone: phone
        }).then((res) => {
            setUser_data(res.data)
        })
    }, [])


    const AskPermissionAndGetLocation = async () => {
        request('android.permission.ACCESS_FINE_LOCATION').then((res) => {
            if (res === 'granted') {
                // Geolocation.requestAuthorization()
                Geolocation.getCurrentPosition((pos) => {
                    console.log(pos.coords.latitude)
                    console.log(pos.coords.longitude)
                    axios.post('http://play2api.ddns.net:3001/get_location', {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        phone: phone
                    }).then((res2) => {
                        if (res2.data.location_success) {
                            Alert.alert("บันทึกตำเเหน่งเรียบร้อยเเล้ว")
                        } else {
                            Alert.alert("Something went wrong")
                        }
                    })
                }, (err) => {
                    if (err.message == "No location provider available.") {
                        Alert.alert("เปิด GPS เพื่อค้นหาตำเเหน่ง")
                    }
                }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
            }
        })

    }

    // const getGeolocation = () => {
    //     Geolocation.getCurrentPosition((pos) => {
    //         Alert.alert(pos)
    //     })
    // }

    return (
        <View>

            {user_data && user_data.length > 0 ? <View style={{ width: '100%', height: 165, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
                <Text style={{ fontFamily: 'prompt', color: 'white' }}>เบอร์โทร : {user_data[0].phone}</Text>
                {user_data[0].owner_store ? <Text style={{ fontFamily: 'prompt', color: 'white', fontSize: 18 }}>เจ้าของร้าน : {user_data[0].owner_store}</Text> : <Text style={{ fontFamily: 'prompt', color: 'white', fontSize: 18 }}>ยังไม่มีร้านค้า</Text>}
            </View> : null}

            {/* Profile Box */}

            <View style={{ width: 300, height: 70, backgroundColor: 'white', position: 'relative', top: -40, left: '14%', justifyContent: 'center', alignItems: 'center', borderRadius: 18, elevation: 5 }}>
                <Text style={{ color: 'black', fontFamily: 'prompt', fontSize: 26 }}>PROFILE</Text>

                <TouchableOpacity style={{ position: 'absolute', top: 22, right: 20 }} onPress={() => {
                    AskPermissionAndGetLocation()
                }}><Image style={{ width: 25, height: 25 }} source={require('./vector/location.png')}></Image></TouchableOpacity>
            </View>

            {/* Profile Box */}

            <View style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}>

                {role == 0 ? <View style={{ borderBottomWidth: 1, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('MerchantSignUp', { payload: phone })
                    }}>
                        <Text style={{ fontFamily: 'prompt', fontSize: 18, color: 'gray' }}>สมัครเป็นร้านค้า</Text>
                    </TouchableOpacity>
                </View> : null}


                {role == 0 ?
                    <View style={{ borderBottomWidth: 1, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("RIDER_SIGN_UP")
                        }}>
                            <Text style={{ fontFamily: 'prompt', fontSize: 18 }}>สมัครเป็นไรเดอร์</Text>
                        </TouchableOpacity>
                    </View> : null}



                <View style={{ borderBottomWidth: 1, marginTop: 10 }}>
                    <TouchableOpacity>
                        <Text style={{ fontFamily: 'prompt', fontSize: 18, color: 'gray' }}>อื่นๆ</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("MAP")
                    }} style={{ padding: 5 }}>
                        <Text style={{ fontFamily: 'prompt', fontSize: 18, color: 'gray' }}>Map</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => {
                        AsyncStorage.removeItem('phone')
                        AsyncStorage.removeItem('role')
                        dispatch(Logout())
                    }} style={{ padding: 5 }}>
                        <Text style={{ fontFamily: 'prompt', fontSize: 18, color: 'gray' }}>ออกจากระบบ</Text>
                    </TouchableOpacity>
                </View>

                {/* <Button title='Chat' onPress={()=>{
                    navigation.navigate("CHAT", {sender_id: 1})
                }}></Button> */}
            </View>
        </View>
    )
}


export default Account