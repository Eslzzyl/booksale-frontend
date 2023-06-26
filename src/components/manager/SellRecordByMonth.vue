<template>
  <div class="container">
    <h2>销售记录-按月统计</h2>
    <Table border height="550" :columns="columns" :data="currSellInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="sellNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>
  
<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      sellNum: 0,
      sellInfo: [],
      currSellInfo: [],
      columns: [
        {
          title: '年',
          key: 'year'
        },
        {
          title: '月',
          key: 'month'
        },
        {
          title: '总销售额',
          key: 'price'
        },
        {
          title: "利润",
          key: "profit"
        },
      ],
    }
  },
  async mounted() {
    const that = this
    // 请求总量
    axios.post('/manager/salesdata/CDate').then((response) => {
      if (response.data.code === 1) {
        that.sellNum = response.data.data
        that.$Message.success('已获取到' + that.sellNum + '条销售记录信息')
      } else {
        that.$Message.error('请求销售记录信息失败！')
        console.log('请求销售记录信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求销售记录信息失败！')
      console.log(error)
    })
    // 请求第一页数据
    const pack = await that.request(1)
    if (pack) {
      that.updateItem(pack)
    }
    // 截取前10条记录
    this.currSellInfo = this.sellInfo.slice(0, 10)
  },
  methods: {
    changePage(page) {
      this.currSellInfo = this.sellInfo.slice((page - 1) * 10, page * 10)
    },
    // 向后端发出请求
    async request(page) {
      try {
        // 默认一页放10条记录
        let size = 10
        const response = await axios.post('/manager/salesdata/Date')

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
        obj.year = e.year
        obj.month = e.month
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