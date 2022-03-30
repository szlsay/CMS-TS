<template>
  <div class="custom-dialog" v-if="visible">
    <h3>这是老师自定义的 Dialog 对话框</h3>
    <p>visible 的值是：{{ visible }}</p>
    <el-button type="warning" size="mini" @click="close">关闭对话框</el-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class MyDialog extends Vue {
  @Prop({ default: false }) readonly visible!: boolean
  close () {
    // 点击子组件中的关闭按钮，希望给父组件传一个 false
    // 目的：为了让父组件，把布尔值改成 false
    // this.$emit('visible', false)
    // this.$emit('update:.sync修饰符前面的属性名', false)
    this.$emit('update:visible', false)
  }
}
</script>
<style lang="less" scoped>
.custom-dialog {
  border: 1px solid red;
  min-height: 200px;
}
</style>
