const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
 name: {
    type: String
  },
  price: {
    type:Number
  },
  url:{
      type:String
  },
  stok:{
      type:Number
  }
});
module.exports = mongoose.model("products",productSchema);
