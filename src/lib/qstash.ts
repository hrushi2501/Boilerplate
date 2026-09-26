import { Client, Receiver } from "@upstash/qstash";

/**
 * Upstash QStash Server-side Client & Signature Receiver
 *
 * Designed for serverless background tasks, scheduled crons, delayed execution,
 * and long-running AI / agent workflows.
 *
 * Use cases:
 * - Offloading heavy LLM / LangGraph workflows from synchronous user requests
 * - Asynchronous background processing with guaranteed retries and dead-letter queues
 * - Scheduled cron triggers and delayed job dispatching
 * - Webhook delivery and event-driven architectures
 *
 * Security:
 * - Credentials must remain strictly server-side.
 * - Inbound QStash webhooks should verify signatures using `verifyQStashSignature`.
 */

const qstashToken = process.env.QSTASH_TOKEN;
const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

export const qstash = qstashToken
  ? new Client({
      token: qstashToken,
    })
  : null;

/**
 * Returns the QStash client or throws a descriptive error if environment variables are missing.
 */
export function getQStash(): Client {
  if (!qstash) {
    throw new Error(
      "Upstash QStash is not configured. Please set QSTASH_TOKEN in .env.local",
    );
  }
  return qstash;
}

/**
 * Receiver instance for validating inbound QStash webhook request signatures.
 */
export const qstashReceiver =
  currentSigningKey && nextSigningKey
    ? new Receiver({
        currentSigningKey,
        nextSigningKey,
      })
    : null;

/**
 * Verifies an inbound HTTP request signature from Upstash QStash.
 * Returns true if valid, or false if signature verification fails.
 */
export async function verifyQStashSignature(
  req: Request,
  rawBody: string,
): Promise<boolean> {
  if (!qstashReceiver) {
    console.warn(
      "QStash Receiver is not configured. Missing QSTASH_CURRENT_SIGNING_KEY or QSTASH_NEXT_SIGNING_KEY.",
    );
    return false;
  }

  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    return false;
  }

  try {
    return await qstashReceiver.verify({
      signature,
      body: rawBody,
    });
  } catch (error) {
    console.error("QStash signature verification failed:", error);
    return false;
  }
}
