<template>
  <div class="container">
    <h2>出版商表</h2>
    <Table border height="600" :columns="columns" :data="publisherInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="publisherNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>
    
<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      publisherNum: 0,
      columns: [
        {
          title: '出版商ID',
          key: 'id'
        },
        {
          title: '出版商',
          key: 'name'
        },
        {
          title: '联系方式',
          key: 'contact'
        }
      ],
      publisherInfo: [],
    }
  },
  async mounted() {
    let that = this;
    // 请求图书总量
    axios.post('/manager/publishernum').then((response) => {
      if (response.data.code === 1) {
        that.publisherNum = response.data.data
        that.$Message.success('已获取到' + that.publisherNum + '条出版商信息')
      } else {
        that.$Message.error('请求出版商信息失败！')
        console.log('请求出版商信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求出版商信息失败！')
      console.log(error);
    });
    // 请求第一页数据
    const pack = await this.request(1)
    if (pack) {
      that.updateInfo(pack)
    }
  },
  methods: {
    async changePage (page) {
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
        const response = await axios.post('/manager/publisher',
          {
            page: page,
            size: size,
          }
        )
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data.publisher
        } else {
          that.$Message.error('请求失败！')
          console.log('请求失败！')
        }
      } catch (error) {
        that.$Message.error('请求失败！')
        console.log(error);
      }
    },
    updateInfo(pack) {
      this.publisherInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.contact = e.contact
        this.publisherInfo.push(obj)
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