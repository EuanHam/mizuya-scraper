import connectDB from "../index";
import Vendor from "../models/Vendor";

async function readVendors() {
    try {
        await connectDB();
        const vendors = await Vendor.find();
        console.log("Found vendors:", vendors.length);
        console.log("Vendors:", vendors);
        return vendors;
    } catch (error) {
        console.error("Error reading vendors:", error);
        throw error;
    }
}

export default readVendors;
