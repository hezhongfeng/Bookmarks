<template>
  <el-form :model="form" label-width="120px" class="popup">
    <el-form-item label="名称">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="文件夹">
      <el-select v-model="form.node" placeholder="Activity zone">
        <el-option v-for="folder of folders" :key="folder.id" :label="folder.title" :value="folder.id" />
      </el-select>
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
import { getFoldersByBookmarkTreeNodes } from '../../utils/utils';

console.log('FOLDER', FOLDER);

const form = ref({
  title: '',
  url: '',
  node: ''
});

const folders = ref([]);

const getBookmarks = () => {
  // // 只能先搜索一个文件夹，或者成为workspace
  chrome.bookmarks.search(FOLDER, BookmarkTreeNodes => {
    // BookmarkTreeNodes是个列表，使用第一个就行，node的数据格式
    // {
    //   dateAdded: 1660015576029;
    //   dateGroupModified: 1660015576029;
    //   id: '751';
    //   index: 18;
    //   parentId: '1';
    //   title: 'pineconee';
    // }
    console.log(BookmarkTreeNodes);

    // 查询文件夹下的所有子节点
    // [
    //   {
    //     "children": [
    //       {
    //         "dateAdded": 1660091168701,
    //         "id": "752",
    //         "index": 0,
    //         "parentId": "751",
    //         "title": "chrome.bookmarks - Chrome Developers",
    //         "url": "https://developer.chrome.com/docs/extensions/reference/bookmarks/#method-search"
    //       }
    //     ],
    //     "dateAdded": 1660015576029,
    //     "dateGroupModified": 1660091171834,
    //     "id": "751",
    //     "index": 18,
    //     "parentId": "1",
    //     "title": "pineconee"
    //   }
    // ]
    chrome.bookmarks.getSubTree(BookmarkTreeNodes[0].id, BookmarkTreeNodes => {
      // console.log(subTree);
      folders.value = [];
      getFoldersByBookmarkTreeNodes(BookmarkTreeNodes, folders.value);
      console.log(folders.value);
    });
  });
};

onMounted(async () => {
  // 获取当前tab信息
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  //   {
  //   "active": true,
  //   "audible": false,
  //   "autoDiscardable": true,
  //   "discarded": false,
  //   "favIconUrl": "https://developer.mozilla.org/favicon-48x48.cbbd161b.png",
  //   "groupId": -1,
  //   "height": 938,
  //   "highlighted": true,
  //   "id": 485076623,
  //   "incognito": false,
  //   "index": 9,
  //   "mutedInfo": {
  //     "muted": false
  //   },
  //   "pinned": false,
  //   "selected": true,
  //   "status": "complete",
  //   "title": "runtime.sendMessage() - Mozilla | MDN",
  //   "url": "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage",
  //   "width": 747,
  //   "windowId": 485075405
  // }
  console.log(tab);
  form.value.title = tab.title;
  form.value.url = tab.url;

  getBookmarks();
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
