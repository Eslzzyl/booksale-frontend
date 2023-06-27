<template>
  <div class="container">
    <Space style="margin-bottom: 20px;">
      <h2>入库记录查询</h2>
      <Button id="insert-btn" type="primary" @click="insertModal = true">添加入库信息</Button>
      <Modal @on-ok="insert" v-model="insertModal">
        <Space direction="vertical">
          <Space><span>书籍ID</span><Input v-model="insertInfo.id" :placeholder="insertInfo.id"></Input></Space>
          <Space><span>书名</span><Input v-model="insertInfo.name" :placeholder="insertInfo.name"></Input></Space>
          <Space><span>作者</span><Input v-model="insertInfo.author" :placeholder="insertInfo.author"></Input></Space>
          <Space><span>新增数量</span><Input v-model="insertInfo.inventory" :placeholder="insertInfo.inventory"></Input></Space>
          <Space><span>类别</span><Input v-model="insertInfo.type" :placeholder="insertInfo.type"></Input></Space>
          <Space><span>属性</span><Input v-model="insertInfo.attribute" :placeholder="insertInfo.attribute"></Input></Space>
          <Space><span>ISBN</span><Input v-model="insertInfo.isbn" :placeholder="insertInfo.isbn"></Input></Space>
          <Space><span>进价</span><Input v-model="insertInfo.price" :placeholder="insertInfo.price"></Input></Space>
          <Space><span>出版商ID</span><Input v-model="insertInfo.pid" :placeholder="insertInfo.pid"></Input></Space>
          <Space><span>供应商ID</span><Input v-model="insertInfo.sid" :placeholder="insertInfo.sid"></Input></Space>
        </Space>
      </Modal>
    </Space>
    <Table border height="550" :columns="columns" :data="inboundInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="inboundNum" :page-size="10" @on-change="changePage" show-total show-elevator></Page>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      inboundNum: 0,
      inboundInfo: [],
      insertModal: false,
      insertInfo: {
        id: '',
        name: '',
        author: '',
        inventory: '',
        attribute: '',
        type: '',
        isbn: '',
        price: '',
        pid: '',
        sid: '',
      },
      columns: [
        {
          title: '入库ID',
          key: 'id',
          resizable: true
        },
        {
          title: '书籍',
          key: 'name',
          resizable: true
        },
        {
          title: "数量",
          key: "count",
          resizable: true
        },
        {
          title: '供应商',
          key: 'sid',
          resizable: true
        },
        {
          title: '价格',
          key: 'price',
          width: 80,
          resizable: true
        },
        {
          title: '入库时间',
          key: 'time',
          resizable: true
        },
      ],
    }
  },
  async mounted() {
    const that = this
    // 请求总量
    axios.post('/manager/inboundnum').then((response) => {
      if (response.data.code === 1) {
        that.inboundNum = response.data.data
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
      this.inboundInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.count = e.count
        obj.sid = e.sname
        obj.price = e.price
        obj.time = this.formatTimestamp(e.time)
        this.inboundInfo.push(obj)
      })
    },
    insert() {
      let id = this.insertInfo.id
      let name = this.insertInfo.name
      let author = this.insertInfo.author
      let inventory = this.insertInfo.inventory
      let type = this.insertInfo.type
      let attribute = this.insertInfo.attribute
      let isbn = this.insertInfo.isbn
      let price = this.insertInfo.price
      let sid = this.insertInfo.sid
      let pid = this.insertInfo.pid
      if (id === '' || name === '' || author === '' || inventory === '' || type === '' || attribute === '' || isbn === '' || price === '' || sid === '' || pid === '') {
        this.$Message.error('请填写完整的信息')
        return
      }
      axios.post('/manager/inbound/addBook', { id, name, author, inventory, type, attribute, isbn, price, sid, pid }).then((response) => {
        if (response.data.code === 1) {
          this.inboundNum += 1
          this.inboundInfo.push({
            id, name, inventory, sid, price
          })
          // this.insertInfo = []
          this.$Message.success('添加入库信息成功！')
        } else {
          this.$Message.error('添加入库信息失败！')
        }
      }).catch((error) => {
        this.$Message.error('添加入库信息失败！')
        console.log(error)
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

#insert-btn {
  position: absolute;
  right: 5%;
}
</style>