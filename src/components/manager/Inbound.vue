<template>
  <div class="container">
    <h2>入库记录查询</h2>
    <Table border height="550" :columns="columns" :data="inboundInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="inboundNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      inboundNum: 0,
      inboundInfo: [],
      columns: [
        {
          title: '书籍ID',
          key: 'id'
        },
        {
          title: '书籍',
          key: 'name'
        },
        {
          title: "数量",
          key: "count"
        },
        {
          title: '供应商',
          key: 'sid'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '入库时间',
          key: 'time'
        },
      ],
    }
  },
  async mounted() {
    const that = this
    // 请求总量
    axios.post('/manager/inboundnum').then((response) => {
      if (response.data.code === 1) {
        that.userNum = response.data.data
        that.$Message.success('已获取到' + that.inboundNum + '条入库记录信息')
      } else {
        that.$Message.error('请求入库记录信息失败！')
        console.log('请求入库记录信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求入库记录信息失败！')
      console.log(error)
    })
    // 请求第一页数据
    const pack = await that.request(1)
    if (pack) {
      that.updateItem(pack)
    }
  },
  methods: {
    async changePage(page) {
      let that = this
      const pack = await that.request(page)
      if (pack) {
        that.updateItem(pack)
      }
    },
    // 向后端发出请求
    async request(page) {
      try {
        // 默认一页放10条记录
        let size = 10
        const response = await axios.post('/manager/inbound/record', { page, size })

        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data
        } else {
          // 请求失败
          that.$Message.error('请求入库记录信息失败！')
          console.log('请求入库记录信息失败！')
        }
      } catch (error) {
        that.$Message.error('请求入库记录信息失败！')
        console.log(error)
      }
    },
    updateItem(pack) {
      this.userInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.count = e.count
        obj.sid = e.sid
        obj.price = e.price
        obj.time = this.formatTimestamp(e.time)
        this.userInfo.push(obj)
      })
    },
    formatTimestamp(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}年${month}月${day}日`
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