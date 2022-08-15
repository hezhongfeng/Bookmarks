<template>
  <div class="tag-operation">
    <el-row class="mb-4" justify="end">
      <el-button type="primary" @click="onAdd">添加</el-button>
      <el-button type="primary" @click="onEdit">编辑</el-button>
      <el-button type="primary" @click="onDelete">删除</el-button>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Add" width="40%" @close="onClosed">
      <el-form label-width="120px" :model="form" style="max-width: 460px">
        <el-form-item label="Tag">
          <el-input v-model="form.tag" />
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

const dialogVisible = ref(false);

const form = ref({
  tags: ''
});

const clearForm = () => {
  form.value = {
    tags: ''
  };
};

const onAdd = () => {
  dialogVisible.value = true;
};

const onEdit = () => {
  dialogVisible.value = true;
};

const onDelete = () => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    type: 'warning'
  })
    .then(() => {
      console.log('删除');
    })
    .catch(() => {
      console.log('取消');
    });
};

const onCancel = () => {
  dialogVisible.value = false;
};

const onConfirm = () => {};

const onClosed = () => {
  clearForm();
  emit('edit-status-change', false);
};
</script>

<style lang="scss">
.tag-operation {
  padding-top: 10px;
}
</style>
