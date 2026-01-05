import getVendor from "@/server/mongodb/actions/getVendor";

export const GET = async (
    req: Request,
    { params }: { params: { id: string } }
): Promise<Response> => {
    try {
        const { id } = params;

        if (!id) {
            return new Response("Vendor ID is required", { status: 400 });
        }

        const vendor = await getVendor(id);

        return Response.json(
            vendor,
            { status: 200 }
        );
    } catch (error) {
        console.error("get vendor error:", error);
        return new Response(
            "Failed to get vendor",
            { status: 500 }
        );
    }
};
