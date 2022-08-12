<template>
  <div class="tags">
    <el-tag v-for="tag of tags" :key="tag">
      {{ tag }}
    </el-tag>
  </div>
</template>

<script setup>
import { useTags } from './tags';

const { tags } = useTags();
</script>

<style lang="scss">
.tags {
  display: flex;
  flex-wrap: wrap;
  .el-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
