import readVendors from "@/server/mongodb/actions/readVendors";

export const GET = async (
    req: Request
): Promise<Response> => {
    try {
        const vendors = await readVendors();

        return Response.json(
            vendors,
            { status: 200 }
        );
    } catch (error) {
        console.error("get vendors error:", error);
        return new Response(
            "Failed to get vendors",
            { status: 500 }
        );
    }
};
