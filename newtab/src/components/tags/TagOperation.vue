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
import { ref, watch } from 'vue';
import { useTags } from './tags';

const { createTag, updateTag } = useTags();

const props = defineProps({
  isEditStatus: {
    type: Boolean,
    default: false
  },
  selectedTag: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['edit-status-change']);

const dialogVisible = ref(false);

// const selectedTag = ref('');

const hasSelectedCreate = ref(false);
const hasSelectedEdit = ref(false);
const hasSelectedDelete = ref(false);

const form = ref({
  tag: ''
});

watch(
  () => props.selectedTag,
  val => {
    if (val) {
      form.value.tag = val;
      dialogVisible.value = true;
    }
  }
);

const clearForm = () => {
  form.value = {
    tag: ''
  };
};

const onAdd = () => {
  dialogVisible.value = true;
};

const onEdit = () => {
  if (props.isEditStatus) {
    emit('edit-status-change', false);
    hasSelectedEdit.value = false;
  } else {
    emit('edit-status-change', true);
    hasSelectedEdit.value = true;
  }
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

const onConfirm = () => {
  const { tag } = form.value;
  if (!tag) {
    dialogVisible.value = false;
    return;
  }

  if (props.isEditStatus) {
    updateTag(props.selectedTag, tag);
    dialogVisible.value = false;
  } else {
    createTag(form.value.tag);
    dialogVisible.value = false;
  }
};

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
