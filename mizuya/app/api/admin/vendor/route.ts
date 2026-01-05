import createVendor from "../../../../server/mongodb/actions/createVendor";

export const POST = async (
    req: Request
): Promise<Response> => {
    try {
        const body = await req.json();
        const { name, website, logoLink } = body ?? {};

        if (
            typeof name !== 'string' ||
            typeof website !== 'string' ||
            (logoLink !== undefined && typeof logoLink !== 'string')
        ) {
            return new Response("Invalid input", { status: 400 });
        }

        await createVendor(name, website, logoLink);

        return new Response("Success", { status: 200 });
    } catch (error) {
        console.error("Error in route", error);
        return new Response("Failed", { status: 500 });
    }
};

/*
POST http://localhost:3000/api/admin/vendor

{
  "name": "Rocky's",
  "website": "https://www.rockysmatcha.com/",
  "logoLink": "https://www.rockysmatcha.com/cdn/shop/files/RM_Scene10_AllTins_Stack_0292-web_8c7f49aa-4563-434e-864a-dca5d1931924.jpg?crop=center&height=1080&v=1751970199&width=720"
}
*/