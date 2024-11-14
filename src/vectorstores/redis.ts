import { createClient, RedisClientType } from "redis";
import { VectorStoreData } from "../utils";

export interface RedisData {
  key: string;
  content_vector: Array<number>;
  metadata: string;
  content: string;
}

export class RedisVectorStore {
  client: RedisClientType;
  constructor(client: RedisClientType) {
    this.client = client;
  }

  async getData(): Promise<VectorStoreData[]> {
    let cursor = 0;
    let collectedKeys = [];
    do {
      const scanResult = await this.client.scan(cursor);
      cursor = scanResult.cursor;
      collectedKeys = collectedKeys.concat(scanResult.keys);
    } while (cursor !== 0);

    const originalData = await Promise.all(
      collectedKeys.map((key) => this.client.hGetAll(key))
    );

    const requiredData = collectedKeys.map((key, index) => ({
      key,
      content: originalData[index].content,
      contentVector: this.decodeFloat32Buffer(
        originalData[index].content_vector
      ),
    }));

    return requiredData;
  }

  async updateSingle(key: string, entryData: VectorStoreData) {
    if (key != entryData.key) {
      await this.client.del(key);
    }
    return await this.client.hSet(entryData.key, {
      content: entryData.content,
      content_vector: Buffer.from(
        new Float32Array(entryData.contentVector).buffer
      ),
    });
  }

  async deleteSingle(key: string) {
    return await this.client.del(key);
  }

  decodeFloat32Buffer(bufferString: string) {
    const buffer = Buffer.from(bufferString, "utf-8");
    const floatArray = new Float32Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.length / Float32Array.BYTES_PER_ELEMENT
    );
    return Array.from(floatArray);
  }
}
