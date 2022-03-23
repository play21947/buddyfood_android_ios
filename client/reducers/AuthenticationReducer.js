// import AsyncStorage from '@react-native-async-storage/async-storage'

const initialState = {
    phone: '',
    loadScreen: false
}


const AuthenticationReducer=(state = initialState, action)=>{
    if(action.type === "LOGIN"){

        let cvt_role = parseInt(action.payload.role)

        console.log("Check Type Role : ", typeof(action.payload.role), action.payload.role)

        return{
            phone: action.payload.phone,
            role: cvt_role,
            loadScreen: true
        }
    }else if(action.type === "CHECK"){
        AsyncStorage.getItem("phone").then((res)=>{
            if(res){
                return{
                    phone: res
                }
            }
        })
    }else if(action.type === "LOGOUT"){
        return{
            phone: '',
            role: 0,
            loadScreen: true
        }
    }else if(action.type === "LOADED"){ // The screen has loadded already and then what you want to do just ....
        return{
            ...state,
            loadScreen: true
        }
    }else if(action.type === 'UPDATE_ROLE'){
        return{
            ...state,
            role: 1
        }
    }else{
        return state
    }
}

export default AuthenticationReducer