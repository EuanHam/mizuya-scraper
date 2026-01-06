import connectDB from "../index";
import Product from "../models/Product";
import mongoose from "mongoose";

async function updateProductHistory(
    productId: string,
    price: number,
    availability: boolean = false,
    date: Date = new Date()
) {
    try {
        await connectDB();

        if (!mongoose.isValidObjectId(productId)) {
            throw new Error("Invalid product ID");
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            {
                $push: {
                    history: {
                        date,
                        availability,
                        price,
                    },
                },
                mostRecentPrice: price,
                mostRecentAvailability: availability,
                mostRecentDate: date,
            },
            { new: true }
        );

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        console.error("Error updating product history:", error);
        throw error;
    }
}

export default updateProductHistory;