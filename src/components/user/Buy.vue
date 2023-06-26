<template>
  <div class="container">
    <Space style="margin-bottom: 20px;">
      <h2>购物车</h2>
      <Button id="buy-btn" type="primary" @click="buy">
        <Icon type="md-appstore" />
        <span v-if="!loading">结算</span>
        <span v-else>购买中...</span>
      </Button>
      <Button id="clear-btn" @click="clearModal = true">
        <Icon type="ios-cart" />清空购物车
      </Button>
      <Modal v-model="clearModal" title="确认清空" @on-ok="clear">
        <p>你真的要清空购物车吗？</p>
      </Modal>
    </Space>
    <Table border height="550" :columns="columns" :data="currCart">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <Page :total="cartNum" :page-size="10" @on-change="changePage" show-total></Page>
    <span id="total-price">总价：{{ totalPrice }}</span>
  </div>
</template>

<script>
import { Button } from 'view-ui-plus'
import { Icon } from 'view-ui-plus'
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      cartNum: 0,
      currCart: [],
      currPage: [],
      totalPrice: 0,
      clearModal: false,
      loading: false,
      columns: [
        {
          title: '书籍ID',
          key: 'id'
        },
        {
          title: "书名",
          key: "name"
        },
        {
          title: "单价",
          key: "price"
        },
        {
          title: "购买数量",
          key: "count"
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        },
      ],
    };
  },
  mounted() {
    let cart = localStorage.getItem("cart")
    cart = JSON.parse(cart)
    if (cart.length > 0) {
      this.currCart = cart
      this.cartNum = cart.length
      for (let i = 0; i < this.currCart.length; i++) {
        this.totalPrice += this.currCart[i].price * this.currCart[i].count;
      }
      this.currPage = this.currCart.slice(0, 10);
    }
  },
  methods: {
    changePage(page) {
      this.currPage = this.currCart.slice((page - 1) * 10, page * 10);
    },
    remove(index) {
      this.currCart.splice(index, 1);
      this.cartNum -= 1;
      localStorage.setItem("cart", JSON.stringify(this.currCart));
    },
    buy() {
      if (this.cartNum === 0) {
        this.$Message.info("购物车为空");
        return;
      }
      this.loading = true;
      let posts = [];
      for (let i = 0; i < this.currCart.length; i++) {
        posts.push({
          bid: this.currCart[i].id,
          num: this.currCart[i].count,
          uid: this.localStorage.getItem("contact")
        });
      }

      axios.post("/user/purchase", posts).then(response => {
        if (response.data.code === 1) {
          this.$Message.success("购买成功");
          this.loading = false;
          this.currCart = [];
          this.cartNum = 0;
          localStorage.setItem("cart", JSON.stringify(this.currCart));
        } else {
          this.$Message.error("购买失败");
          this.loading = false;
          console.log(response.data);
        }
      }).catch(err => {
        this.$Message.error("购买失败");
        console.log(err);
        this.loading = false;
      });
    },
    clear() {
      this.currCart = [];
      this.cartNum = 0;
      localStorage.setItem("cart", JSON.stringify(this.currCart));
      this.$Message.success("购物车已清空");
    }
  },
  components: { Icon }
}
</script>

<style scoped>
h2 {
  color: #2D8CF0;
  margin: 0 auto;
  margin-top: 10px;
}

#buy-btn {
  position: absolute;
  right: 15%;
}

#clear-btn {
  position: absolute;
  right: 5%;
}

#total-price {
  position: absolute;
  right: 5%;
  bottom: 10%;
  font-size: 20px;
}
</style>