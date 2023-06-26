<template>
  <div class="container">
    <h2>用户管理</h2>
    <Table border height="550" :columns="columns" :data="userInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template #action="{ row, index }">
        <Button type="error" size="small" style="margin-right: 5px" @click="remove(index)">删除用户</Button>
      </template>
    </Table>
    <Page :total="userNum" :page-size="10" @on-change="changePage" show-total show-elevator></Page>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      userNum: 0,
      userInfo: [],
      columns: [
        {
          title: '用户类型',
          key: 'type',
          resizable: true
        },
        {
          title: '账号',
          key: 'contact',
          resizable: true
        },
        {
          title: "用户名",
          key: "name",
          resizable: true
        },
        {
          title: '性别',
          key: 'sex',
          resizable: true
        },
        {
          title: '年龄',
          key: 'age',
          resizable: true
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        },
      ],
    }
  },
  async mounted() {
    const that = this
    // 请求用户总量
    axios.post('/manager/accountnum').then((response) => {
      if (response.data.code === 1) {
        that.userNum = response.data.data
        that.$Message.success('已获取到' + that.userNum + '条用户账户信息')
      } else {
        that.$Message.error('请求用户账户信息失败！')
        console.log('请求用户账户信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求用户账户信息失败！')
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
        const response = await axios.post('/manager/user/search', {page, size})

        // 请求成功
        if (response.data.code === 1) {
          console.log('请求成功')
          return response.data.data
        } else {
          // 请求失败
          that.$Message.error('请求用户账户信息失败！')
          console.log('请求用户账户信息失败！')
        }
      } catch (error) {
        that.$Message.error('请求用户账户信息失败！')
        console.log(error)
      }
    },
    updateItem(pack) {
      this.userInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.contact = e.contact
        obj.name = e.name
        obj.type = e.type
        obj.sex = (e.sex === '') ? '保密' : e.sex
        obj.age = e.age
        this.userInfo.push(obj)
      })
    },
    remove(index) {
      let user = []
      user.push(this.userInfo[index].contact)
      axios.post('/manager/user/delete', {user}).then((response) => {
        if (response.data.code === 1) {
          this.userInfo.splice(index, 1)
          this.userNum -= 1
          this.$Message.success('删除用户成功！')
        } else {
          this.$Message.error('删除用户失败！')
        }
      }).catch((error) => {
        this.$Message.error('删除用户失败！')
        console.log(error)
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