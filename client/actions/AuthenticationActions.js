import axios from "axios"
import domain from '../configs'

export const LoginAction=(phone, password, role)=>{
    return{
        type: 'LOGIN',
        payload: {phone: phone, role: role},
    }
}


export const Check=()=>{
    return{
        type: 'CHECK',
    }
}


export const Logout=()=>{
    return{
        type: 'LOGOUT'
    }
}


export const Loaded=()=>{
    return{
        type: 'LOADED'
    }
}


export const UpdateRole=()=>{
    return{
        type: 'UPDATE_ROLE',
    }
}