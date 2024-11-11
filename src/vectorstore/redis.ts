import { ChatHubBaseEmbeddings } from "koishi-plugin-chatluna/llm-core/platform/model";

import { createClient, RedisClientOptions } from "redis";
import { RedisVectorStore } from "@langchain/redis";

export async function getRedisVectorStore(
  embeddings: ChatHubBaseEmbeddings,
  redisClientOptions: RedisClientOptions,
) {
  const client = createClient(redisClientOptions);
  await client.connect();

  const index = "aaa"; // This is required due to ChatLuna breaks Redis Search index
  const vectorStore = new RedisVectorStore(embeddings, {
    redisClient: client,
    indexName: index, // This is required due to ChatLuna breaks Redis Search index
  });

  const testVector = await embeddings.embedDocuments(["test"]);
  try {
    await vectorStore.createIndex(testVector[0].length);
  } catch (e) {
    try {
      await vectorStore.dropIndex(true);
      await vectorStore.createIndex(testVector[0].length);
    } catch (e) {}
  }

  async function addPrefixToKeys() {
    let cursor = 0;
    do {
      const result = await client.scan(cursor);
      cursor = result.cursor;
      const keys = result.keys;

      for (const key of keys) {
        if (!key.startsWith(`doc:${index}:`)) {
          const newKey = `doc:${index}:${key}`;
          await client.rename(key, newKey);
          console.log(`Renamed ${key} to ${newKey}`);
        }
      }
    } while (cursor !== 0);
  }
  await addPrefixToKeys(); // This is required due to ChatLuna breaks Redis Search index
  return vectorStore;
}
