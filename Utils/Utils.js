import dotenv from "dotenv"
dotenv.config()

import nodemailer from "nodemailer";

export const SendEmail = async (email, otp) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        })

        const mainOption = {
            from: process.env.APP_EMAIL,
            to: email,
            subject: "Otp For Service Sector Varificaton",
            text: `Your Otp ${otp}`
        }
        const mail = await transport.sendMail(mainOption);
        if (mail) {
            return { success: true, message: "OTP sent successfully!" };
        }
    } catch (error) {
        return { success: false, message: "Failed to send OTP", error: error.message };
    }
}