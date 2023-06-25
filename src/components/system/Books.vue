<template>
  <div class="container">
    <h2>书籍表</h2>
    <Table border height="600" :columns="columns" :data="bookInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="bookNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>
  
<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      bookNum: 0,
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
      bookInfo: [],
    }
  },
  mounted() {
    let that = this;
    // 请求图书总量
    axios.post('/manager/booknum').then((response) => {
      if (response.data.code === 1) {
        that.bookNum = response.data.data
        that.$Message.success('已获取到' + that.bookNum + '条书籍信息')
      } else {
        that.$Message.error('请求书籍信息失败！')
        console.log('请求书籍信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求书籍信息失败！')
      console.log(error);
    });
    // 请求第一页数据
    this.bookInfo = []
    const pack = this.request(1)
    if (pack) {
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
        this.bookInfo.push(obj)
      })
    }
  },
  methods: {
    changePage: (page) => {
      this.bookInfo = []
      const pack = this.request(page)
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
        this.bookInfo.push(obj)
      })
    },
    // 向后端发出请求
    request(page) {
      // 默认一页放10本书
      let size = 10
      let that = this
      axios.post('/manager/book',
        {
          page: page,
          size: size,
        }
      ).then((response) => {
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data
        } else {
          that.$Message.error('请求失败！')
          console.log('请求失败！')
        }
      }).catch((error) => {
        console.log(error);
      });
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