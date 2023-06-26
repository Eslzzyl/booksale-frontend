<template>
  <div class="container">
    <h2>用户管理</h2>
    <Table border height="550" :columns="columns" :data="currCart">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px" @click="remove(index)">删除用户</Button>
      </template>
    </Table>
    <Page :total="historyNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      userNum: 0,
      userInfo: [],
      columns: [
        {
          title: '账号',
          key: 'contact'
        },
        {
          title: "用户名",
          key: "name"
        },
        {
          title: "联系方式",
          key: "contact"
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        },
      ],
    }
  }
}
</script>