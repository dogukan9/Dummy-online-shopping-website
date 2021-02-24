const mongoose=require("mongoose");

const MONGO_URI=<Your mongo connection uri>;
const connectDatabase=()=>{
    mongoose.connect(MONGO_URI,{useNewUrlParser:true,useUnifiedTopology: true}).then(()=>{
        console.log("connection is succesfull");
    })
    .catch(err=>{
        console.log(err);
    })
};

module.exports=connectDatabase;