<template>
  <div class="container">
    <h2>搜索书籍</h2>
    <Form ref="bookInfoInput" :model="bookInfoInput" inline>
      <span class="note">输入你希望查询的书籍信息（所有字段均可为空）</span>
      <FormItem prop="account">
        <Space direction="horizontal" type="flex" size="large">
          <Input type="text" v-model="bookInfoInput.name" clearable placeholder="书名" />
          <Input type="text" v-model="bookInfoInput.author" clearable placeholder="作者" />
          <Input type="text" v-model="bookInfoInput.attribute" clearable placeholder="属性" />
          <Input type="text" v-model="bookInfoInput.type" clearable placeholder="类型" />
          <Input type="text" v-model="bookInfoInput.pname" clearable placeholder="出版社" />
        </Space>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="handleSubmit('bookInfoInput')">查找</Button>
      </FormItem>
    </Form>
    <Table stripe border height="550" :columns="columns" :data="currBooksInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
        <Button type="primary" size="small" @click="putCart(index)">加购</Button>
      </template>
    </Table>
    <Page :total="bookNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>

<script>
import { Button } from 'view-ui-plus'
import axios from '@/axiosInstance.js'

export default {
  name: 'SearchBook',
  data() {
    return {
      bookNum: 0,    // 图书的总量
      loading: false,
      bookInfoInput: {
        name: '',
        author: '',
        attribute: '',
        type: '',
        pname: '',
      },
      columns: [
        {
          title: '书名',
          key: 'name'
        },
        {
          title: '作者',
          key: 'author'
        },
        {
          title: '标签',
          key: 'attribute'
        },
        {
          title: '类型',
          key: 'type',
        },
        {
          title: '出版社',
          key: 'pname'
        },
        {
          title: '价格',
          key: 'price',
          sortable: true,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        },
      ],
      // 用来保存查询到的书目信息
      currBooksInfo: [
        {
          id: "0001",
          name: "测试书名",
          author: "Eslzzyl",
          inventory: 999,
          attribute: "测试标签",
          type: "测试类别",
          price: 888,
          pid: "1234",
          sid: "4321",
          pname: "中华书局",
          sname: "亚马逊",
          isbn: "123asdzxcqwe",
        }
      ],
    }
  },
  mounted() {
    let that = this;
    // 请求图书总量
    axios.post('/user/booknum').then((response) => {
      if (response.data.code === 1) {
        that.bookNum = response.data.data
        that.$Message.success('已获取到' + that.bookNum + '本图书信息')
      } else {
        that.$Message.error('请求图书信息失败！')
        console.log('请求图书信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求图书信息失败！')
      console.log(error);
    });
    this.currBooksInfo = []
    // 请求第一页数据
    const pack = this.request(1)
    if (pack) {
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.author = e.author
        obj.inventory = e.inventory
        obj.attribute = e.attribute
        obj.type = e.type
        obj.price = e.price
        obj.pid = e.pid
        obj.sid = e.sid
        obj.pname = e.pname
        obj.sname = e.sname
        obj.isbn = e.isbn
        that.currBooksInfo.push(obj)
      })
    }
  },
  methods: {
    handleSubmit(info) {
      let name = info.name
      let author = info.author
      let attribute = info.attribute
      let type = info.type
      let pname = info.pname
      this.loading = true
      this.currBooksInfo = []

      const pack = this.request(1, name, author, attribute, type, pname)

      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.author = e.author
        obj.inventory = e.inventory
        obj.attribute = e.attribute
        obj.type = e.type
        obj.price = e.price
        obj.pid = e.pid
        obj.sid = e.sid
        obj.pname = e.pname
        obj.sname = e.sname
        obj.isbn = e.isbn
        that.currBooksInfo.push(obj)
      })
      this.loading = false
    },
    // 使用模态窗口展示书籍信息
    show(index) {
      this.$Modal.info({
        title: '书籍信息',
        width: '600',
        content: `
          书名：${this.currBooksInfo[index].name}<br>
          作者：${this.currBooksInfo[index].author}<br>
          属性：${this.currBooksInfo[index].attribute}<br>
          类型：${this.currBooksInfo[index].type}<br>
          出版社：${this.currBooksInfo[index].pname}<br>
          价格：${this.currBooksInfo[index].price}<br>
          供应商：${this.currBooksInfo[index].sname}<br>
      `})
    },
    // 加入购物车，实际上是写入window.localStorage
    putCart(index) {
      const bookId = this.currBooksInfo[index].id
      const bookName = this.currBooksInfo[index].name
      const bookPrice = this.currBooksInfo[index].price
      let cart = window.localStorage.cart
      if (cart) {
        cart = JSON.parse(cart)
        if (cart[bookId]) {
          cart[bookId].count += 1
        } else {
          cart[bookId].count = 1
          cart[bookId].name = bookName
          cart[bookId].price = bookPrice
        }
      } else {
        cart = {}
        cart[bookId] = 1
        cart[bookId].name = bookName
        cart[bookId].price = bookPrice
      }
      window.localStorage.cart = JSON.stringify(cart)
    },
    // 向后端发出请求
    request(page, name = '', author = '', attribute = '', type = '', sname = '', pname = '') {
      // 默认一页放10本书
      let size = 10
      var that = this
      axios.get('/user/searchBook',
        {
          name: name,
          author: author,
          attribute: attribute,
          type: type,
          sname: sname,
          pname: pname,
          page: page,
          size: size,
        }
      ).then((response) => {
        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功，请求到' + response.data.data.length + '本书目信息')
          return response.data.data
        } else {
          that.$Message.error('请求失败！')
          console.log('请求失败！')
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    changePage: (page) => {
      let name = this.currBooksInfo.name
      let author = this.currBooksInfo.author
      let attribute = this.currBooksInfo.attribute
      let type = this.currBooksInfo.type
      let pname = this.currBooksInfo.pname
      let sname = ''    // 用户无需关心供应商
      this.request(page, name, author, attribute, type, sname, pname)
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