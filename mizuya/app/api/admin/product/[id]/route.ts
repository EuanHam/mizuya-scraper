import updateProductHistory from "@/server/mongodb/actions/updateProductHistory";

export const PATCH = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
    try {
        const { id } = await params;

        if (!id) {
            return new Response("Product ID is required", { status: 400 });
        }

        const body = await req.json();
        const { price, availability, date } = body ?? {};

        if (typeof price !== "number") {
            return new Response("Price is required and must be a number", {
                status: 400,
            });
        }

        const parsedAvailability =
            availability !== undefined ? Boolean(availability) : false;
        const parsedDate = date ? new Date(date) : new Date();

        const product = await updateProductHistory(
            id,
            price,
            parsedAvailability,
            parsedDate
        );

        return Response.json(product, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";

        if (message === "Invalid product ID") {
            return new Response("Invalid product ID format", { status: 400 });
        }

        if (message === "Product not found") {
            return new Response("Product not found", { status: 404 });
        }

        console.error("patch product error:", error);
        return new Response("Failed to update product history", {
            status: 500,
        });
    }
};

/*
eg 
PATCH http://localhost:3000/api/admin/product/[id]
{
  "price": 36.00,
  "availability": true
}
*/
