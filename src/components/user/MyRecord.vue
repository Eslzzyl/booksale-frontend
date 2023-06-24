<template>
  <div class="container">
    <Table border :columns="columns" :data="historyInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <Page :total="total" :page-size="10" @on-change="changePage"></Page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      historyNum: 0,
      columns: [
        {
          title: '书名',
          key: 'name'
        },
        {
          title: '出版社',
          key: 'pname'
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
        },
      ],
      historyInfo: [
        {
          name: '测试书名',
          pname: '中华书局',
          price: 888,
          count: 114514,
          time: '2023年6月21日',
        }
      ],
    }
  },
  mounted() {
    let that = this;
    // 请求图书总量
    axios.get('/user/historynum').then((response) => {
      if (response.data.code === 1) {
        that.historyNum = response.data.data
        that.$Message.success('已获取到' + that.historyNum + '条购买记录信息')
      } else {
        that.$Message.error('请求购买记录信息失败！')
        console.log('请求购买记录信息失败！')
      }
    }).catch((error) => {
      that.$Message.error('请求购买记录信息失败！')
      console.log(error);
    });
    // 请求第一页数据
    this.historyInfo = []
    const pack = this.request(1)
    pack.forEach((e) => {
      let obj = {}
      obj.name = e.name
      obj.pname = e.pname
      obj.price = e.price
      obj.count = e.count
      obj.time = this.formatTimestamp(e.time)
      that.historyInfo.push(obj)
    })
  },
  methods: {
    changePage: (page) => {
      this.historyInfo = []
      const pack = this.request(page)
      pack.forEach((e) => {
        let obj = {}
        obj.name = e.name
        obj.pname = e.pname
        obj.price = e.price
        obj.count = e.count
        obj.time = this.formatTimestamp(e.time)
        this.historyInfo.push(obj)
      })
    },
    // 向后端发出请求
    request(page) {
      // 默认一页放10本书
      let size = 10
      let that = this
      let contact = window.localStorage.getItem('contact')
      axios.get('/user/historynum',
        {
          contact: contact,
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