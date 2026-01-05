import readProducts from "@/server/mongodb/actions/readProducts";

export const GET = async (
    req: Request
): Promise<Response> => {
    try {
        const products = await readProducts();

        return Response.json(
            products,
            { status: 200 }
        );
    } catch (error) {
        console.error("get products error:", error);
        return new Response(
            "Failed to get products",
            { status: 500 }
        );
    }
};