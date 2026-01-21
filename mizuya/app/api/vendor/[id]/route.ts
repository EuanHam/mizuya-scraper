import getVendor from "@/server/mongodb/actions/getVendor";
import { checkRateLimit } from "@/lib/rateLimiter";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
    try {
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0].trim() || "127.0.0.1";
        
        const { success, limit, reset, remaining } = await checkRateLimit(ip);
        
        if (!success) {
            return new Response(
                "Rate limit exceeded",
                { 
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                    }
                }
            );
        }

        const { id } = await params;

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
