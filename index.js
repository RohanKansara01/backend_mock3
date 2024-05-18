const express=require('express');
const app=express();
app.use(express.json());





const PORT=8080;
app.listen(PORT,()=>{
    console.log("Server is running on PORT: ",PORT);
})