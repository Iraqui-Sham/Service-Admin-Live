import express from "express"

import {

createBooking,

getBookingsByPhone

}

from "../Controller/BookingController.js"

const router=express.Router()

router.post(
"/create",
createBooking
)

router.get("/user", getBookingsByPhone)

export default router