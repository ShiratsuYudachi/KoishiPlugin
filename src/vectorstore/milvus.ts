import { ChatHubBaseEmbeddings } from "koishi-plugin-chatluna/llm-core/platform/model";

import {
  Milvus,
  MilvusLibArgs,
} from "@langchain/community/vectorstores/milvus";

export function getMilvusVectorStore(
  embeddings: ChatHubBaseEmbeddings,
  milvusOptions: MilvusLibArgs
) {
  const vectorStore = new Milvus(embeddings, {
    collectionName: "chatluna_collection",
    textFieldMaxLength: 3000,
    ...milvusOptions,
  });
  return vectorStore;
}
