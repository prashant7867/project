import mongoose , {Schema} from "mongoose";

 const subscriptionSchema= new Schema({

    subscriber:{
        type:Schema.Types.ObjectId,//one who is subcribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//one who is subcriber is subscribing
        ref:"User"
    }

 },{timestamps:true})

 export const Subcription=mongoose.model("Subcription",subscriptionSchema)