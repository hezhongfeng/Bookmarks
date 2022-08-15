<template>
  <div class="tags">
    <el-card>
      <div class="tags-container">
        <div v-for="computedTag of computedTags" :key="computedTag.tag" class="badge">
          <el-badge :value="computedTag.count" type="primary">
            <el-button>{{ computedTag.tag }}</el-button>
          </el-badge>
        </div>
      </div>
    </el-card>
    <tag-operation></tag-operation>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTags } from './tags';
import TagOperation from './TagOperation.vue';

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
  flex-direction: column;
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    .badge {
      margin-top: 12px;
      margin-right: 20px;
    }
  }
}
</style>
