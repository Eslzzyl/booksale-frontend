<template>
  <div class="container">
    <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="80">
      <!-- ”网上书城“标题 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <h2>{{ msg }}</h2>
        </Col>
      </Row>
      <!-- 注册账号 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="contact" label="注册账号">
          <Input type="text" v-model="formItem.contact" placeholder="填写注册手机或邮箱"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 用户名 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="name" label="用户名">
          <Input type="text" v-model="formItem.name" placeholder="输入用户名"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 性别 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="sex" label="性别">
          <RadioGroup v-model="sex">
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
          <Input type="text" v-model="formItem.age" placeholder="输入年龄"></Input>
        </FormItem>
        </Col>
      </Row>
      <!-- 密码 -->
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="password" label="注册密码">
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
        <Button id="resgiter_btn" shape="circle" type="primary" @click="handleSubmit()">
          <span v-if="!loading">注册</span>
          <span v-else>注册中...</span>
        </Button>
        </Col>
      </Row>
      <br>
      <!-- 返回登录页按钮 -->
      <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
        <Button id="login_btn" shape="circle" type="primary" @click="login()">
          <span>返回登录页</span>
        </Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>
  
<script>
import { Button } from 'view-ui-plus'
import { RadioGroup } from 'view-ui-plus'
import { Radio } from 'view-ui-plus'

import axios from '@/axiosInstance.js'

export default {
  name: "HelloWorld",
  data() {
    return {
      sex: "",
      msg: "网上书城-注册",
      verifyCode: "hello",
      formItem: {
        contact: "",
        password: "",
        sex: "",
        age: "",
        name: ""
      },
      ruleItem: {
        contact: [{
          required: true,
          message: "请填写账号！",
          trigger: "blur"
        }],
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
      loading: false
    };
  },
  methods: {
    handleSubmit() {
      let that = this
      this.loading = true
      let contact = this.$refs.formItem.contact
      if (this.formItem.password != this.formItem.conf_password) {
        that.$Message.error('两次输入的密码不匹配！')
        return
      }
      if (this.validateContact(contact)) {
        axios.post('/register',
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
            this.$Message.success('注册成功！')
            this.loading = false
            this.$router.replace('/')
          } else {
            this.$Message.error('注册失败！')
            this.loading = false
          }
        }).catch((error) => {
          console.log(error)
        });
      } else {
        this.$Message.error('账号格式不合法！')
        this.loading = false
      }
    },
    validateContact() {
      // 验证账号格式是否合法，代码待补
      return true;
    },
    login() {
      this.$router.replace('/')
    }
  },
  components: { Radio, RadioGroup }
}
</script>

<style scoped>
h2 {
  color: #2D8CF0;
  margin-bottom: 20px;
}

Form {
  margin: 0 auto;
  width: 350px;
  border: 2px solid lightgrey;
  border-radius: 20px;
  padding: 50px 0;
}

/* 登录按钮 */
#login_btn {
  width: 60%;
}

/* 注册按钮 */
#resgiter_btn {
  width: 60%;
}
</style>
  