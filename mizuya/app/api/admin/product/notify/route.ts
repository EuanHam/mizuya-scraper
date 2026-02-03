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
      const htmlBody = `<p><strong>[TEST MODE]</strong> No items in stock</p>`;
      const textBody = `[TEST MODE] No items in stock`;

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