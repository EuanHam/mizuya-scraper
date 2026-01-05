import createProduct from "../../../../server/mongodb/actions/createProduct";
import mongoose from "mongoose";

export const POST = async (
    req: Request
): Promise<Response> => {
    try {
        const body = await req.json();
        const { name, price, vendor } = body ?? {};

        if (
            typeof name !== 'string' ||
            typeof price !== 'number' ||
            !mongoose.isValidObjectId(vendor)
        ) {
            return new Response("Invalid input", { status: 400 });
        }

        await createProduct(name, price, vendor);

        return new Response("Success", { status: 200 });
    } catch (error) {
        console.error("Error in route", error);
        return new Response("Failed", { status: 500 });
    }
};

/*
POST http://localhost:3000/api/admin/product

{
  "name": "Tsujiki Ceremonial Blend Matcha 20g",
  "price": 48.00,
  "vendor": "695bf7949571d57fd75e26eb"
}

*/