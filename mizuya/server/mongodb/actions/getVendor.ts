import connectDB from "../index";
import Vendor from "../models/Vendor";
import mongoose from "mongoose";

async function getVendor(vendorId: string) {
    try {
        await connectDB();
        
        if (!mongoose.isValidObjectId(vendorId)) {
            throw new Error("Invalid vendor ID");
        }
        
        const vendor = await Vendor.findById(vendorId).populate("products");
        
        if (!vendor) {
            throw new Error("Vendor not found");
        }
        
        return vendor;
    } catch (error) {
        console.error("Error reading vendor:", error);
        throw error;
    }
}

export default getVendor;
