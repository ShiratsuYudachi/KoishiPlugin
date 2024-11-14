import { Context } from "koishi";
import { RedisVectorStore } from "./vectorstores/redis";
import { createClient } from "redis";

export interface VectorStoreData {
  key: string;
  content: string;
  contentVector: number[];
}

function getVectorStoreType(ctx: Context) {
  const pluginConfig = JSON.stringify(ctx.root.config.plugins);
  const matchVectorStore = pluginConfig.match(
    /"defaultVectorStore":\s*"([^"]+)"/
  );
  return matchVectorStore ? matchVectorStore[1] : "redis://127.0.0.1:6379";
}

function getRedisUrl(ctx: Context) {
  const pluginConfig = JSON.stringify(ctx.root.config.plugins);
  const matchRedisUrl = pluginConfig.match(/"redisUrl":\s*"([^"]+)"/);
  return matchRedisUrl ? matchRedisUrl[1] : "redis://127.0.0.1:6379";
}

function getMilvusUrl(ctx: Context) {
  const pluginConfig = JSON.stringify(ctx.root.config.plugins);
  const matchMilvusUrl = pluginConfig.match(/"milvusUrl":\s*"([^"]+)"/);
  return matchMilvusUrl ? matchMilvusUrl[1] : "http://127.0.0.1:19530";
}

function getMilvusUsername(ctx: Context) {
  const pluginConfig = JSON.stringify(ctx.root.config.plugins);
  const matchMilvusUrl = pluginConfig.match(/"milvusUsername":\s*"([^"]+)"/);
  return matchMilvusUrl ? matchMilvusUrl[1] : "";
}

function getMilvusPassword(ctx: Context) {
  const pluginConfig = JSON.stringify(ctx.root.config.plugins);
  const matchMilvusUrl = pluginConfig.match(/"milvusPassword":\s*"([^"]+)"/);
  return matchMilvusUrl ? matchMilvusUrl[1] : "";
}

export async function getVectorStore(ctx: Context) {
  const vectorStoreType = getVectorStoreType(ctx);
  switch (vectorStoreType) {
    case "redis": {
      const url = getRedisUrl(ctx);
      const client = createClient({ url });
      await client.connect();
      return new RedisVectorStore(client);
    }
    case "milvus": {
    }
  }
}
