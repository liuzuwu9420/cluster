
export default {
  methods: {
    // 显示Sidepage
    showSidepage(row) {
      this.$refs.table.$refs['el-table'].setCurrentRow(row)
      this.sidepagedata.list = row
      this.sidepagedata.sidepageShow = true
      this.$nextTick(() => {
        const currentColEl = this.$refs.table.$el.querySelector('.el-table__row>td:first-child')
        const sidepageEl = this.$refs.Sidepage.$el
        this.$nextTick(() => {
          sidepageEl.style.left = `${currentColEl.offsetWidth - 0.5}px`
        })
      })
    },

    // 点击其它区域边页隐藏
    closeSidepage(event) {
      if (this.$refs.table) {
        const elTableEl = this.$refs.table.$refs['el-table'].$el
        const elTable = this.$refs.table.$refs['el-table']
        if (this.$refs.Sidepage) {
          const sidepageEl = this.$refs.Sidepage.$el
          if (!elTableEl.contains(event.target) && !sidepageEl.contains(event.target)) {
            this.sidepagedata.sidepageShow = false
            elTable.setCurrentRow()
          }
        } else {
          if (!elTableEl.contains(event.target) && elTableEl.querySelector('.current-row')) {
            elTable.setCurrentRow()
          }
        }
      }
    }
  }
}
