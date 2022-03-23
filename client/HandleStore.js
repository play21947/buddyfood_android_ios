import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native"
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HandleStore = ({ navigation }) => {


    let [products, setProducts] = useState([])

    let [status, setStatus] = useState(false)


    let [handleCategories, setHandleCategories] = useState(false)

    let [sub, setSub] = useState(0)
    let [add, setAdd] = useState(0)
    let [edit, setEdit] = useState(0)

    let all_genre = ['main_course', 'dessert', 'drink']

    let [select, setSelect] = useState('')
    let [product_name, setProduct_name] = useState('')
    let [product_price, setProduct_price] = useState('')
    let [product_img, setProduct_img] = useState('')

    let [editBoard, setEditBoard] = useState(false)
    let [editProduct, setEditProduct] = useState([])

    let [editFood_name, setEditFood_name] = useState('')
    let [editFood_price, setEditFood_price] = useState('')

    useEffect(() => {

        AsyncStorage.getItem("phone").then((res) => {

            // console.log(res)

            axios.post("http://play2api.ddns.net:3001/all_product", {
                phone: res
            }).then((res) => {
                // console.log("AllResult : ", res.data)
                setProducts(res.data)
            })
        })
    }, [sub, add, edit])


    const DeleteProduct = (id) => {

        Alert.alert('ต้องการลบสินค้า?', 'สินค้าจะหายไปเลย', [{
            text: 'ยืนยัน', onPress: () => {
                axios.post("http://play2api.ddns.net:3001/delete_product", {
                    id: id
                }).then((res) => {
                    if (res.data.delete_success) {
                        Alert.alert("ลบสินค้าเสร็จสิ้น")
                    }
                })
            }
        }, {
            text: 'ยกเลิก', onPress: () => {
                console.log("cancel")
            }
        }])
    }


    const AddProduct = () => {
        AsyncStorage.getItem('phone').then((res) => {
            axios.post("http://play2api.ddns.net:3001/add_product", {
                food_name: product_name,
                food_price: product_price,
                food_img: product_img,
                food_category: select,
                phone: res
            }).then((res) => {
                if (res.data.added) {
                    setAdd(add + 1)
                    setProduct_name('')
                    setProduct_price('')
                    setProduct_img('')
                    setSelect('')
                    Alert.alert("เพิ่มสินค้าเสร็จสิ้น")
                }
            })
        })
    }

    const EditProductShow = (product_id) => {
        axios.post('http://play2api.ddns.net:3001/edit_product', {
            product_id: product_id
        }).then((res) => {
            if (res.data) {
                setEditBoard(true)
                setEditProduct(res.data)
                setEditFood_name(res.data[0].food_name)
                setEditFood_price(res.data[0].food_price)
                // console.log("Edit Data: ", res.data)
            }
        })
    }


    const UpdateEdited=(product_id)=>{
        axios.post("http://play2api.ddns.net:3001/update_edit_product",{
            new_product_name: editFood_name,
            new_product_price: editFood_price,
            product_id: product_id
        }).then((res)=>{
            if(res.data.updated){
                setEditBoard(false)
                setEditProduct([])
                // setEditFood_name('')
                // setEditFood_price('')
                Alert.alert('เปลี่ยนแปลงเสร็จสิ้น')
                setEdit(edit + 1)
            }
        })
    }


    return (
        <View style={{ padding: 10, flex: 1, alignItems: 'center' }}>

            {editBoard && editProduct && editProduct.length > 0 ?
                <View style={{ width: '100%', backgroundColor: 'white', elevation: 5, position: 'absolute', bottom: 0, height: 180, borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 10, zIndex: 1 }}>


                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                        <View>
                            <Text style={{ fontFamily: 'prompt', color: '#1a1a1a', fontSize: 16 }}>เเก้ไข : {editProduct[0].food_name}</Text>
                        </View>

                        <View>
                            <TouchableOpacity onPress={() => {
                                setEditBoard(false)
                                setEditProduct([])
                            }}>
                                <Image style={{ width: 15, height: 15 }} source={require('./vector/close.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '45%' }}>
                            <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ชื่อสินค้า</Text>
                            <TextInput onChangeText={(text) => {
                                setEditFood_name(text)
                            }} value={editFood_name} style={{ fontFamily: 'prompt', borderWidth: 1, height: 45 }}></TextInput>
                        </View>

                        <View style={{ width: '45%' }}>
                            <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ราคาสินค้า</Text>
                            <TextInput onChangeText={(text) => {
                                setEditFood_price(text)
                            }} value={String(editFood_price)} style={{ fontFamily: 'prompt', borderWidth: 1, height: 45 }}></TextInput>
                        </View>
                    </View>

                    <TouchableOpacity onPress={()=>{
                        UpdateEdited(editProduct[0].id)
                    }} style={{ width: '100%', backgroundColor: 'orange', alignItems: 'center', padding: 10, marginTop: 15, borderRadius: 8 }}><Text style={{ color: '#1a1a1a', fontFamily: 'prompt', fontSize: 16 }}>เเก้ไข</Text></TouchableOpacity>
                </View>
                : null}



            {/* To add product */}

            {status ?
                <View style={{ width: '100%', height: '100%', backgroundColor: 'white', borderTopLeftRadius: 18, borderTopRightRadius: 18, elevation: 5, padding: 10, position: 'absolute', zIndex: 1, bottom: 0 }}>


                    <TouchableOpacity onPress={() => {
                        setStatus(false)
                    }} style={{ fontFamily: 'prompt', position: 'absolute', right: 20, top: 15, fontSize: 24 }}><Image style={{ width: 20, height: 20 }} source={require('./vector/cross.png')} /></TouchableOpacity>

                    <View style={{ padding: 10, marginTop: 50 }}>
                        <Text style={{ fontSize: 18, color: '#1a1a1a', fontFamily: 'prompt' }}>ชื่อสินค้า</Text>
                        <TextInput value={product_name} onChangeText={(text) => {
                            setProduct_name(text)
                        }} placeholder='กระเพราหมูสับ' placeholderTextColor={'#64748b'} style={{ width: '100%', height: 50, borderRadius: 8, fontFamily: 'prompt', borderWidth: 1, paddingLeft: 20, fontSize: 18 }}></TextInput>

                        <Text style={{ fontSize: 18, color: '#1a1a1a', fontFamily: 'prompt', marginTop: 10 }}>ราคาสินค้า</Text>
                        <TextInput value={product_price} keyboardType='number-pad' onChangeText={(text) => {
                            setProduct_price(text)
                        }} placeholder='40' placeholderTextColor={'#64748b'} style={{ width: '100%', height: 50, borderRadius: 8, borderWidth: 1, paddingLeft: 20, fontSize: 18, fontFamily: 'prompt' }}></TextInput>

                        <Text style={{ fontSize: 18, color: '#1a1a1a', fontFamily: 'prompt', marginTop: 10 }}>รูปสินค้า</Text>
                        <TextInput value={product_img} onChangeText={(text) => {
                            setProduct_img(text)
                        }} placeholder='url' placeholderTextColor={'#64748b'} style={{ width: '100%', height: 50, borderRadius: 8, borderWidth: 1, paddingLeft: 20, fontSize: 18, fontFamily: 'prompt' }}></TextInput>

                        <Text style={{ fontSize: 18, color: '#1a1a1a', fontFamily: 'prompt', marginTop: 10 }}>หมวดหมู่(categories)</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                setHandleCategories(!handleCategories)
                            }}><Text style={{ fontFamily: 'prompt', color: 'green', fontSize: 18 }}>{select ? select : "เลือก..."}</Text></TouchableOpacity>

                            {select ? <TouchableOpacity onPress={() => {
                                setSelect('')
                            }}><Image style={{ width: 10, height: 10, marginLeft: 40 }} source={require('./vector/close.png')} /></TouchableOpacity> : null}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                            {handleCategories ? all_genre.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <TouchableOpacity onPress={() => {
                                            setSelect(item)
                                            setHandleCategories(false)
                                        }} style={{ borderWidth: 1, padding: 10, marginTop: 10 }}>
                                            <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>{item}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }) : null}

                        </View>


                        {product_name && product_price && product_img && select ? <TouchableOpacity onPress={() => {
                            AddProduct()
                        }} style={{ backgroundColor: '#15803d', alignItems: 'center', borderRadius: 8 }}><Text style={{ fontFamily: 'prompt', color: 'white', padding: 10 }}>เพิ่มสินค้า</Text></TouchableOpacity> : <TouchableOpacity disabled style={{ backgroundColor: 'gray', alignItems: 'center', borderRadius: 8 }}><Text style={{ fontFamily: 'prompt', color: 'white', padding: 10, fontSize: 18 }}>เพิ่มสินค้า</Text></TouchableOpacity>}

                    </View>

                </View> : null}


            {/* To add product */}





            {/* Headers */}


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'prompt', color: '#1a1a1a', fontSize: 18, marginRight: 20 }}>สินค้าทั้งหมด : {products.length} ชิ้น</Text>
                <TouchableOpacity onPress={() => {
                    setStatus(true)
                }}><Text style={{ fontFamily: 'prompt', color: 'green', fontSize: 15 }}>+ เพิ่มสินค้า</Text></TouchableOpacity>
            </View>

            {/* Headers */}


            {/* List My Item */}

            {products && products.length > 0 ? products.map((item) => {
                return (
                    <View style={{ borderBottomWidth: 1, borderTopWidth: 1, marginTop: 10, width: '100%', padding: 10, flexDirection: 'row' }} key={item.id}>
                        <View style={{ width: 100, height: 100 }}>
                            <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={{ uri: item.food_img }} />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', marginLeft: 10 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>{item.food_name}</Text>
                                <Text style={{ fontFamily: 'prompt', color: 'green' }}>฿{item.food_price}</Text>
                                {item.food_type == 'dessert' ? <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>ของหวาน</Text> : item.food_type === 'main_course' ? <Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>จานหลัก</Text> : null}
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    EditProductShow(item.id)
                                }} style={{ width: 70, height: 50, backgroundColor: 'orange', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'prompt', color: '#1a1a1a' }}>เเก้ไข</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    DeleteProduct(item.id)
                                    setSub(sub + 1)
                                    // navigation.navigate("HOME")
                                    // navigation.navigate("HANDLE_STORE")
                                }} style={{ width: 70, height: 50, backgroundColor: 'firebrick', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: 'prompt', color: 'white' }}>ลบ</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }) : <Text style={{ fontFamily: 'prompt', fontSize: 20, color: '#1a1a1a' }}>ยังไม่มีสินค้า</Text>}


            {/* List My Item */}

        </View>
    )
}


export default HandleStore