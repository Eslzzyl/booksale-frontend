<template>
  <div class="container">
    <Space direction="vertical" style="margin-bottom: 10px;">
      <h2>按书名查询销售记录</h2>
      <Input search enter-button v-model="bookName" placeholder="输入书名..." @on-search="search" />
    </Space>
    <Table border height="550" :columns="columns" :data="currSellInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="sellNum" :page-size="10" @on-change="changePage" show-total show-elevator></Page>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      bookName: '',
      sellInfo: [],
      currSellInfo: [],
      sellNum: 0,
      columns: [
        {
          title: '书籍ID',
          key: 'bid',
        },
        {
          title: '书名',
          key: 'name',
        },
        {
          title: '总销售额',
          key: 'price',
        },
        {
          title: '利润',
          key: 'profit'
        }
      ]
    }
  },
  methods: {
    changePage(page) {
      this.currSellInfo = this.sellInfo.slice((page - 1) * 10, page * 10)
    },
    async search() {
      const that = this
      console.log(that.bookName)
      const pack = await that.request()
      if (pack) {
        that.sellNum = pack.length
        that.updateItem(pack)
        that.currSellInfo = that.sellInfo.slice(0, 10)
      }
    },
    // 向后端发出请求
    async request() {
      const that = this
      try {
        // 默认一页放10条记录
        let size = 10
        const response = await axios.post('/manager/salesdata/OneBook', {
          BookName: that.bookName
        })
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data
        } else {
          // 请求失败
          that.$Message.error('请求销售记录信息失败！')
          console.log('请求销售记录信息失败！')
        }
      } catch (error) {
        that.$Message.error('请求销售记录信息失败！')
        console.log(error)
      }
    },
    updateItem(pack) {
      this.sellInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.bid = e.bid
        obj.name = this.bookName
        obj.price = e.price
        obj.profit = e.profit
        this.sellInfo.push(obj)
      })
    },
  }
}
</script>

<style scoped>
h2 {
  color: #2D8CF0;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>