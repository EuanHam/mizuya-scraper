import mongoose from "mongoose";
import connectDB from "@/server/mongodb/index";
import Product from "@/server/mongodb/models/Product";
import Vendor from "@/server/mongodb/models/Vendor";

interface SyncProductData {
    title: string;
    status: "in_stock" | "out_of_stock";
    url: string;
    price?: number;
}

export const POST = async (req: Request): Promise<Response> => {
    try {
        const body = await req.json();
        const { products, vendorId } = body ?? {};

        if (
            !Array.isArray(products) ||
            !mongoose.isValidObjectId(vendorId)
        ) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid input: products must be an array and vendorId must be valid",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await connectDB();

        // verify vendor 
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Vendor not found",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const syncResults = {
            created: 0,
            updated: 0,
            errors: [] as string[],
        };

        for (const productData of products) {
            try {
                const { title, status, url, price } = productData as SyncProductData;

                const availability = status === "in_stock";
                const parsedPrice = price ?? 0;

                let product = await Product.findOne({
                    name: title,
                    vendor: vendorId,
                });

                if (product) {
                    // if the product exists just update history
                    product.mostRecentAvailability = availability;
                    product.mostRecentDate = new Date();
                    product.mostRecentPrice = parsedPrice;
                    product.link = url;

                    // add to history
                    product.history.push({
                        date: new Date(),
                        availability,
                        price: parsedPrice,
                    });

                    await product.save();
                    syncResults.updated++;
                } else {
                    // Create new product
                    const newProduct = new Product({
                        name: title,
                        mostRecentPrice: parsedPrice,
                        mostRecentDate: new Date(),
                        mostRecentAvailability: availability,
                        link: url,
                        vendor: vendorId,
                        history: [
                            {
                                date: new Date(),
                                availability,
                                price: parsedPrice,
                            },
                        ],
                    });

                    await newProduct.save();

                    // add product to array
                    await Vendor.findByIdAndUpdate(
                        vendorId,
                        { $push: { products: newProduct._id } },
                        { new: true }
                    );

                    syncResults.created++;
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                syncResults.errors.push(`Failed to sync "${productData.title}": ${errorMessage}`);
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                syncResults,
                timestamp: new Date().toISOString(),
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Sync endpoint error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return new Response(
            JSON.stringify({
                success: false,
                error: message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

/*
POST http://localhost:3000/api/admin/product/sync

{
  "vendorId": "695bf7949571d57fd75e26eb",
  "products": [
    {
      "title": "Ceremonial Blend Matcha 20g",
      "status": "in_stock",
      "url": "https://www.rockysmatcha.com/products/ceremonial-blend-20g",
      "price": 67.00
    },
    {
      "title": "Premium Grade Matcha 40g",
      "status": "in_stock",
      "url": "https://www.rockysmatcha.com/products/premium-grade-40g",
      "price": 45.00
    },
    {
      "title": "Ceremonial Grade Bundle",
      "status": "out_of_stock",
      "url": "https://www.rockysmatcha.com/products/ceremonial-bundle",
      "price": 89.99
    }
  ]
}

{
    "success": true,
    "syncResults": {
        "created": 2,
        "updated": 1,
        "errors": []
    },
    "timestamp": "2026-01-07T04:26:35.118Z"
}
    
*/
