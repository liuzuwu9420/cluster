<template>
  <div class="app-container">
    <iframe :src="NodeSrc" width="100%" height="100%" frameborder="0" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      NodeSrc: ''
    }
  },
  created() {
    if (this.$route.params.device) {
      this.iframeTime(this.$route.params.device.HostIP)
    } else {
      this.$router.push({ name: 'device.list' })
    }
    // 产品列表
    // this.fetchProductList();
  },
  methods: {
    iframeTime(IP) {
      const _this = this
      const timeInterval = '1h'
      const httpUrl = `http://16.16.18.61:3000/d/9CWBz0bik/prometheus-node-exporterjian-kong-zhan-shi-kan-ban?orgId=1&var-node=${IP}:9100&var-maxmount=%2F&from=now-${timeInterval}&to=now&kiosk`
      _this.NodeSrc = httpUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
