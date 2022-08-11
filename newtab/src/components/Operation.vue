<template>
  <div class="operation">
    <el-row class="mb-4">
      <el-button type="primary" @click="onAdd">添加</el-button>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Add" width="40%">
      <el-form label-width="120px" :model="form" style="max-width: 460px">
        <el-form-item>
          <el-checkbox v-model="form.isFolder">isFolder</el-checkbox>
        </el-form-item>
        <el-form-item v-show="!form.isFolder" label="URL">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item :label="form.isFolder ? 'FolderName' : 'Bookmark Name'">
          <el-input v-model="form.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  parentId: {
    type: String,
    default: '1'
  }
});

const dialogVisible = ref(false);

const form = ref({
  title: '',
  url: '',
  isFolder: false
});

const onAdd = () => {
  dialogVisible.value = true;
};

const clearForrm = () => {
  form.value = {
    title: '',
    url: '',
    isFolder: false
  };
};

const onConfirm = async () => {
  const createDetails = {
    parentId: props.parentId,
    title: form.value.title,
    url: form.value.url
  };

  if (form.value.isFolder) {
    delete createDetails.url;
  }
  await chrome.bookmarks.create(createDetails);

  dialogVisible.value = false;
  clearForrm();
};

const onCancel = () => {
  dialogVisible.value = false;
  clearForrm();
};
</script>

<style lang="scss">
.operation {
}
</style>
