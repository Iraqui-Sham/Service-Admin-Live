import mongoose from "mongoose";

const Mongodbconnnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODBURI);
        if (connection) {
            console.log("Mongodb Connection successfully");
        }
    } catch (err) {
        console.log(err.message || "Problem In DataBase Connnection")
    }
}

export default Mongodbconnnection;