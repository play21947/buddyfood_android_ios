const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
})

app.use(express.json())
app.use(cors())


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecom'
})


io.on("connection", (socket) => {
    
    console.log("User joined")

    socket.on("room_id", (payload) => {
        console.log(payload)
        socket.join(payload)
    })

    socket.on("check_room", () => {
        console.log(socket.rooms)
    })

    socket.on("send_text", (payload) => {
        console.log("Show : ", payload.owner_market)
        socket.to(payload.owner_market).emit("notify", payload.text)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnect")
    })
})


// io.on('connection', (socket)=>{
//     console.log("User Joined")

//     socket.on("play2:id", (payload)=>{
//         console.log("ID ROOM : ", payload)
//         socket.join(payload)

//         console.log(socket.rooms)
//     })

//     socket.on("play2:send_notify", (payload)=>{
//         console.log("Notify : ", payload)

//         db.query("SELECT * FROM users WHERE owner_store = ?", [payload.owner], (err, rs)=>{
//             if(err) throw err

//             console.log("Send To : ", rs[0].id)
//             socket.to(rs[0].id).emit('play2:get_notify', payload.text)
//         })
//     })


//     socket.on("disconnect", ()=>{
//         console.log("User go away")
//     })
// })


app.get('/test_api', (req, res) => {
    res.json("Hello World")
})


app.post('/login', (req, res) => {
    let phone = req.body.phone
    let password = req.body.password

    if (phone && password) {
        db.query("SELECT * FROM users WHERE phone = ? AND password = ?", [phone, password], (err, rs) => {
            if (err) throw err

            if (rs.length > 0) {
                res.json({ success: true, user_data: rs })
            } else {
                res.json({ success: false })
            }
        })
    } else {
        res.json({ blank_in_field: true })
    }

})


