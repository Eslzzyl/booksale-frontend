<template>
  <div class="container">
    <h2>销售记录表</h2>
    <Table border height="600" :columns="columns" :data="recordInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="recordNum" :page-size="10" @on-change="changePage" show-total show-elevator></Page>
  </div>
</template>
    
<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      recordNum: 0,
      columns: [
        {
          title: 'ID',
          key: 'id',
          resizable: true
        },
        {
          title: '用户ID',
          key: 'uid',
          resizable: true
        },
        {
          title: '书籍ID',
          key: 'bid',
          resizable: true
        },
        {
          title: '价格',
          key: 'price',
          width: 80,
          resizable: true
        },
        {
          title: '购买数量',
          key: 'count',
          resizable: true
        },
        {
          title: '购买时间',
          key: 'time',
          resizable: true
        }
      ],
      recordInfo: [],
    }
  },
  async mounted() {
    let that = this;
    // 请求图书总量
    axios.post('/manager/purchasenum').then((response) => {
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
    const pack = await that.request(1)
    if (pack) {
      that.updateInfo(pack)
    }
  },
  methods: {
    async changePage(page) {
      const that = this
      const pack = await that.request(page)
      if (pack) {
        that.updateInfo(pack)
      }
    },
    // 向后端发出请求
    async request(page) {
      // 默认一页放10本书
      let size = 10
      let that = this
      try {
        const response = await axios.post('/manager/purchase',
          {
            page: page,
            size: size,
          }
        );
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data.purchase
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
      this.recordInfo = []
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