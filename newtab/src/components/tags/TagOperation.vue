<template>
  <div class="tag-operation">
    <el-row class="mb-4" justify="end">
      <el-button type="primary" :disabled="hasSelectedEdit || hasSelectedDelete" @click="onAdd">添加</el-button>
      <el-button type="primary" :disabled="hasSelectedDelete" @click="onEdit">编辑</el-button>
      <el-button type="primary" :disabled="hasSelectedEdit" @click="onDelete">删除</el-button>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Add" width="40%" @close="onClosed">
      <el-form ref="ruleFormRef" label-width="120px" :model="form" :rules="rules" status-icon style="max-width: 460px">
        <el-form-item label="Tag" prop="name">
          <el-input v-model="form.name" />
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

const { createTag, updateTag, deleteTag, tags } = useTags();

const props = defineProps({
  isEditStatus: {
    type: Boolean,
    default: false
  },
  selectedTag: {
    type: Object,
    default: () => ({
      id: '',
      name: ''
    })
  }
});

const emit = defineEmits(['edit-status-change']);

const dialogVisible = ref(false);

const hasSelectedEdit = ref(false);
const hasSelectedDelete = ref(false);

const form = ref({
  name: '',
  id: ''
});

const validateTagName = (rule, value) => {
  return new Promise((resolve, reject) => {
    if (!props.isEditStatus && tags.value.some(tag => tag.name === value)) {
      reject('Please input a valid tag name');
    }
    if (props.isEditStatus && tags.value.some(tag => tag.name === value && tag.id != form.value.id)) {
      reject('Please input a valid tag name');
    }
    resolve();
  });
};

const rules = ref({
  name: [
    { required: true, message: 'Please input tag name', trigger: 'blur' },
    { validator: validateTagName, trigger: 'blur' }
  ]
});

watch(
  () => props.selectedTag,
  val => {
    if (val.id) {
      if (hasSelectedEdit.value) {
        form.value.name = val.name;
        form.value.id = val.id;
        dialogVisible.value = true;
      } else if (hasSelectedDelete.value) {
        ElMessageBox.confirm('确定删除所选?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            deleteTag(val.id);
          })
          .finally(() => {
            hasSelectedDelete.value = false;
            emit('edit-status-change', false);
            dialogVisible.value = false;
          });
      }
    }
  }
);

const clearForm = () => {
  form.value = {
    name: '',
    id: ''
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
  if (props.isEditStatus) {
    emit('edit-status-change', false);
    hasSelectedDelete.value = false;
  } else {
    emit('edit-status-change', true);
    hasSelectedDelete.value = true;
  }
};

const onCancel = () => {
  dialogVisible.value = false;
};

const ruleFormRef = ref(null);

const onConfirm = () => {
  ruleFormRef.value.validate(valid => {
    if (!valid) {
      return false;
    }
    const { id, name } = form.value;
    if (!name) {
      dialogVisible.value = false;
      return;
    }

    if (props.isEditStatus) {
      updateTag({
        tagId: id,
        tagName: name
      });
      dialogVisible.value = false;
    } else {
      createTag(form.value.name);
      dialogVisible.value = false;
    }
  });
};

const onClosed = () => {
  hasSelectedEdit.value = false;
  hasSelectedDelete.value = false;
  setTimeout(() => {
    clearForm();
    emit('edit-status-change', false);
  }, 100);
};
</script>

<style lang="scss">
.tag-operation {
  padding-top: 20px;
}
</style>
