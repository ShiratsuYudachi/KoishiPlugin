<template>
  <k-layout>
    <el-container style="height: 100%;">
      <el-main class="container">
        <el-aside class="sidebar">
          <el-button>
            导入
          </el-button>
          <el-button>
            导出全部
          </el-button>
          <el-button>
            导出选择
          </el-button>
        </el-aside>
        <div class="main">
          <div class="operation-panel">
            <el-input v-model="filter" placeholder="请输入关键词"></el-input>
            <el-button @click="getVectorStoreData">查询</el-button>
            <el-button type="danger">批量删除</el-button>
          </div>
          <el-table :data="vectorStoreData" height="100%" table-layout="auto">
            <el-table-column type="selection"></el-table-column>
            <el-table-column property="key" label="Key" />
            <el-table-column property="content" label="Content" />
            <el-table-column show-overflow-tooltip property="contentVector" label="Content Vector" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="handleEdit(scope.row)">编辑</el-button>
                <el-button @click="handleDelete(scope.row)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
    <el-dialog v-model="onEditing" title="编辑">
      <div class="main">
        <el-input v-model="key" disabled />
        <el-input v-model="content" />
        <el-input v-model="contentVector" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" />
        <div class="operation-panel">
          <el-button type="primary" @click="handleUpdate">提交</el-button>
          <el-button type="danger" @click="onEditing = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </k-layout>
</template>

<script lang="ts" setup>
import { send } from '@koishijs/client'
import { ref } from 'vue'

interface VectorStoreData {
  key: string;
  content: string;
  contentVector: number[];
}

const vectorStoreData = ref<VectorStoreData[]>()
const filter = ref<string>();

const onEditing = ref<boolean>(false);

const originalData = ref<VectorStoreData>();
const key = ref<string>('');
const content = ref<string>('');
const contentVector = ref<string>('');

async function getVectorStoreData() {
  contentVector.value = await send('vectorstoremanagenent/get-vector-store-data')
}

function handleEdit(data: VectorStoreData) {
  onEditing.value = true;

  originalData.value = data
  key.value = data.key;
  content.value = data.content;
  contentVector.value = data.contentVector.toString();
}
async function handleUpdate() {
  await send('vectorstoremanagenent/update-single-entry',
    originalData.value.key,
    {
      key: key.value,
      content = content.value,
      contentVector = stringToNumberArray(contentVector.value)
    },
  );
  onEditing.value = false;
  await getVectorStoreData();
}

async function handleDelete(data: VectorStoreData) {
  await send('vectorstoremanagenent/delete-single-entry', data.key);
  await getVectorStoreData();
}

function stringToNumberArray(string: string) {
  return string.split(',').map(numberString => parseFloat(numberString));
}

</script>

<style lang="css">
.container {
  display: flex;
  gap: 16px;
  flex-direction: row;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.el-button+.el-button {
  margin-left: 0px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.operation-panel {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
}

@media (max-width:640px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: column;
  }
}
</style>
