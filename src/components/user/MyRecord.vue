<template>
  <div class="container">
    <h2>购买记录</h2>
    <Table border height="600" :columns="columns" :data="historyInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
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
      historyNum: 0,
      columns: [
        {
          title: '书名',
          key: 'name'
        },
        {
          title: '出版社',
          key: 'pname'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '购买数量',
          key: 'count'
        },
        {
          title: '购买时间',
          key: 'time'
        },
      ],
      historyInfo: [
        {
          name: '测试书名',
          pname: '中华书局',
          price: 888,
          count: 114514,
          time: '2023年6月21日',
        },
      ],
    }
  },
  async mounted() {
    let that = this;
    // 请求第一页数据
    this.historyInfo = []
    const data = await that.request(1)
    const pack = data.purchase
    const num = data.historynum
    if (pack) {
      this.updateInfo(pack)
    }
    if (num) {
      that.historyNum = num
      that.$Message.success('获取到了' + num + '条购买记录')
    } else {
      that.$Message.error('未能获取到购买记录！')
    }
  },
  methods: {
    async changePage(page) {
      let that = this
      const data = await that.request(page)
      const pack = data.purchase

      if (pack) {
        that.updateInfo(pack)
      }

    },
    // 向后端发出请求
    async request(page) {
      // 默认一页放10本书
      let size = 10
      let that = this
      let contact = window.localStorage.getItem('contact')
      try {
        let response = await axios.post('/user/userHistory',
          {
            contact: contact,
            page: page,
            size: size,
          }
        )
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data
        } else {
          that.$Message.error('请求失败！')
          console.log('请求失败！')
        }
      } catch (error) {
        console.log(error);
      }
    },
    formatTimestamp(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}年${month}月${day}日`
    },
    updateInfo(pack) {
      this.historyInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.name = e.name
        obj.pname = e.pname
        obj.price = e.price
        obj.count = e.count
        obj.time = this.formatTimestamp(e.time)
        this.historyInfo.push(obj)
      })
    }
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