<template>
  <div class="num-container">
    <div
      v-for="(item,index) in flopNums"
      :key="index"
      :class="{'number-item': !isNaN(item),'NaN-item': isNaN(item)}"
    >
      <span v-if="!isNaN(item)">
        <i ref="numberItem">0123456789</i>
      </span>
      <span v-else>{{ item }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FlopNumber',
  props: {
    number: {
      type: Number,
      require: true,
      default: 0
    }
  },
  data() {
    return {
      flopNums: []
    }
  },
  watch: {
    number() {
      this.updateNum()
    }
  },
  mounted() {
    this.updateNum()
  },
  methods: {
    // 设置每一位数字的偏移
    setNumberTransform() {
      const numberItems = this.$refs.numberItem
      const numberArr = this.flopNums.filter(item => !isNaN(item))
      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
      }
    },
    toThousands(Num) {
      let num = (Num || 0).toString()
      let result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) { result = num + result }
      return result.split('')
    },
    updateNum() {
      this.flopNums = this.toThousands(this.number)
      this.$nextTick(() => {
        this.setNumberTransform()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .num-container{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    width: 80%;
    .number-item{
      width: 80px;
      height: 120px;
      font-size: 100px;
      line-height: 120px;
      text-shadow: 0 0 6px rgba(255,255,255,.6);
      background: rgba(29, 64, 130,.8);
      border: #0a76a4 1px solid;
      border-radius: 12px;
      box-shadow: 0 0 20px rgb(29, 64, 130);
      & >span{
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        writing-mode: vertical-rl;
        text-orientation: upright;
        overflow: hidden;
        & > i{
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translate(-50%,0);
          transition: transform 0.5s ease-in-out;
          letter-spacing: 10px;
          font-style: normal;
        }
      }
    }
    .NaN-item{
      display: flex;
      align-items: flex-end;
      font-size: 50px;
    }
  }
</style>
