import connectDB from "../index";
import Product from "../models/Product";
import mongoose from "mongoose";

async function getProduct(productId: string) {
    try {
        await connectDB();
        
        if (!mongoose.isValidObjectId(productId)) {
            throw new Error("Invalid product ID");
        }
        
        const product = await Product.findById(productId).populate("vendor");
        
        if (!product) {
            throw new Error("Product not found");
        }
        
        return product;
    } catch (error) {
        console.error("Error reading product:", error);
        throw error;
    }
}

export default getProduct;
