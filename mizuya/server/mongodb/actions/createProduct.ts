import mongoose from "mongoose";
import connectDB from "../index";
import Product from "../models/Product";
import Vendor from "../models/Vendor";

async function createProduct(
    name: string,
    price: number,
    vendor: mongoose.Schema.Types.ObjectId
) {
    try {
        await connectDB();
        const newProduct = new Product({ name, price, vendor });
        await newProduct.save();

        // add product to vendor's products array
        // https://www.mongodb.com/docs/manual/reference/operator/update/push/
        await Vendor.findByIdAndUpdate(
            vendor,
            { $push: { products: newProduct._id } },
            { new: true }
        );
    } catch (error) {
        throw false;
    }
}

export default createProduct