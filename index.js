const express=require('express');
const { userModel, employeeModel } = require('./db');
const app=express();
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());


//SignUp
app.post("/signup", async(req, res)=>{
    const{Email, Password, ConfirmPassword}=req.body;
    try {
        if(!Email || !Password || !ConfirmPassword){
            res.send('Please fill all the fields'); 
        }
        const exists=await userModel.find({Email:Email});
        if(exists.length!==0){
            res.send('Email already exists'); 
        }else{
            const hash=await bcrypt.hash(Password, 6);
            await userModel.create({
                Email:Email,
                Password:hash,
                ConfirmPassword:ConfirmPassword
            });
            res.status(201).send({
                Email:Email,
                Password:Password
            }); 
            console.log('User Successfully registered');
        }
    } catch (error) {
        console.log('Error signing up the user:', error);
        res.status(500).send('Internal Server Error');
    }
});


//Login
app.post("/login", async(req, res)=>{
    const{Email, Password}=req.body;
    try {
        const user=await userModel.findOne({Email:Email});
        if(!user){
            res.status(404).send('User not found');
        }
        const check=await bcrypt.compare(Password, user.Password);
        if(!check){
            res.status(401).send('Invalid password'); 
        }
        const token=jwt.sign({userId:user._id }, "rohan");
        res.cookie('token', token,{
            maxAge:15*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV!=="development"
        });
        res.status(200).send({message:'User Found', token:token}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error'); 
    }
});


//display employeeData
app.get("/", async(req, res)=>{
    try {
        const data=await employeeModel.find();
        res.send(data);
        console.log('Data fetched successfully');
    } catch (error) {
        console.log('Error fetching the data', error);
        res.status(500).send('Internal Server Error'); 
    }
});


//post employee data
app.post('/employee', async(req, res)=>{
    try {
        const data=await employeeModel.create(req.body);
        res.send(data);
        console.log('Data posted successfully');
    } catch (error) {
        console.log('Error posting the data', error);
        res.status(500).send('Internal Server Error');
    }
});


//Edit employee data
app.put('/employee/:id', async(req, res)=>{
    try {
        const data=req.body;
        const update=await employeeModel.findById(req.params.id);
        update.FirstName=data.FirstName || update.FirstName;
        update.LastName=data.LastName || update.LastName;
        update.Email=data.Email || update.Email;
        update.Department=data.Department || update.Department;
        update.Salary=data.Salary || update.Salary;
        const updatedData=await update.save();
        res.status(200).send(updatedData);
        console.log('Data updated successfully');
    } catch (error) {
        console.log('Error updating the data', error);
        res.status(500).send('Internal Server Error');
    }
});


//delete employee data
app.delete('/employee/:id', async (req, res) => {
    try {
        const data=await employeeModel.findByIdAndDelete(req.params.id);
        res.status(200).send(data);
        console.log('Data deleted successfully');
    } catch (error) {
        console.log('Error deleting the data', error);
        res.status(500).send('Internal Server Error'); 
    }
});


const PORT=3000;
app.listen(PORT,()=>{
    try {
        console.log("Server is running on PORT: ",PORT);
    } catch (error) {
        console.log("Error running on PORT: ",PORT);
    }
})