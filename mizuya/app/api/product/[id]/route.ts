import getProduct from "@/server/mongodb/actions/getProduct";

export const GET = async (
    req: Request,
    { params }: { params: { id: string } }
): Promise<Response> => {
    try {
        const { id } = params;

        if (!id) {
            return new Response("Product ID is required", { status: 400 });
        }

        const product = await getProduct(id);

        return Response.json(
            product,
            { status: 200 }
        );
    } catch (error) {
        console.error("get product error:", error);
        return new Response(
            "Failed to get product",
            { status: 500 }
        );
    }
};
