import { NextResponse } from "next/server";
import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

function getStorageAccountInfo(connectionString) {
  const parts = connectionString.split(";");

  const accountName = parts
    .find((part) => part.startsWith("AccountName="))
    ?.replace("AccountName=", "");

  const accountKey = parts
    .find((part) => part.startsWith("AccountKey="))
    ?.replace("AccountKey=", "");

  if (!accountName || !accountKey) {
    throw new Error("Invalid Azure Storage connection string.");
  }

  return { accountName, accountKey };
}

export async function GET() {
  try {
    const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const tableName = process.env.AZURE_TABLE_NAME || "FeedbackEntries";

    if (!storageConnectionString) {
      return NextResponse.json(
        { error: "Storage connection string is missing." },
        { status: 500 }
      );
    }

    const { accountName, accountKey } =
      getStorageAccountInfo(storageConnectionString);

    const tableClient = new TableClient(
      `https://${accountName}.table.core.windows.net`,
      tableName,
      new AzureNamedKeyCredential(accountName, accountKey)
    );

    const entries = [];

    for await (const entity of tableClient.listEntities()) {
      entries.push({
        id: entity.rowKey,
        feedback: entity.feedback,
        sentiment: entity.sentiment,
        confidenceScore: entity.confidenceScore,
        positiveScore: entity.positiveScore,
        neutralScore: entity.neutralScore,
        negativeScore: entity.negativeScore,
        submittedAt: entity.submittedAt,
      });
    }

    entries.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Feedback API error:", error);

    return NextResponse.json(
      { error: "Could not load feedback entries." },
      { status: 500 }
    );
  }
}