<template>
  <div class="new-tab">
    <div class="node-container">
      <el-button
        v-for="node of nodes"
        :key="node.id"
        :type="node.idFolder ? 'primary' : 'default'"
        @click="onEnter(node)"
      >
        {{ node.title }}
      </el-button>
    </div>
    <Operation :parent-id="currentFolderId" />
  </div>
</template>
<script setup>
import { FOLDER } from '../../utils/setting';
import { ref, onMounted } from 'vue';
import Operation from './components/Operation.vue';
import { useNodes } from './eventListen';

const { nodes, currentFolderId, getNodes } = useNodes();

// 初始化数据，选
const init = async () => {
  // 搜索下 workspace
  const searchBookmarkTreeNodes = await chrome.bookmarks.search(FOLDER);
  currentFolderId.value = searchBookmarkTreeNodes[0].id;
  getNodes();
};

const onEnter = node => {
  if (node.idFolder) {
    currentFolderId.value = node.id;
    getNodes();
  } else {
    chrome.tabs.create({ url: node.url });
  }
};

onMounted(async () => {
  init();
});
</script>

<style lang="scss">
.new-tab {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 20px;
  .node-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    align-items: center;
    padding: 10px;
    .el-button {
      margin-right: 10px;
    }
  }
}
</style>
