<template>
  <div class="container">
    <h2>最热10本书</h2>
    <Table border height="600" :columns="columns" :data="hottestInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="hottestNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      hottestNum: 10,   // 最热10本书
      columns: [
        {
          title: '书籍ID',
          key: 'id'
        },
        {
          title: '书名',
          key: 'name'
        },
        {
          title: '作者',
          key: 'author'
        },
        {
          title: '库存数量',
          key: 'count'
        },
        {
          title: '属性',
          key: 'attribute'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: 'ISBN',
          key: 'isbn'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '出版商ID',
          key: 'pid'
        },
        {
          title: '供应商ID',
          key: 'sid'
        },
        {
          title: '出版商',
          key: 'pname'
        },
        {
          title: '供应商',
          key: 'sname'
        },
      ],
      hottestInfo: [],
    }
  },
  async mounted() {
    // 请求第一页数据
    const that = this
    const pack = await that.request(1)
    if (pack) {
      that.updateItem(pack)
    }
  },
  methods: {
    async changePage (page) {
      const that = this
      const pack = await that.request(page)
      if (pack) {
        that.updateItem(pack)
      }
    },
    // 向后端发出请求
    async request(page) {
      // 默认一页放10本书
      let size = 10
      let that = this
      try {
        const response = await axios.post('/manager/hottable', {
          params: {
            page: page,
            size: size
          }
        })
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
    updateItem(pack) {
      this.hottestInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.author = e.author
        obj.count = e.count
        obj.attribute = e.attribute
        obj.type = e.type
        obj.isbn = e.isbn
        obj.price = e.price
        obj.pid = e.pid
        obj.sid = e.sid
        obj.pname = e.pname
        obj.sname = e.sname
        this.hottestInfo.push(obj)
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