<template>
  <div class="popup-wrapper">
    <el-button :icon="Close" text class="close" @click="onClose" />
    <el-form :model="form" label-width="60px" class="popup-form" size="default">
      <el-form-item label="名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="文件夹">
        <el-tree-select v-model="form.node" :data="tree" check-strictly :render-after-expand="false" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">完成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { FOLDER } from '../../utils/setting';
import { getFoldersByBookmarkTreeNodes, getTreeByBookmarkTreeNodes } from '../../utils/utils';

const form = ref({
  title: '',
  url: '',
  node: ''
});

const folders = ref([]);

const tree = ref([]);

const getFolders = async () => {
  // 搜索下 workspace
  const searchBookmarkTreeNodes = await chrome.bookmarks.search(FOLDER);
  const BookmarkTreeNodes = await chrome.bookmarks.getSubTree(searchBookmarkTreeNodes[0].id);
  folders.value = [];
  getFoldersByBookmarkTreeNodes(BookmarkTreeNodes, folders.value);
  tree.value = [];
  getTreeByBookmarkTreeNodes(BookmarkTreeNodes, tree.value);
};

// 获取当前tab信息
const getCurrentTab = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  form.value.title = tab.title;
  form.value.url = tab.url;
};

onMounted(async () => {
  await getCurrentTab();
  await getFolders();
});

const onSubmit = () => {
  chrome.bookmarks.create(
    {
      url: form.value.url,
      title: form.value.title,
      parentId: form.value.node
    },
    () => {
      window.close();
    }
  );
};

const onCancel = () => {
  window.close();
};

const onClose = () => {
  window.close();
};
</script>

<style lang="scss">
.el-select-dropdown__list {
  max-height: 150px;
}
.popup-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .popup-form {
    width: 90%;
    .el-select {
      width: 100%;
    }
  }
  .close {
    position: absolute;
    top: 4px;
    right: 4px;
  }
}
</style>
