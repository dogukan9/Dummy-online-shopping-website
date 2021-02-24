
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellSchema = new Schema({
  
 name: {
    type: String
  },
  price: {
    type:Number
  },
  url:{
      type:String
  },
  country:{
    type:String
},
  stok:{
      type:Number
  },
  adet:{
    type:Number
  }
});
module.exports = mongoose.model("sell",sellSchema);
