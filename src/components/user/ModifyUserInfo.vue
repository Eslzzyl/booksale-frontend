<template>
  <div class="container">
    <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="80">
      <Row>
        <h2>修改用户信息</h2>
      </Row>
      <!-- 注册账号 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="contact" label="账号">
          <Input type="text" v-model="formItem.contact" disabled :placeholder="formItem.contact"></Input>
        </FormItem>
        </Col>
      </Row>
      <!--用户类型-->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="type" label="类型">
          <Input type="text" v-model="formItem.type" disabled :placeholder="formItem.type"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 用户名 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="name" label="用户名">
          <Input type="text" v-model="formItem.name" :placeholder="formItem.name"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 性别 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="sex" label="性别">
          <RadioGroup v-model="formItem.sex">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
            <Radio label="">保密</Radio>
          </RadioGroup>
        </FormItem>
        </Col>
      </Row>
      <!-- 年龄 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="age" label="年龄">
          <Input type="text" v-model="formItem.age" :placeholder="formItem.age"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 密码 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="password" label="密码">
          <Input type="password" password v-model="formItem.password" placeholder="填写密码"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 确认密码 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="conf_password" label="确认密码">
          <Input type="password" password v-model="formItem.conf_password" placeholder="重复密码"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 注册按钮 -->
      <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
        <Button id="modify_btn" shape="circle" type="primary" @click="handleSubmit()">
          <span v-if="!loading">确认修改</span>
          <span v-else>修改中...</span>
        </Button>
        </Col>
      </Row>
      <br>
    </Form>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  data() {
    return {
      loading: false,
      formItem: {
        contact: '',
        name: '',
        type: '',
        sex: '',
        age: '',
        password: '',
        conf_password: '',
      },
      ruleItem: {
        name: [{
          required: true,
          message: "请输入姓名！",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "请填写密码",
          trigger: "blur"
        }, {
          type: "string",
          min: 3,
          message: "密码长度不能小于6位",
          trigger: "blur"
        }],
        conf_password: [{
          required: true,
          message: "请填写密码",
          trigger: "blur"
        }, {
          type: "string",
          min: 3,
          message: "密码长度不能小于6位",
          trigger: "blur"
        }]
      },
    }
  },
  mounted() {
    this.formItem.contact = window.localStorage.getItem('contact')
    this.formItem.name = window.localStorage.getItem('name')
    this.formItem.type = window.localStorage.getItem('type')
    this.formItem.sex = window.localStorage.getItem('sex')
    this.formItem.age = window.localStorage.getItem('age')
  },
  methods: {
    handleSubmit() {
      let that = this
      this.loading = true
      if (this.formItem.password != this.formItem.conf_password) {
        that.$Message.error('两次输入的密码不匹配！')
        return
      }
      axios.post('/user/userChange',
        {
          type: 1,  // 用户
          contact: that.formItem.contact,
          password: that.formItem.password,
          name: that.formItem.name,
          sex: that.formItem.sex,
          age: that.formItem.age,
        }
      ).then((response) => {
        console.log(response)
        if (response.data.code === 1) {
          this.$Message.success('修改成功！')
          this.loading = false
        } else {
          this.$Message.error('修改失败！')
          this.loading = false
        }
      }).catch((error) => {
        console.log(error)
      });
    }
  },
}
</script>

<style scoped>
h2 {
  color: #2D8CF0;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 10px;
}

.container {
  width: 50%;
  margin: 0 auto;
}
</style>