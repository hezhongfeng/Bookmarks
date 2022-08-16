<template>
  <div class="tags">
    <el-card>
      <div class="tags-container">
        <div v-for="computedTag of computedTags" :key="computedTag.tag" class="badge">
          <el-badge :value="computedTag.count" type="primary">
            <el-button :type="isEditStatus ? 'primary' : 'default'" @click="onEnter(computedTag)">
              {{ computedTag.name }}
            </el-button>
          </el-badge>
        </div>
      </div>
    </el-card>
    <tag-operation
      :is-edit-status="isEditStatus"
      :selected-tag="selectedTag"
      @edit-status-change="onEditStatusChange"
    ></tag-operation>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTags } from './tags';
import TagOperation from './TagOperation.vue';

const { tags, nodeandtags } = useTags();

const computedTags = computed(() => {
  const tempTags = tags.value.map(tag => {
    return {
      name: tag.name,
      id: tag.id,
      count: 0
    };
  });
  for (const nodeandtag of nodeandtags.value) {
    tempTags.find(tempTag => tempTag.id === nodeandtag.tagId).count++;
  }
  return tempTags;
});

const isEditStatus = ref(false);
const selectedTag = ref({
  id: '',
  name: ''
});

const onEditStatusChange = status => {
  isEditStatus.value = status;
  selectedTag.value = null;
};

const onEnter = tag => {
  if (isEditStatus.value) {
    selectedTag.value = {
      id: tag.id,
      name: tag.name
    };
    return;
  }
};
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
