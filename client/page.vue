<template>
  <k-layout>
    <el-container>
      <el-header>
        <div>当前使用的向量数据库: {{ configuredVectorStore }} </div>
        <div>地址: {{ vectorStoreAddress }}</div>
        <el-button @click="refreshVectorStoreInfo">
          刷新
        </el-button>
      </el-header>
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
        <el-table class="main" :data="tableData" table-layout="auto">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="Date">
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column property="name" label="Name" />
          <el-table-column property="address" label="Address" />
        </el-table>
      </el-main>
    </el-container>
  </k-layout>
</template>

<script lang="ts" setup>
import { send } from '@koishijs/client'
import { ref } from 'vue'

const configuredVectorStore = ref<string>()
const vectorStoreAddress = ref<string>()

function refreshVectorStoreInfo() {
  send('getConfiguredVectorStore').then(data => {
    configuredVectorStore.value = data
  })
  send('getVectorStoreAddress').then(data => {
    vectorStoreAddress.value = data
  })
}

send('getVectorStoreData').then(data => {

})
const tableData = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
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
