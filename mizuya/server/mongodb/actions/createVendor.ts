import mongoose from "mongoose";
import connectDB from "../index";
import Vendor from "../models/Vendor";

async function createVendor(
    name: string,
    website: string,
    logoLink?: string
) {
    try {
        await connectDB();
        const newVendor = new Vendor({ name, website, logoLink });
        await newVendor.save();
    } catch (error) {
        throw false;
    }
}

export default createVendor;