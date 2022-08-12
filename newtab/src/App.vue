<template>
  <div class="new-tab">
    <div class="container">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="BookMark" name="bookmark">
          <book-mark />
        </el-tab-pane>
        <el-tab-pane label="Tag" name="tag">
          <tags />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import BookMark from './components/BookMark.vue';
import Tags from './components/Tags.vue';

const activeName = ref('bookmark');
</script>

<style lang="scss">
.new-tab {
  padding: 8vw;
  .container {
    border: 1px solid #4c4d4f;
    border-radius: 4px;
    padding: 2vw;
    .el-tabs {
      height: 80%;
    }
  }
}
</style>
