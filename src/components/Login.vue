<template>
  <div class="container">
    <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="80">
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <h2>{{ msg }}</h2>
        </Col>
      </Row>
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="contact" label="账号">
          <Input type="text" v-model="formItem.contact" placeholder="你的注册电话或邮箱"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :xs="23" :sm="23" :md="23" :lg="23">
        <FormItem prop="password" label="密码">
          <Input type="password" v-model="formItem.password" placeholder="你的密码"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :xs="16" :sm="16" :md="16" :lg="16">
        <FormItem prop="code" label="验证码">
          <Input type="text" v-model="formItem.code" placeholder="请输入验证码"></Input>
        </FormItem>
        </Col>
        <Col :xs="8" :sm="8" :md="8" :lg="8">
        <h2 id="verifyCode" @click="createCode()">{{ verifyCode }}</h2>
        </Col>
      </Row>
      <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
        <Button id="login_btn" shape="circle" type="primary" :loading="loading" @click="handleSubmit('formItem')">
          <span v-if="!loading">登录</span>
          <span v-else>登录中...</span>
        </Button>
        </Col>
      </Row>
      <!-- 注册按钮 -->
      <br>
      <Button id="resgiter_btn" shape="circle" type="primary" @click="register()">
        <span>注册</span>
      </Button>

      <!-- <Row class="tip">
        <Col :xs="10" :sm="10" :md="10" :lg="10" offset="12">
        <span class="login_font">
          <a>忘记密码？点击邮箱找回</a>
        </span>
        </Col>
      </Row> -->
    </Form>
  </div>
</template>

<script>
import axios from '@/axiosInstance.js'

export default {
  name: 'Login',
  data() {
    return {
      msg: '网上书城-登录',
      verifyCode: 'hello',
      formItem: {
        contact: '',
        password: '',
        code: ''
      },
      ruleItem: {
        contact: [{
          required: true,
          message: '请填写账号！',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 6, // 原值为3
          message: '密码长度不能小于6位',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请填写验证码',
          trigger: 'blur'
        }]
      },
      loading: false,
      useVerifyCode: false,
    }
  },
  mounted() {
    this.createCode()
  },
  methods: {
    handleSubmit() {
      var that = this
      this.loading = true
      let contact = that.formItem.contact
      this.updateToken('waiting')
      if (this.validateContact(contact)) {
          if (this.validateCode(that.verifyCode, that.formItem.code)) {
            axios.post('/login',
              {
                contact: that.formItem.contact,
                password: that.formItem.password
              }
            ).then((response) => {
              console.log(response)
              if (response.data.code === 1) {
                this.$Message.success('登录成功!')
                let type = response.data.data.account.type
                let name = response.data.data.account.name
                let sex = response.data.data.account.sex
                let age = response.data.data.account.age
                let token = response.data.data.jwt
                window.localStorage.setItem('contact', contact)
                window.localStorage.setItem('type', type)
                window.localStorage.setItem('name', name)
                window.localStorage.setItem('sex', sex)
                window.localStorage.setItem('age', age)
                this.updateToken(token)
                console.log('登录成功' + contact + ' ' + name)
                let msg = response.data.msg
                if (msg === 'user') {    // 用户
                  this.$router.replace({ path: '/user' })
                } else if (msg === 'manager') {   // 管理员
                  this.$router.replace({ path: '/manager' })
                } else {
                  this.$Message.error('服务端返回了一个未知的用户类型：' + msg)
                  console.log('服务端返回了一个位置的用户类型：' + msg)
                }
              } else {
                this.$Message.error('账号或密码有误！')
                this.updateToken('')
                this.loading = false
              }
            }).catch((error) => {
              console.log(error);
            });
          } else {
            that.$Message.error('请填写正确的验证码!')
            code.toLowerCase() === verifyCode.toLowerCase()
            this.loading = false
          }
          // window.localStorage.setItem('contact', contact)
          // this.$Message.success('登录成功!')
          // this.$router.replace({ path: '/user' })
      } else {
        this.$Message.error('账号格式不合法！')
        code.toLowerCase() === verifyCode.toLowerCase()
        this.loading = false
      }
    },
    createCode() {
      var code = ''
      var codeLength = 4
      var random = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      console.log('验证码：' + code)
      this.verifyCode = code
    },
    validateCode(code, verifyCode) {
      if (!this.useVerifyCode) {
        return true
      } else {
        return code.toLowerCase() === verifyCode.toLowerCase()
      }
    },
    validateContact() {
      // 验证账号格式是否合法，代码待补
      return true;
    },
    register() {
      this.$router.replace('/register')
    },
    updateToken(value) {
      window.localStorage.setItem('token', value)
    }
  }
}
</script>
  
<style scoped>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

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

.tip {
  margin-top: 10px;
  color: darkgrey;
}

</style>
  