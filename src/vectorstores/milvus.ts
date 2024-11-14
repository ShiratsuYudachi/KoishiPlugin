export interface MilvusData {
  langchain_primaryid: string;
  langchain_text: string;
  langchain_vector: number[];
}

export async function getMilvusData(milvusUrl): Promise<MilvusData[]> {
  const client = new MilvusClient({
    address: getConfiguredMilvusUrl(ctx),
    database: "default",
  });
  const res = await client.query({
    collection_name: "chatluna_collection",
    output_fields: ["*"],
    limit: 100,
  });
  const res2 = await client.insert({
    collection_name: "chatluna_collection",
    data: [
      {
        langchain_primaryid: 2,
        langchain_text: "test",
        langchain_vector: new Array(1024).fill(1.0),
      },
    ],
  });
  console.log(res2);

  return res.data as unknown as MilvusData[];
}

export async function updateMilvusSingleEntry(
  ctx: Context,
  entryData: MilvusData
) {
  // const client = new MilvusClient({
  //   address: getConfiguredMilvusUrl(ctx),
  //   database: "default",
  // });
  // const res = await client.upsert({
  //   data: [entryData],
  //   collection_name: "chatluna_collection",
  // });
  return entryData;
}
