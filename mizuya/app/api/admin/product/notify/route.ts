import { NextRequest, NextResponse } from "next/server";
import readProducts from "@/server/mongodb/actions/readProducts";
import { sendBulkEmail } from "@/server/services/emailService";

const SUBSCRIBER_EMAILS = process.env.SUBSCRIBER_EMAILS?.split(",") || [];

const MARUKYU_VENDOR_ID = "6960443662b4343e0fb34ef7";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get("test") === "true";
    const products = await readProducts();

    const marukyuProducts = products.filter(
      (product) => product.vendor === MARUKYU_VENDOR_ID
    );

    const inStockProducts = marukyuProducts.filter(
      (product) => product.mostRecentAvailability === true
    );

    // Test mode: always send email
    if (testMode && SUBSCRIBER_EMAILS.length > 0) {
      const htmlBody = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Matcha Stock Notification System</h2>
              <p style="color: #666;">This is a test notification from Mizuya.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 15px 0;">
                <p style="margin: 0;"><strong>Status:</strong> Currently no Marukyu Koyamaen products in stock.</p>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">You will receive notifications when items become available.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
              <p style="color: #999; font-size: 12px; margin: 0;">This is an automated message from Mizuya Matcha Monitor.</p>
            </div>
          </body>
        </html>
      `;
      
      const textBody = `Matcha Stock Notification System. 
                        
                        This is a test notification from Mizuya.

                        Status: Currently no Marukyu Koyamaen products in stock.

                        You will receive notifications when items become available.

                        ---
                        This is an automated message from Mizuya Matcha Monitor.`;


      await sendBulkEmail(
        SUBSCRIBER_EMAILS,
        "[TEST] Marukyu Koyamaen restock",
        htmlBody,
        textBody
      );

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${SUBSCRIBER_EMAILS.length} subscriber(s)`,
        testMode: true,
      });
    }

    if (inStockProducts.length > 0 && SUBSCRIBER_EMAILS.length > 0) {
      const htmlBody = `<p>Marukyu Koyamaen is back in stock!</p>`;
      const textBody = `Marukyu Koyamaen is back in stock!`;

      await sendBulkEmail(
        SUBSCRIBER_EMAILS,
        "Marukyu Koyamaen restock",
        htmlBody,
        textBody
      );

      return NextResponse.json({
        success: true,
        message: `Notification sent to ${SUBSCRIBER_EMAILS.length} subscriber(s)`,
        inStockProducts: inStockProducts.map((p) => ({
          name: p.name,
          price: p.mostRecentPrice,
          link: p.link,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: "No in-stock products to notify about",
      inStockProducts: [],
    });
  } catch (error) {
    console.error("Error in notification endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}