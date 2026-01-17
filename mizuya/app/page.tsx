export default function Home() {
  return (
    <div className="flex flex-col min-h-screen py-8 px-8 bg-gray-50 items-center">
      <div className="w-full max-w-xl">
        <h1>MIZUYA API</h1>
        <div className="pb-4">
          <a href="https://github.com/euanham/mizuya-scraper" className="inline-block pr-4 underline decoration-dotted">Repo</a>
          <a href="https://euan.vercel.app/writing/mizuya1" className="inline-block underline decoration-dotted">Devlog</a>
        </div>


        <h2>GET Endpoints</h2>

        {/* Get vendors */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <h3>Get All Vendors</h3>
          <p>Retrieves all vendors</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-4">
            GET /api/vendors
          </p>
          <h4>Response (200):</h4>
          <pre>
            {JSON.stringify([
              {
                _id: "objectId",
                name: "string",
                website: "string",
                logoLink: "string",
                products: ["objectId"]
              }
            ], null, 2)}
          </pre>
          <h4>Error (500): Failed to get vendors</h4>
        </section>

        {/* Get vendor by ID */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <h3>Get Vendor by ID</h3>
          <p>Retrieves a specific vendor by ID</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-4">
            GET /api/vendor/:id
          </p>
          <h4>Parameters:</h4>
          <p className="text-sm">• id (string, required): Vendor ID</p>
          <h4>Response (200):</h4>
          <pre>
            {JSON.stringify({
              _id: "objectId",
              name: "string",
              website: "string",
              logoLink: "string",
              products: ["objectId"]
            }, null, 2)}
          </pre>
          <h4>Error (400): Vendor ID is required</h4>
          <h4>Error (500): Failed to get vendor</h4>
        </section>

        {/* Get All Products */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <h3>Get All Products</h3>
          <p>Retrieves all products</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-4">
            GET /api/products
          </p>
          <h4>Response (200):</h4>
          <pre>
            {JSON.stringify([
              {
                _id: "objectId",
                name: "string",
                mostRecentPrice: 0,
                mostRecentDate: "date",
                mostRecentAvailability: true,
                link: "string",
                imageLink: "string",
                vendor: "objectId",
                history: [
                  {
                    date: "date",
                    availability: true,
                    price: 0
                  }
                ]
              }
            ], null, 2)}
          </pre>
          <h4>Error (500): Failed to get products</h4>
        </section>

        {/* Get product by ID */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <h3>Get Product by ID</h3>
          <p>Retrieves a specific product by ID</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-4">
            GET /api/product/:id
          </p>
          <h4>Parameters:</h4>
          <p className="text-sm">• id (string, required): Product ID</p>
          <h4>Response (200):</h4>
          <pre>
            {JSON.stringify({
              _id: "objectId",
              name: "string",
              mostRecentPrice: 0,
              mostRecentDate: "date",
              mostRecentAvailability: true,
              link: "string",
              imageLink: "string",
              vendor: "objectId",
              history: [
                {
                  date: "date",
                  availability: true,
                  price: 0
                }
              ]
            }, null, 2)}
          </pre>
          <h4>Error (400): Product ID is required</h4>
          <h4>Error (500): Failed to get product</h4>
        </section>
      </div>
    </div>
  );
}