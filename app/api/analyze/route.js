import { NextResponse } from "next/server";
import { AzureKeyCredential } from "@azure/core-auth";
import { TextAnalyticsClient } from "@azure/ai-text-analytics";
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

export async function POST(request) {
  try {
    const { feedback } = await request.json();

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: "Feedback text is required." },
        { status: 400 }
      );
    }

    const languageEndpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
    const languageKey = process.env.AZURE_LANGUAGE_KEY;
    const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const tableName = process.env.AZURE_TABLE_NAME || "FeedbackEntries";

    if (!languageEndpoint || !languageKey || !storageConnectionString) {
      return NextResponse.json(
        { error: "Server environment variables are missing." },
        { status: 500 }
      );
    }

    const textClient = new TextAnalyticsClient(
      languageEndpoint,
      new AzureKeyCredential(languageKey)
    );

    const sentimentResults = await textClient.analyzeSentiment([feedback]);
    const result = sentimentResults[0];

    if (result.error) {
      return NextResponse.json(
        { error: "Azure AI Language failed to analyze the text." },
        { status: 500 }
      );
    }

    const confidenceScores = result.confidenceScores;

    const topConfidence = Math.max(
      confidenceScores.positive,
      confidenceScores.neutral,
      confidenceScores.negative
    );

    const { accountName, accountKey } =
      getStorageAccountInfo(storageConnectionString);

    const tableClient = new TableClient(
      `https://${accountName}.table.core.windows.net`,
      tableName,
      new AzureNamedKeyCredential(accountName, accountKey)
    );

    await tableClient.createTable().catch(() => {
      // Ignore error if table already exists.
    });

    const entry = {
      partitionKey: "feedback",
      rowKey: crypto.randomUUID(),
      feedback,
      sentiment: result.sentiment,
      confidenceScore: topConfidence,
      positiveScore: confidenceScores.positive,
      neutralScore: confidenceScores.neutral,
      negativeScore: confidenceScores.negative,
      submittedAt: new Date().toISOString(),
    };

    await tableClient.createEntity(entry);

    return NextResponse.json({
      message: "Feedback analyzed and saved successfully.",
      entry,
    });
  } catch (error) {
    console.error("Analyze API error:", error);

    return NextResponse.json(
      { error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}