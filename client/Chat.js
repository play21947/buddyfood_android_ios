import React, { useEffect, useState } from 'react'
import {View, Text, TextInput, Button, Alert} from 'react-native'
// import io from 'socket.io-client'

// let socket = io.connect("http://play2api.ddns.net:3001")

const Chat=({navigation, route})=>{

    let [text, setText] = useState('')

    let [msg, setMsg] = useState('')


    useEffect(()=>{
        socket.on("notify", (payload)=>{
            console.log(payload)
            Alert.alert("You got a new messages")
            setMsg(payload)
        })
    }, [])

    return(
        <View>
            <Text>{msg}</Text>


            <Button title='Check Room' onPress={()=>{
                socket.emit("check_room")
            }}></Button>

            <Button title='JOIN ROOM' onPress={()=>{
                socket.emit("id_room", 1)
            }}></Button>

            <Button title='JOIN ROOM2' onPress={()=>{
                socket.emit("id_room", 2)
            }}></Button>

            <TextInput onChangeText={(text)=>{
                setText(text)
            }}></TextInput>
            <Button title='Send' onPress={()=>{
                socket.emit("send_text", text)
            }}></Button>
        </View>
    )
}


export default Chat