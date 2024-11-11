import "@koishijs/plugin-console";

import { resolve } from "path";

import { Context } from "koishi";
import {
  ChatLunaService,
  ChatLunaPlugin,
} from "koishi-plugin-chatluna/services/chat";
import { getVectorStore } from "./utils";
import { VectorStore } from "@langchain/core/vectorstores";
import { DocumentInterface } from "@langchain/core/documents";

declare module "koishi" {
  interface Context {
    chatluna: ChatLunaService;
  }
}
declare module "@koishijs/plugin-console" {
  interface Events {
    "vectorstoremanagement/getDocuments"(
      filter: string
    ): Promise<DocumentInterface[]>;
  }
}

export const name = "chatluna-vector-store-management";
export const inject = ["console", "chatluna"];

export function apply(ctx: Context, config: ChatLunaPlugin.Config) {
  const plugin = new ChatLunaPlugin(
    ctx,
    config,
    "vector-store-management",
    false
  );

  ctx.on("ready", async () => {
    plugin.registerToService();
  });

  ctx.console.addListener(
    "vectorstoremanagement/getDocuments",
    async (filter) => {
      const vectorStore = await getVectorStore(ctx);
      return vectorStore.similaritySearch(filter);
    }
  );

  ctx.inject(["console"], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, "../client/index.ts"),
      prod: resolve(__dirname, "../dist"),
    });
  });
}
