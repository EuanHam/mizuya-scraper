import readProducts from "@/server/mongodb/actions/readProducts";
import { checkRateLimit } from "@/lib/rateLimiter";

export const GET = async (
    req: Request
): Promise<Response> => {
    try {
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0].trim() || "127.0.0.1";
        
        // Check rate limit
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