<template>
  <div class="login-container">
    <div class="middle-box loginscreen bg-white container">
      <div class="login-title text-center">
        <img src="~@/assets/login_images/login.png">
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t('login.title') }}</h3>
        <!-- <lang-select class="set-language" /> -->
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          >
            <i slot="prefix">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
            </i>
          </el-input>
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
              </i>
              <i slot="suffix">
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </i>
            </el-input>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >{{ $t('login.logIn') }}</el-button>

      <!--<div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            {{ $t('login.username') }} : editor
          </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>

      </div>-->
      </el-form>
    </div>
  </div>
</template>

<script>
// import LangSelect from '@/components/LangSelect'

export default {
  name: 'Login',
  // components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('The password can not be less than 1 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'bmcadmin',
        password: 'password'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      const _this = this
      _this.$refs.loginForm.validate(valid => {
        if (valid) {
          _this.loading = true
          _this.$store.dispatch('user/login', _this.loginForm)
            .then((res) => {
              if (res) {
                _this.$router.push({ path: _this.redirect || '/', query: _this.otherQuery })
                _this.loading = false
              } else {
                _this.$message.error('用户名或密码输入错误！！！')
                _this.loading = false
              }
            })
            .catch((err) => {
              console.log(err)
              _this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 43px;
      color: $bg;
      height: 47px;
      caret-color: $bg;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $cursor inset !important;
        -webkit-text-fill-color: $bg !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #DCDFE6;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
	background: url("~@/assets/login_images/technology-background.jpg") no-repeat center fixed;
	background-size: cover;
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .bg-white {
		background-color: #ffffff;
	}

  .middle-box {
		width: 400px;
    height: 335px;
    z-index: 100;
    padding-bottom: 10px;
    border-radius: 4px;
    position: absolute;
    left: 78.4%;
    top: 50%;
    transform: translate(-50%,-50%);
	}

	.loginscreen .middle-box {
		width: 200px;
	}

	.login-title {
		height: 130px;
    width: 130px;
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    background-color: #FFF;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
	}

	.login-title img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #ffffff;
	}

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    /* padding: 160px 35px 0; */
    margin: 0 auto;
    overflow: hidden;
    padding: 75px 20px 20px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 5px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $bg;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
