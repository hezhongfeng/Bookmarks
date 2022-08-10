<template>
  <el-form :model="form" label-width="120px" class="popup">
    <el-form-item label="名称">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="文件夹">
      <el-tree-select v-model="form.node" :data="tree" check-strictly :render-after-expand="false" />
    </el-form-item>
    <el-form-item>
      <el-button>取消</el-button>
      <el-button type="primary" @click="onSubmit">完成</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
  console.log('submit!');
  chrome.runtime.sendMessage(
    {
      payload: {
        url: form.value.url,
        title: form.value.title,
        parentId: 123
      },
      action: 'create from popup'
    },
    function (response) {
      console.log(response);
      window.close();
    }
  );
};
</script>

<style>
.popup {
  padding: 20px;
}
</style>
