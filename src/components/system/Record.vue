<template>
  <div class="container">
    <h2>销售记录表</h2>
    <Table border height="600" :columns="columns" :data="recordInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="recordNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>
    
<script>
import post from '@/axiosInstance.js'

export default {
  data() {
    return {
      recordNum: 0,
      columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '用户ID',
          key: 'uid'
        },
        {
          title: '书籍ID',
          key: 'bid'
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
        }
      ],
      recordInfo: [],
    }
  },
  mounted() {
    let that = this;
    // 请求图书总量
    post('/manager/purchasenum').then((response) => {
      if (response.data.code === 1) {
        that.recordNum = response.data.data
        that.$Message.success('已获取到' + that.recordNum + '条销售记录信息')
      } else {
        that.$Message.error('请求销售记录信息失败！')
        console.log('请求销售记录信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求销售记录信息失败！')
      console.log(error);
    });
    // 请求第一页数据
    this.recordInfo = []
    const pack = this.request(1)
    if (pack) {
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.uid = e.uid
        obj.bid = e.bid
        obj.price = e.price
        obj.count = e.count
        obj.time = this.formatTimestamp(e.time)
        this.recordInfo.push(obj)
      })
    }
  },
  methods: {
    changePage: (page) => {
      this.recordInfo = []
      const pack = this.request(page)
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.uid = e.uid
        obj.bid = e.bid
        obj.price = e.price
        obj.count = e.count
        obj.time = this.formatTimestamp(e.time)
        this.recordInfo.push(obj)
      })
    },
    // 向后端发出请求
    async request(page) {
      // 默认一页放10本书
      let size = 10
      let that = this
      await post('/manager/purchase',
        {
          page: page,
          size: size,
        }
      ).then((response) => {
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data.purchase
        } else {
          that.$Message.error('请求失败！')
          console.log('请求失败！')
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    formatTimestamp(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}年${month}月${day}日`
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