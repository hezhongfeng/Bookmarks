<template>
  <div class="tags">
    <el-tag v-for="computedTag of computedTags" :key="computedTag.tag">
      {{ computedTag.tag + computedTag.count }}
    </el-tag>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTags } from './tags';

const { tags, nodeandtags } = useTags();

const computedTags = computed(() => {
  const tempTags = tags.value.map(tag => {
    return {
      tag,
      count: 0
    };
  });
  for (const nodeandtag of nodeandtags.value) {
    tempTags.find(tempTag => tempTag.tag === nodeandtag.tag).count++;
  }
  return tempTags;
});
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
