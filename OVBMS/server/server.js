import express from 'express'
import mysql from 'mysql2'
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser'

const app = express()

{/* Authentication Tokens */}

const adminAuthenticateToken = (req, res, next) => {
    const token = req.cookies.admin_access_token;
    if (!token) return res.status(401).json("Access Denied");
  
    jwt.verify(token, "adminjwtkey", (err, user) => {
      if (err) return res.status(403).json("Invalid Token");
      req.user = user;
      next();
    });
};

const userAuthenticateToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Access Denied");
  
    jwt.verify(token, "userjwtkey", (err, user) => {
      if (err) return res.status(403).json("Invalid Token");
      req.user = user;
      next();
    });
};


{/* Connection to Database */}

const ClientDB = mysql.createConnection({
    host:"localhost",
    user:"client",
    password:"client",
    database:"ovbms"
})

const AdminDB = mysql.createConnection({
    host:"localhost",
    user:"admin",
    password:"admin",
    database:"ovbms"
})

{/* Connecting with Frontend */}

app.use(cors({
    origin: ["http://localhost:3000","http://localhost:4000"],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())


{/* User Functions */}

app.post("/UserSignUp", (req, res)=>{

    const q = 'select * from customer where email = ?'

    ClientDB.query(q, [req.body.email], (err, data) =>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("User already exists!")

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(req.body.password, salt)
        
        const q = 'insert into customer (email, name, password, license_id, mobile_no, dob) values (?)';
        const values = [
            req.body.email,
            req.body.name,
            hashPassword,
            req.body.licenseNumber,
            req.body.mobileNumber,
            req.body.dob
        ]
    
        ClientDB.query(q, [values], (err, data)=>{
            if(err) return res.json(err)
            return res.status(200).json("User Signed up succesfully!!")
        })
        
    })
})

app.post("/UserSignIn", (req, res) =>{
    const q = 'select * from customer where email = ?';

    ClientDB.query(q, [req.body.email], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.status(404).json("User not found!")
        console.log(data[0])

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)

        if (!isPasswordCorrect) return res.status(400).json("Wrong Email ID or Password!")

        const token = jwt.sign({id:data[0].email}, "userjwtkey")
        const { password, ...other} = data[0]

        res.cookie("access_token", token, {
            httpOnly:true,
            secure: false,
            sameSite:"lax"
        }).status(200).json(data[0])
    })
})

app.post("/UserSignOut", (req, res) => {
    res.clearCookie("access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("User has been Logged Out!")
})

app.get("/VehicleListings",(req, res)=>{
    const q = `SELECT * FROM ovbms.vehicles where availability in ('Available','Waiting')`
    ClientDB.query(q, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/UserProfile", userAuthenticateToken,(req, res)=>{
    const user = req.user.id;
    const q = `SELECT * FROM ovbms.booking_requests where customer_id = ?`
    ClientDB.query(q, user, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/VehicleBooking/:id", userAuthenticateToken, (req, res) => {
    const vehicle_license_no = req.params.id
    const q = 'SELECT * FROM vehicles WHERE License_No = ?'

    ClientDB.query(q, [vehicle_license_no], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0])
    });
});

app.post("/VehicleBooking/:id", userAuthenticateToken, async (req, res) => {
    const customer_email = req.user.id;
    const vehicle_license_no = req.params.id
    const {from_date, to_date } = req.body;
    
    const query = "CALL BookVehicle(?, ?, ?, ?)";
    
    ClientDB.query(query, [customer_email, vehicle_license_no, from_date, to_date], (err, data) => {
        if (err) return res.status(500).json("Error processing booking request.");
        res.status(200).json("Booking request submitted successfully.");
    });
});


{/* Admin Functions */}

app.post("/AdminLogin", (req, res) =>{
    const q = 'select * from manager where email = ?';

    AdminDB.query(q, [req.body.email], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.status(404).json("Admin not found!")
        console.log(data[0])

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)

        if (!isPasswordCorrect) return res.status(400).json("Wrong Email ID or Password!")

        const token = jwt.sign({id:data[0].email}, "adminjwtkey")
        const { password, ...other} = data[0]

        res.cookie("admin_access_token", token, {
            httpOnly:true,
            secure: false,
            sameSite:"lax"
        }).status(200).json(data[0])
    })
})

