<template>
  <div class="edit-container">
    <div v-show="editShow" class="edit-content">{{ editContainer }}</div>
    <slot />
    <div v-show="editShow && !roleDisabled" class="edit-icon" @click="changeEdit"><i class="el-icon-edit" /></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Edit',
  props: {
    editContainer: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      editShow: true
    }
  },
  computed: {
    ...mapGetters([
      'roleDisabled'
    ])
  },
  methods: {
    changeEdit() {
      this.$emit('change', false)
      this.editShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
  margin: 0;
  float: left;
  .edit-content {
    float: left;
  }
  .edit-icon {
    float: left;
    margin-left: 10px;
    color: #1890ff;
    cursor: pointer;
  }
  .cancel-icon {
    float: left;
    margin-left: 10px;
    color: #919396;
    cursor: pointer;
  }
}
</style>
