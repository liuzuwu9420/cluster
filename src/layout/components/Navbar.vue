<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-popover placement="bottom" trigger="hover" content="文件管理">
          <div slot="reference" v-permission="['root','admin']" class="right-menu-item hover-effect">
            <a @click="linkToFileStash">
              <svg-icon icon-class="link" />
            </a>
          </div>
        </el-popover>
        <el-popover placement="bottom" trigger="hover" content="大屏监控">
          <div slot="reference" v-permission="['root','admin']" class="right-menu-item hover-effect">
            <router-link router-link tag="a" target="_blank" to="/overview">
              <svg-icon icon-class="computer" />
            </router-link>
          </div>
        </el-popover>
        <el-popover placement="bottom" trigger="hover" content="全屏">
          <screenfull id="screenfull" slot="reference" class="right-menu-item hover-effect" />
        </el-popover>
        <el-popover el-scrollbar placement="bottom-end" trigger="click">
          <div el-scrollbar>
            <div style="border-bottom: 0;line-height: 30px;margin-bottom: 14px;height: 20px;width: 300px;">
              <span style="font-size: 16px;color: #1a2736;">最近消息</span>
              <span><el-button type="text" @click="changeAlarm()">清空</el-button></span>
              <span style="font-size: 12px;color: #007fdf;float: right;margin-right: 20px;cursor: pointer;" @click="jumpAlarm()">查看全部 &gt;<span />
              </span>
            </div>
            <el-scrollbar :style="{ height: alarmHeight }">
              <div v-for="(item, index) in alarm" :key="index">
                <div v-html="item" />
              </div>
            </el-scrollbar>
          </div>
          <el-badge
            slot="reference"
            v-permission="['root','admin']"
            :value="alarm.length"
            :max="99"
            class="right-menu-item el-badge-item hover-effect"
          >
            <svg-icon icon-class="bell" />
          </el-badge>
        </el-popover>
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userImgUrl" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
          </router-link>
          <router-link to="/main/about">
            <el-dropdown-item v-permission="['root','admin']">关于</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull
    // SizeSelect,
    // LangSelect
    // Search
  },
  data() {
    return {
      userImgUrl: require('@/assets/user_images/user.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'alarm'
    ]),
    alarmHeight() {
      return this.alarm.length === 0 ? '0px' : '612px'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    linkToFileStash() {
      const url = `http://filestash.xtc.home/`
      window.open(url, '_blank')
    },
    changeAlarm() {
      this.$store.dispatch('alarm/clearAlarm')
    },
    jumpAlarm() {
      this.$router.push({
        name: 'Alarm list'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .el-badge-item {
      margin-right: 20px;
      font-size: 20px;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
