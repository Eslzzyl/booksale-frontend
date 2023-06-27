<template>
  <div class="container">
    <Space style="margin-bottom: 20px;">
      <h2>供应商管理</h2>
      <Button id="insert-btn" type="primary" @click="insertModal = true">添加供应商</Button>
      <Modal @on-ok="insert" v-model="insertModal">
        <Space direction="vertical">
          <Space><span>供应商ID</span><Input v-model="insertInfo.id" :placeholder="insertInfo.id"></Input></Space>
          <Space><span>供应商</span><Input v-model="insertInfo.name" :placeholder="insertInfo.name"></Input></Space>
          <Space><span>联系方式</span><Input v-model="insertInfo.contact" :placeholder="insertInfo.contact"></Input></Space>
          <Space><span>地址</span><Input v-model="insertInfo.address" :placeholder="insertInfo.address"></Input></Space>
        </Space>
      </Modal>
    </Space>
    <Table border height="550" :columns="columns" :data="supplierInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px"
          @click="currInfo = supplierInfo[index]; modifyModal = true">修改</Button>
        <Modal @on-ok="modify" v-model="modifyModal">
          <Space direction="vertical">
            <Space><span>供应商ID</span><Input v-model="currInfo.id" :placeholder="currInfo.id"></Input></Space>
            <Space><span>供应商</span><Input v-model="currInfo.name" :placeholder="currInfo.name"></Input></Space>
            <Space><span>联系方式</span><Input v-model="currInfo.contact" :placeholder="currInfo.contact"></Input></Space>
            <Space><span>地址</span><Input v-model="currInfo.address" :placeholder="currInfo.address"></Input></Space>
          </Space>
        </Modal>
        <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <Page :total="supplierNum" :page-size="10" @on-change="changePage" show-total show-elevator></Page>
  </div>
</template>
  
<script>
import axios from '@/axiosInstance.js'

import { Space, Input } from 'view-ui-plus'

export default {
  data() {
    return {
      supplierNum: 0,
      supplierInfo: [],
      modifyModal: false,
      insertModal: false,
      currInfo: {
        id: '',
        name: '',
        contact: '',
        address: '',
      },
      insertInfo: {
        id: '',
        name: '',
        contact: '',
        address: '',
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          resizable: true
        },
        {
          title: '供应商',
          key: 'name',
          resizable: true
        },
        {
          title: "联系方式",
          key: "contact",
          resizable: true
        },
        {
          title: '地址',
          key: 'address',
          resizable: true
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          resizable: true
        },
      ],
    }
  },
  async mounted() {
    const that = this
    // 请求总量
    axios.post('/manager/suppliersnum').then((response) => {
      if (response.data.code === 1) {
        that.supplierNum = response.data.data
        that.$Message.success('已获取到' + that.supplierNum + '条供应商信息')
      } else {
        that.$Message.error('请求供应商信息失败！')
        console.log('请求供应商信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求供应商信息失败！')
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
        const response = await axios.post('/manager/suppliers/search', { page, size })

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
      this.supplierInfo = []
      pack.forEach((e) => {
        let obj = {}
        obj.id = e.id
        obj.name = e.name
        obj.contact = e.contact
        obj.address = e.address
        this.supplierInfo.push(obj)
      })
    },
    remove(index) {
      let suppliers = []
      suppliers.push(this.supplierInfo[index].id)
      axios.post('/manager/suppliers/delete', { suppliers }).then((response) => {
        if (response.data.code === 1) {
          this.supplierInfo.splice(index, 1)
          this.supplierNum -= 1
          this.$Message.success('删除供应商成功！')
        } else {
          this.$Message.error('删除供应商失败！')
        }
      }).catch((error) => {
        this.$Message.error('删除供应商失败！')
        console.log(error)
      })
    },
    modify() {
      let id = this.currInfo.id
      let name = this.currInfo.name
      let contact = this.currInfo.contact
      let address = this.currInfo.address
      if (id === '' || name === '' || contact === '' || address === '') {
        this.$Message.error('请填写完整的信息')
        return
      }
      axios.post('/manager/suppliers/change', { id, name, contact, address }).then((response) => {
        if (response.data.code === 1) {
          this.$Message.success('修改供应商信息成功！')
        } else {
          this.$Message.error('修改供应商信息失败！')
        }
      }).catch((error) => {
        this.$Message.error('修改供应商信息失败！')
        console.log(error)
      })
    },
    insert() {
      let id = this.insertInfo.id
      let name = this.insertInfo.name
      let contact = this.insertInfo.contact
      let address = this.insertInfo.address
      if (id === '' || name === '' || contact === '' || address === '') {
        this.$Message.error('请填写完整的信息')
        return
      }
      axios.post('/manager/suppliers/add', { id, name, contact, address }).then((response) => {
        if (response.data.code === 1) {
          this.supplierNum += 1
          this.supplierInfo.push({
            id, name, contact, address
          })
          this.$Message.success('添加供应商成功！')
        } else {
          this.$Message.error('添加供应商失败！')
        }
      }).catch((error) => {
        this.$Message.error('添加供应商失败！')
        console.log(error)
      })
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