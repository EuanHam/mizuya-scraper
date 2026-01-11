import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION || "us-east-1" });

interface EmailParams {
  to: string[];
  subject: string;
  htmlBody: string;
  textBody: string;
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: EmailParams): Promise<void> {
  const params: SendEmailCommandInput = {
    Source: process.env.SES_SENDER_EMAIL || "noreply@matcha.com",
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: htmlBody,
        },
        Text: {
          Data: textBody,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log(
      `Email sent successfully to ${to.join(", ")} with subject: ${subject}`
    );
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  htmlBody: string,
  textBody: string
): Promise<void> {
  // SES can send to multiple recipients in one call
  await sendEmail({
    to: recipients,
    subject,
    htmlBody,
    textBody,
  });
}
