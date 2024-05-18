const mongoose=require('mongoose');

const connection=mongoose.connect(`mongodb+srv://rohankansara2000:test@databasetest.cehhvv0.mongodb.net/mock3_swiggy`)


const userSchema=mongoose.Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    ConfirmPassword:{type:String, required:true},
})
const userModel=mongoose.model("userData", userSchema);

const employeesSchema=mongoose.Schema({
    FirstName:{type:String, required:true},
    LastName:{type:String, required:true},
    Email:{type:String, required:true},
    Department:{type:String, required:true},
    Salary:{type:Number, required:true},
})
const employeeModel=mongoose.model("employeeData" , employeesSchema);

module.exports={connection, userModel, employeeModel};