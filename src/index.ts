import { Context } from "koishi";
import {} from "@koishijs/plugin-console";
import { resolve } from "path";

declare module "@koishijs/plugin-console" {
  interface Events {
    "getConfiguredVectorStore"(): string;
    "getVectorStoreAddress"(): string;
    "getVectorStoreData"(): string[];
  }
}

export const name = "chatluna-vector-store-management";
export const inject = ["console", "chatluna"];

export function apply(ctx: Context) {
  function getConfiguredVectorStore() {
    const pluginConfig = JSON.stringify(ctx.root.config.plugins);
    const matchVectorStore = pluginConfig.match(
      /"defaultVectorStore":\s*"([^"]+)"/
    );
    return matchVectorStore ? matchVectorStore[1] : "未配置";
  }

  function getConfiguredRedisUrl() {
    const pluginConfig = JSON.stringify(ctx.root.config.plugins);
    const matchRedisUrl = pluginConfig.match(/"redisUrl":\s*"([^"]+)"/);
    return matchRedisUrl ? matchRedisUrl[1] : "redis://127.0.0.1:6379";
  }

  function getConfiguredMilvusUrl() {
    const pluginConfig = JSON.stringify(ctx.root.config.plugins);
    const matchMilvusUrl = pluginConfig.match(/"milvusUrl":\s*"([^"]+)"/);
    return matchMilvusUrl ? matchMilvusUrl[1] : "http://127.0.0.1:19530";
  }

  function getRedisData() {
    return;
  }
  function getMilvusData() {
    return;
  }

  ctx.console.addListener("getConfiguredVectorStore", getConfiguredVectorStore);
  ctx.console.addListener("getVectorStoreAddress", () => {
    const configuredVectorStore = getConfiguredVectorStore();
    switch (configuredVectorStore) {
      case "redis": {
        return getConfiguredRedisUrl();
      }
      case "milvus": {
        return getConfiguredMilvusUrl();
      }
      default: {
        return "未配置";
      }
    }
  });
  ctx.console.addListener("getVectorStoreData", () => {
    const configuredVectorStore = getConfiguredVectorStore();
    switch (configuredVectorStore) {
      case "redis": {
        return getRedisData();
      }
      case "milvus": {
        return getMilvusData();
      }
      default: {
        return ["未配置"];
      }
    }
  });

  ctx.inject(["console"], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, "../client/index.ts"),
      prod: resolve(__dirname, "../dist"),
    });
  });
}
