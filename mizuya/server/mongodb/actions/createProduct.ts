import mongoose from "mongoose";
import connectDB from "../index";
import Product from "../models/Product";

async function createProduct(
    name: string,
    description: string,
    price: number,
    vendor: mongoose.Schema.Types.ObjectId
) {
    try {
        await connectDB();
        const newProduct = new Product({ name, description, price, vendor });
        await newProduct.save();
    } catch (error) {
        throw false;
    }
}

export default createProduct