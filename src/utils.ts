import { Context } from "koishi";
import { getRedisVectorStore } from "./vectorstore/redis";
import { getMilvusVectorStore } from "./vectorstore/milvus";

function getVectorStoreType(ctx: Context) {
  const pluginConfig = JSON.stringify(ctx.root.config.plugins);
  const matchVectorStore = pluginConfig.match(
    /"defaultVectorStore":\s*"([^"]+)"/
  );
  return matchVectorStore ? matchVectorStore[1] : "未配置";
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
  const [platformName, modelName] =
    ctx.chatluna.config.defaultEmbeddings.split("/");
  const embeddings = await ctx.chatluna.createEmbeddings(
    platformName,
    modelName
  );
  const vectorStoreType = getVectorStoreType(ctx);
  switch (vectorStoreType) {
    case "faiss": {
    }
    case "redis": {
      const redisUrl = getRedisUrl(ctx);
      const vectorStore = await getRedisVectorStore(embeddings, {
        url: redisUrl,
      });
      return vectorStore;
    }
    case "milvus": {
      const milvusUrl = getMilvusUrl(ctx);
      const milvusUsername = getMilvusUsername(ctx);
      const milvusPassword = getMilvusPassword(ctx);
      const vectorStore = getMilvusVectorStore(embeddings, {
        url: milvusUrl,
        username: milvusUsername,
        password: milvusPassword,
      });
      return vectorStore;
    }
  }
}
