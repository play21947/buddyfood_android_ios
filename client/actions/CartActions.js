export const AddToCart=(product)=>{
    return{
        type: "ADD_TO_CART",
        payload: product
    }
}


export const RemoveProduct=(id)=>{
    return{
        type: 'REMOVE_PRODUCT',
        payload: id
    }
}

export const Increment=(id)=>{
    return{
        type: "INCREMENT",
        payload: id
    }
}

export const Decrement=(id)=>{
    return{
        type: 'DECREMENT',
        payload: id
    }
}


export const ClearCart=()=>{
    return{
        type: 'CLEAR_CART',
    }
}