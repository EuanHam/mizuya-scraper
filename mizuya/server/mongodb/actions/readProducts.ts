import connectDB from "../index";
import Product from "../models/Product";

async function readProducts() {
    try {
        await connectDB();
        const products = await Product.find();
        console.log("Found products:", products.length);
        console.log("Products:", products);
        return products;
    } catch (error) {
        console.error("Error reading products:", error);
        throw error;
    }
}

export default readProducts;
