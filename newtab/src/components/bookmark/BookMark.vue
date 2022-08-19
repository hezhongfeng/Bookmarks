<template>
  <div class="bookmark-manager">
    <el-card class="show-container">
      <div class="bread-crumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="breadCrumb of breadCrumbs" :key="breadCrumb.id" @click="onBreadCrumb(breadCrumb)">
            {{ breadCrumb.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="node-container">
        <el-button v-for="node of nodes" :key="node.id" :type="isEditStatus ? 'primary' : ''" @click="onEnter(node)">
          {{ node.title }}
          <template #icon>
            <img :src="node.isFolder ? folderIcon : linkIcon" />
          </template>
        </el-button>
      </div>
    </el-card>
    <Operation
      :parent-id="currentFolderId"
      :selected-node="selectedNode"
      :is-edit-status="isEditStatus"
      @edit-status-change="onisEditStatusChange"
    />
  </div>
</template>

<script setup>
import { DEFAULTFOLDER } from '../../../../utils/setting';
import { ref, onMounted } from 'vue';
import Operation from './Operation.vue';
import { useNodes } from './eventListen';
import linkIcon from '../../assets/link.svg';
import folderIcon from '../../assets/folder.svg';

const { nodes, currentFolderId, getNodes } = useNodes();

const breadCrumbs = ref([]);

const isEditStatus = ref(false);

const selectedNode = ref(null);

const onisEditStatusChange = status => {
  isEditStatus.value = status;
  selectedNode.value = null;
};

// 初始化数据，选择默认的文件夹
const initWorkspace = async () => {
  // 搜索下 workspace
  const searchBookmarkTreeNodes = await chrome.bookmarks.search(DEFAULTFOLDER);
  currentFolderId.value = searchBookmarkTreeNodes[0].id;
  breadCrumbs.value.push({
    id: searchBookmarkTreeNodes[0].id,
    title: searchBookmarkTreeNodes[0].title
  });
  getNodes();
};

const onEnter = node => {
  // 选择
  if (isEditStatus.value) {
    selectedNode.value = node;
    return;
  }
  if (node.isFolder) {
    currentFolderId.value = node.id;
    breadCrumbs.value.push({
      id: node.id,
      title: node.title
    });
    getNodes();
  } else {
    chrome.tabs.create({ url: node.url });
  }
};

const onBreadCrumb = node => {
  currentFolderId.value = node.id;
  const index = breadCrumbs.value.findIndex(item => item.id === node.id);
  breadCrumbs.value = breadCrumbs.value.slice(0, index + 1);
  getNodes();
};

onMounted(async () => {
  initWorkspace();
});
</script>

<style lang="scss">
.bookmark-manager {
  display: flex;
  flex-direction: column;
  .show-container {
    height: 40%;
    .bread-crumb {
      padding-bottom: 20px;
      .el-breadcrumb__item {
        &:hover {
          cursor: pointer;
          color: #409eff;
          transition: all 0.2s;
        }
      }
    }

    .node-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      .el-button {
        margin-left: 0;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
