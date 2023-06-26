<template>
    <div class="container">
      <h2>供应商表</h2>
      <Table border height="600" :columns="columns" :data="supplierInfo">
        <template #name="{ row }">
          <strong>{{ row.name }}</strong>
        </template>
      </Table>
      <Page :total="supplierNum" :page-size="10" @on-change="changePage" show-total></Page>
    </div>
  </template>
      
  <script>
  import axios from '@/axiosInstance.js'
  
  export default {
    data() {
      return {
        supplierNum: 0,
        columns: [
          {
            title: '供应商ID',
            key: 'id'
          },
          {
            title: '供应商',
            key: 'name'
          },
          {
            title: '地址',
            key: 'address'
          },
          {
            title: '联系方式',
            key: 'contact'
          }
        ],
        supplierInfo: [],
      }
    },
    async mounted() {
      const that = this;
      // 请求图书总量
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
        console.log(error);
      });
      // 请求第一页数据
      const pack = that.request(1)
      if (pack) {
        that.updateInfo(pack)
      }
    },
    methods: {
      async changePage (page) {
        const that =this
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
          const response = await axios.post('/manager/suppliers',
            {
              page: page,
              size: size,
            }
          )
          // 请求成功
          if (response.data.code === 1) {
            console.log('请求成功')
            return response.data.data.suppliers
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
        this.supplierInfo = []
        pack.forEach((e) => {
          let obj = {}
          obj.id = e.id
          obj.name = e.name
          obj.address = e.address
          obj.contact = e.contact
          this.supplierInfo.push(obj)
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