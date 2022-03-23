import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import MapView, { Callout, Marker, Polygon, UrlTile } from 'react-native-maps'

const GoogleMap = () => {

    let [user_data, setUser_data] = useState([])

    let [on_my_mark, setOn_my_mark] = useState(null)

    let area = [
        {
            latitude: 18.53165735892443,
            longitude: 98.83720658129565
        },
        {
            latitude: 18.528608827092274,
            longitude: 98.81219932019425
        },
        {
            latitude: 18.492431592330984,
            longitude: 98.79575319069131
        },
        {
            latitude: 18.48293431009144,
            longitude: 98.81335371256942
        },
        {
            latitude: 18.52097782786359,
            longitude: 98.86639804831331
        }
    ]

    const GetPosMySelf = () => {
        AsyncStorage.getItem('phone').then((phone) => {
            axios.post('http://play2api.ddns.net:3001/get_user', {
                phone: phone
            }).then((res) => {
                setUser_data(res.data)
                console.log(res.data)
            })
        })
    }


    const UpdatePosMyself=()=>{
        AsyncStorage.getItem('phone').then((phone)=>{
            axios.post('http://play2api.ddns.net:3001/update_pos_myself',{
                phone: phone,
                new_lat: on_my_mark.latitude,
                new_lng: on_my_mark.longitude
            }).then((res)=>{
                if(res.data.update_pos){
                    Alert.alert("อัพเดทตำแหน่งใหม่เรียบร้อยแล้ว")
                }
            })
        })
    }


    useEffect(() => {
        GetPosMySelf()
    }, [])

    return (
        <View style={{ alignItems: 'center' }}>
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

                {user_data && user_data.length > 0 ? <Marker onDragEnd={(e) => {
                    setOn_my_mark(e.nativeEvent.coordinate)
                    console.log(e.nativeEvent.coordinate)
                }} draggable coordinate={{ latitude: user_data[0].latitude, longitude: user_data[0].longitude }} title="ฉัน" description='ลากฉันสิ!'></Marker> : null}

                <Polygon strokeColor='#1a1a1a' fillColor={'rgba(11, 156, 49, 0.5)'} coordinates={area} />

            </MapView>

            {on_my_mark && on_my_mark !== null ?
                <View style={{ position: 'absolute', width: '95%', height: '30%', backgroundColor: 'white', bottom: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 10, elevation: 5 }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{ fontFamily: 'prompt', color: '#1a1a1a', fontSize: 18 }}>เลือกตำเเหน่งที่อยู่</Text>
                        <TouchableOpacity onPress={()=>{
                            setOn_my_mark(null)
                        }} style={{ marginRight: 10}}><Image source={require('./vector/close.png')} style={{width: 15, height: 15}}/></TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ตำแหน่งเก่า : {user_data[0].latitude}, {user_data[0].longitude}</Text>
                    <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ตำเเหน่งใหม่ : {on_my_mark.latitude}, {on_my_mark.longitude}</Text>
                    <TouchableOpacity onPress={()=>{
                        UpdatePosMyself()
                    }} style={{ width: '100%', height: 40, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', borderRadius: 4, marginTop: 20 }}><Text style={{ color: 'white', fontFamily: 'prompt', fontSize: 16 }}>อัพเดทตำเเหน่ง</Text></TouchableOpacity>
                </View> : null}

        </View>
    )
}


export default GoogleMap