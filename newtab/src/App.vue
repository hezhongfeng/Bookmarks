<template>
  <div class="new-tab">
    <div class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="BookMarks" name="bookmark">
          <book-mark />
        </el-tab-pane>
        <el-tab-pane label="Tags" name="tag">
          <tags />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import BookMark from './components/bookmark/BookMark.vue';
import Tags from './components/tags/Tags.vue';

const activeName = ref('bookmark');
</script>

<style lang="scss">
.new-tab {
  padding: 8vw;
  font-size: 14px;
  .container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 2vw;
    height: 50vh;
    .el-tabs {
      height: 80%;
    }
    .el-button {
      span {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 150px;
      }
    }
  }
}
</style>
