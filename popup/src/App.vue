<template>
  <el-form :model="form" label-width="120px" class="popup">
    <el-form-item label="名称">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="文件夹">
      <el-input v-model="form.node" />
    </el-form-item>
    <el-form-item>
      <el-button>取消</el-button>
      <el-button type="primary" @click="onSubmit">完成</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({
  title: '',
  url: '',
  node: ''
});

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
