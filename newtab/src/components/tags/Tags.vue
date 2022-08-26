<template>
  <div class="tags">
    <el-card>
      <div class="tags-container">
        <div v-for="computedTag of computedTags" :key="computedTag.tag" class="badge">
          <el-badge :value="computedTag.count" type="primary">
            <el-button :type="isEditStatus ? 'primary' : ''" @click="onEnter(computedTag)">
              {{ computedTag.name }}
              <template #icon>
                <img :src="tagIcon" />
              </template>
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
    <el-dialog v-model="dialogVisible" :title="selectedTag.name" width="40%">
      <el-card>
        <div class="tags-node-container">
          <el-button v-for="node of nodes" :key="node.id" @click="onEnterNode(node)">
            {{ node.title }}
            <template #icon>
              <img :src="node.isFolder ? folderIcon : linkIcon" />
            </template>
          </el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTags } from './tags';
import TagOperation from './TagOperation.vue';
import tagIcon from '../../assets/tag.svg';
import linkIcon from '../../assets/link.svg';
import folderIcon from '../../assets/folder.svg';

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
const dialogVisible = ref(false);
const nodes = ref([]);

const getNodes = async () => {
  const nodeIds = nodeandtags.value
    .filter(item => item.tagId === selectedTag.value.id)
    .map(nodeandtag => nodeandtag.nodeId);
  const tempNodes = [];
  for (const nodeId of nodeIds) {
    const [node] = await chrome.bookmarks.get(nodeId);
    tempNodes.push({
      id: node.id,
      title: node.title,
      isFolder: !node.url,
      url: node.url || ''
    });
  }
  nodes.value = tempNodes;
};

const onEnterNode = node => {
  if (!node.isFolder) {
    chrome.tabs.create({ url: node.url });
  }
};

const onEditStatusChange = status => {
  isEditStatus.value = status;
  selectedTag.value = {
    id: '',
    name: ''
  };
};

const onEnter = async tag => {
  selectedTag.value = {
    id: tag.id,
    name: tag.name
  };
  if (!isEditStatus.value) {
    await getNodes();
    dialogVisible.value = true;
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
.tags-node-container {
  .el-button {
    margin-left: 0;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
