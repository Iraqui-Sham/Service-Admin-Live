import Booking from "../Models/BookingSchema.js"

export const createBooking=async(req,res)=>{

    try{

        const booking=

        await Booking.create(req.body)

        return res.status(201).json({

            success:true,

            message:"Booking Created",

            data:booking

        })

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        })

    }

}

export const getBookingsByPhone=async(req,res)=>{
    try{
        const { phone } = req.query

        if(!phone){
            return res.status(400).json({
                success:false,
                message:"Phone number required"
            })
        }

        const bookings = await Booking.find({ phone })
            .sort({ createdAt: -1 })
            .lean()

        return res.status(200).json({
            success:true,
            message:"Bookings fetched successfully",
            data:bookings
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}