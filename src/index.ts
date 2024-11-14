import "@koishijs/plugin-console";
import { Context } from "koishi";
import { ChatLunaService } from "koishi-plugin-chatluna/services/chat";
import { resolve } from "path";
import { getVectorStore, VectorStoreData } from "./utils";

declare module "koishi" {
  interface Context {
    chatluna: ChatLunaService;
  }
}

declare module "@koishijs/plugin-console" {
  interface Events {
    "vectorstoremanagenent/get-vector-store-data"(): Promise<VectorStoreData[]>;
    "vectorstoremanagenent/update-single-entry"(
      key: string,
      data: VectorStoreData
    ): Promise;
    "vectorstoremanagenent/delete-single-entry"(key: string): Promise;
  }
}

export const name = "chatluna-vector-store-management";
export const inject = ["console", "chatluna"];

export function apply(ctx: Context) {
  ctx.console.addListener(
    "vectorstoremanagenent/get-vector-store-data",
    async () => {
      const vectorStore = await getVectorStore(ctx);
      return vectorStore.getData();
    }
  );

  ctx.console.addListener(
    "vectorstoremanagenent/update-single-entry",
    async (key, data) => {
      const vectorStore = await getVectorStore(ctx);
      return vectorStore.updateSingle(key, data);
    }
  );

  ctx.console.addListener(
    "vectorstoremanagenent/delete-single-entry",
    async (key) => {
      const vectorStore = await getVectorStore(ctx);
      return vectorStore.deleteSingle(key);
    }
  );

  ctx.inject(["console"], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, "../client/index.ts"),
      prod: resolve(__dirname, "../dist"),
    });
  });
}
