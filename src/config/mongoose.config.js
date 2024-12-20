import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://santiagoluccamiraglia8:1234@cluster0.ugrpl.mongodb.net/products";
    try {
        await connect(URL);
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.log("error: "+error);
    }
}
export const isValidId = (id) => {
    return Types.ObjectId.isValid(id);
}