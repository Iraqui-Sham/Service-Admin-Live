import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({

    serviceId:{
        type:String
    },

    serviceName:{
        type:String
    },

    customerName:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    address:{
        type:String
    },

    city:{
        type:String
    },

    date:{
        type:String
    },

    timeSlot:{
        type:String
    },

    status:{

        type:String,

        enum:[
            "pending",
            "confirmed",
            "completed",
            "cancelled"
        ],

        default:"pending"

    }

},{timestamps:true})

export default mongoose.model(
"Booking",
bookingSchema
)