app.post('/getTypeFoods', (req, res) => {
    let type = req.body.type

    // console.log(type)


    db.query("SELECT * FROM stock WHERE food_type = ?", [type], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/SelectProduct", (req, res) => {
    let id = req.body.id

    // console.log(id)

    db.query("SELECT * FROM stock WHERE id = ? ", [id], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/ProvideToOrders", (req, res) => {
    let cart = req.body.cart
    let owner = req.body.owner
    let market = JSON.parse(cart)

    // console.log(market[0].owner)

    db.query("SELECT * FROM users WHERE phone = ?", [owner], (err, rs) => {

        if(err) throw err

        db.query("SELECT * FROM users WHERE owner_store = ?", [market[0].owner], (err, rs2)=>{

            if(err) throw err

            db.query("INSERT INTO list_orders (id_merchant ,owner_bill, lat_owner_bill , lng_owner_bill , market, lat_market, lng_market ,bill_orders) VALUES (?, ? ,?, ?, ?, ?, ?, ?)", [rs2[0].id, owner, rs[0].latitude, rs[0].longitude, market[0].owner, rs2[0].latitude, rs2[0].longitude, cart], (err, rs3) => {
                if (err) throw err
    
                res.json({ inserted: true })
            })
        })
    })
})


app.post('/get_order', (req, res) => {

    let phone = req.body.phone

    db.query("SELECT * FROM list_orders WHERE owner_bill = ?", [phone], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/specific_order", (req, res) => {
    let id = req.body.id

    db.query("SELECT * FROM list_orders WHERE id = ?", [id], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post('/get_user', (req, res) => {
    let phone = req.body.phone

    db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post('/get_market_user', (req, res) => {

    let phone = req.body.phone

    db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, rs) => {
        if (err) throw err

        // console.log(rs)

        res.json(rs)
    })
})


app.post('/get_orders_user', (req, res) => {
    let market = req.body.market

    db.query("SELECT * FROM list_orders WHERE market = ? AND pending_market = ?", [market, 0], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post('/merchant_accept', (req, res) => {

    let id = req.body.id

    db.query("UPDATE list_orders SET pending_market = ? WHERE id = ?", [1, id], (err, rs) => {
        if (err) throw err

        res.json({ success: true })
    })
})


app.post("/merchant_create", (req, res) => {
    let phone = req.body.phone
    let name_store = req.body.name_store

    db.query("UPDATE users SET role = ? , owner_store = ? WHERE phone = ?", [1, name_store, phone], (err, rs) => {
        if (err) throw err

        res.json({ create_success: true })
    })
})


app.post('/all_product', (req, res) => {
    let phone = req.body.phone


    db.query("SELECT * FROM users WHERE phone = ? ", [phone], (err, rs) => {
        if (err) throw err

        // console.log(rs[0].owner_store)        

        db.query("SELECT * FROM stock WHERE owner = ?", [rs[0].owner_store], (err, rs2) => {
            if (err) throw err

            res.json(rs2)
        })
    })
})


app.post('/delete_product', (req, res) => {
    let id = req.body.id

    db.query("DELETE FROM stock WHERE id = ?", [id], (err, rs) => {
        if (err) throw err

        res.json({ delete_success: true })
    })
})


app.post("/add_product", (req, res) => {

    let food_name = req.body.food_name
    let food_price = req.body.food_price
    let food_img = req.body.food_img
    let food_category = req.body.food_category
    let phone = req.body.phone

    db.query("SELECT * FROM users WHERE phone = ? ", [phone], (err, rs) => {
        if (err) throw err

        db.query("INSERT INTO stock (food_name, food_price, food_img, food_type, owner, owner_id) VALUES (?, ?, ?, ?, ?, ?)", [food_name, food_price, food_img, food_category, rs[0].owner_store, rs[0].phone], (err, rs2) => {
            if (err) throw err

            res.json({ added: true })

        })
    })
})


app.post('/edit_product', (req, res) => {
    let product_id = req.body.product_id

    db.query("SELECT * FROM stock WHERE id = ?", [product_id], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post('/update_edit_product', (req, res) => {
    let product_id = req.body.product_id
    let new_product_name = req.body.new_product_name
    let new_product_price = req.body.new_product_price

    db.query("UPDATE stock SET food_name = ?, food_price = ? WHERE id = ?", [new_product_name, new_product_price, product_id], (err, rs) => {
        if (err) throw err

        res.json({ updated: true })
    })
})

app.post('/sign_up', (req, res) => {
    let phone = req.body.phone
    let password = req.body.password


    db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, rs) => {
        if (err) throw err

        if (rs.length > 0) {
            res.json({ sign_up_success: false })
        } else {
            db.query("INSERT INTO users (phone, password) VALUES (?, ?)", [phone, password], (err, rs) => {
                if (err) throw err

                res.json({ sign_up_success: true })
            })
        }
    })
})

app.post('/get_location', (req, res) => {
    let phone = req.body.phone
    let lat = req.body.lat
    let lng = req.body.lng

    db.query("UPDATE users SET latitude = ?, longitude = ? WHERE phone = ?", [lat, lng, phone], (err, rs) => {
        if (err) throw err

        res.json({ location_success: true })
    })
})


app.post('/update_pos_myself', (req, res) => {
    let phone = req.body.phone
    let new_lat = req.body.new_lat
    let new_lng = req.body.new_lng


    db.query("UPDATE users SET latitude = ?, longitude = ? WHERE phone = ?", [new_lat, new_lng, phone], (err, rs) => {
        if (err) throw err

        res.json({ update_pos: true })
    })
})



app.post('/register_rider', (req, res) => {
    let phone = req.body.phone
    let rider_name = req.body.rider_name
    let rider_lastname = req.body.rider_lastname
    let rider_age = req.body.rider_age

    db.query("UPDATE users SET role = ? WHERE phone = ?", [2, phone], (err, rs1) => {
        if (err) throw err

        db.query("INSERT INTO rider (rider_name, rider_lastname, rider_age, rider_username) VALUES (? ,? ,? ,?)", [rider_name, rider_lastname, rider_age, phone], (err, rs) => {
            if (err) throw err

            res.json({ register_success: true })
        })
    })
})


app.get('/rider_orders', (req, res) => {
    db.query("SELECT * FROM list_orders", (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})



http.listen(3001, () => {
    console.log("server is running on port 3001")
})