app.post("/AddAdmin", adminAuthenticateToken, (req, res)=>{

    const q = 'select * from manager where email = ?'

    AdminDB.query(q, [req.body.email], (err, data) =>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("Admin already exists!")

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(req.body.password, salt)
        
        const q = 'insert into manager (email, name, password) values (?)';
        const values = [
            req.body.email,
            req.body.name,
            hashPassword
        ]
    
        AdminDB.query(q, [values], (err, data)=>{
            if(err) return res.json(err)
            return res.status(200).json("Added Admin succesfully!!")
        })
    })
})

app.post("/AdminLogout", adminAuthenticateToken, (req, res) => {
    res.clearCookie("admin_access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("Admin has been Logged Out!")
})

app.get("/Admin", adminAuthenticateToken, (req, res)=>{
    const q = `SELECT * FROM ovbms.vehicles where availability in ('Available','Waiting')`
    AdminDB.query(q, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/AddVehicle", adminAuthenticateToken, (req, res)=>{
    const q = `insert into vehicles 
        (License_No, Vehicle_Name, Model_Year, Price_Per_Day, Seating_Capacity, Fuel_Type, Vehicle_Image, Vehicle_Overview, manager_id) 
        values (?)`;
    const values = [
        req.body.License_No,
        req.body.Vehicle_Name,
        req.body.Model_Year,
        req.body.Price_Per_Day,
        req.body.Seating_Capacity,
        req.body.Fuel_Type,
        req.body.Vehicle_Image,
        req.body.Vehicle_Overview,
        req.user.id
    ]

    AdminDB.query(q, [values], (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.delete("/Admin/:id", adminAuthenticateToken, (req, res) => {
    const License_No = req.params.id
    const q = 'delete from vehicles where license_no = ?'

    AdminDB.query(q, [License_No], (err, data) => {
        if (err) return res.json(err)
        return res.json("Vehicle Deleted")
    })
})

app.get("/UpdateVehicle/:id", adminAuthenticateToken, (req, res) => {
    const vehicle_license_no = req.params.id
    const q = 'SELECT * FROM vehicles WHERE License_No = ?'

    AdminDB.query(q, [vehicle_license_no], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0])
    });
});

app.put("/UpdateVehicle/:id", adminAuthenticateToken, (req, res) => {
    const vehicle_license_no = req.params.id
    const q = `
    UPDATE vehicles 
    SET 
        \`License_No\` = ?, 
        \`Vehicle_Name\` = ?, 
        \`Model_Year\` = ?, 
        \`Price_Per_Day\` = ?, 
        \`Seating_Capacity\` = ?, 
        \`Fuel_Type\` = ?, 
        \`Vehicle_Image\` = ?, 
        \`Vehicle_Overview\` = ?, 
        \`manager_id\` = ? 
    WHERE License_No = ?
`

    const values = [
        req.body.License_No,
        req.body.Vehicle_Name,
        req.body.Model_Year,
        req.body.Price_Per_Day,
        req.body.Seating_Capacity,
        req.body.Fuel_Type,
        req.body.Vehicle_Image,
        req.body.Vehicle_Overview,
        req.user.id
    ]

    AdminDB.query(q, [...values, vehicle_license_no], (err, data) => {
        if (err) return res.json(err)
        return res.json("Vehicle Info has been Updated Successfully")
    })
})

app.get("/AdminDashboard", adminAuthenticateToken, (req, res) => {
    const q = `
        SELECT 
            (SELECT COUNT(*) FROM customer) as total_users,
            (SELECT COUNT(*) FROM vehicles) as total_vehicles,
            (SELECT COUNT(*) FROM booking_requests) as total_bookings
    `;
    
    AdminDB.query(q, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error fetching dashboard stats");
        }
        return res.json(data[0]);
    });
});

app.get("/BookingRequest", adminAuthenticateToken, (req, res) => {
    const q = `select br.request_id, br.request_date, br.from_date, br.to_date, br.request_status, br.vehicle_id, 
        c.name, c.email, c.license_id, c.mobile_no, 
        v.vehicle_name, v.price_per_day, v.vehicle_image, v.manager_id 
        from booking_requests br 
        join customer c on br.customer_id = c.email 
        join vehicles v on br.vehicle_id = v.license_no 
        order by br.request_date desc`

    AdminDB.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post("/BookingRequest/:requestId", adminAuthenticateToken, (req, res) => {
    const { requestId } = req.params
    const { action } = req.body
    const managerId = req.user.id

    const q = 'CALL HandleBookingRequest(?, ?, ?)'
    AdminDB.query(q, [requestId, action, managerId], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
})

app.listen(5000, ()=>{
    console.log("Connected to Backend")
})