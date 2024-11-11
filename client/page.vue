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
            <el-button @click="getTableData" :disabled="filter.length == 0">查询</el-button>
            <el-button type="danger">批量删除</el-button>
          </div>
          <el-table :data="tableData" height="100%" table-layout="auto">
            <el-table-column type="selection"></el-table-column>
            <el-table-column property="pageContent" label="Page Content" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="deleteDocument(scope.row)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </k-layout>
</template>

<script lang="ts" setup>
import type { Document } from '@langchain/core/documents'
import { send } from '@koishijs/client'

import { ref } from 'vue'


const tableData = ref<Document[]>([])
const filter = ref<string>('');

async function getTableData() {
  tableData.value = await send('vectorstoremanagement/getDocuments', filter.value)
}

async function deleteDocument(data: Document) {
  // await send('vectorstoremanagement/deleteSingleDocument', data.id)
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
