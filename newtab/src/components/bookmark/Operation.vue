<template>
  <div class="operation">
    <el-row class="mb-4" justify="end">
      <el-button type="primary" :disabled="hasSelectedEdit || hasSelectedDelete" @click="onAdd">添加</el-button>
      <el-button type="primary" :disabled="hasSelectedDelete" @click="onEdit">编辑</el-button>
      <el-button type="primary" :disabled="hasSelectedEdit" @click="onDelete">删除</el-button>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Add" width="40%" @close="onClosed">
      <el-form ref="ruleFormRef" label-width="120px" :model="form" :rules="rules" status-icon style="max-width: 460px">
        <el-form-item>
          <el-checkbox v-show="!isEditStatus" v-model="form.isFolder">isFolder</el-checkbox>
        </el-form-item>
        <el-form-item v-show="!form.isFolder" label="URL" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item :label="form.isFolder ? 'FolderName' : 'Bookmark Name'">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item v-show="!form.isFolder" label="Tag">
          <el-select v-model="form.tagIds" multiple placeholder="Choose or Create tags">
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
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
import { ref, watch, nextTick } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useTags } from '../tags/tags';

const ruleFormRef = ref(null);

const { bindTags, tags } = useTags();

const props = defineProps({
  parentId: {
    type: String,
    default: '1'
  },
  isEditStatus: {
    type: Boolean,
    default: false
  },
  selectedNode: {
    type: Object,
    default: () => ({})
  }
});

const hasSelectedEdit = ref(false);
const hasSelectedDelete = ref(false);

const emit = defineEmits(['edit-status-change']);

watch(
  () => props.selectedNode,
  newVal => {
    if (newVal) {
      if (hasSelectedDelete.value) {
        ElMessageBox.confirm('确定删除所选?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await chrome.bookmarks.remove(props.selectedNode.id);
          })
          .finally(() => {
            hasSelectedDelete.value = false;
            emit('edit-status-change', false);
            dialogVisible.value = false;
          });
      } else {
        form.value = {
          ...newVal
        };
        nextTick(() => {
          dialogVisible.value = true;
        });
      }
    }
  }
);

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const dialogVisible = ref(false);

const form = ref({
  tagIds: [],
  title: '',
  url: '',
  isFolder: false
});

const validateUrl = (rule, value) => {
  return new Promise((resolve, reject) => {
    if (!isValidHttpUrl(value)) {
      reject('Please input a valid url');
    }
    resolve();
  });
};

const rules = ref({
  url: [
    { required: true, message: 'Please input url', trigger: 'blur' },
    { validator: validateUrl, trigger: 'blur' }
  ]
});

const onAdd = () => {
  dialogVisible.value = true;
};

const onEdit = () => {
  if (props.isEditStatus) {
    hasSelectedEdit.value = false;
    emit('edit-status-change', false);
  } else {
    hasSelectedEdit.value = true;
    emit('edit-status-change', true);
  }
};

const onDelete = () => {
  if (props.isEditStatus) {
    hasSelectedDelete.value = false;
    emit('edit-status-change', false);
  } else {
    hasSelectedDelete.value = true;
    emit('edit-status-change', true);
  }
};

const clearForm = () => {
  form.value = {
    tagIds: [],
    title: '',
    url: '',
    isFolder: false
  };
  hasSelectedEdit.value = false;
  hasSelectedDelete.value = false;
};

const create = async () => {
  const createDetails = {
    parentId: props.parentId,
    title: form.value.title,
    url: form.value.url
  };

  if (form.value.isFolder) {
    delete createDetails.url;
  }

  const node = await chrome.bookmarks.create(createDetails);

  bindTags(form.value.tagIds, node.id);
};

const edit = async () => {
  const id = props.selectedNode.id;

  const editDetails = {
    title: form.value.title,
    url: form.value.url
  };

  if (form.value.isFolder) {
    delete editDetails.url;
  }

  await chrome.bookmarks.update(id, editDetails);
  bindTags(form.value.tagIds, id);
};

const onConfirm = async () => {
  if (!form.value.isFolder) {
    ruleFormRef.value.validate(valid => {
      if (!valid) {
        return false;
      } else {
        confirm();
      }
    });
  } else {
    confirm();
  }
};

const confirm = async () => {
  if (props.isEditStatus) {
    await edit();
  } else {
    await create();
  }

  dialogVisible.value = false;
};

const onCancel = () => {
  dialogVisible.value = false;
};

const onClosed = () => {
  setTimeout(() => {
    clearForm();
    emit('edit-status-change', false);
  }, 100);
};
</script>

<style lang="scss">
.operation {
  padding-top: 20px;
  .el-select {
    width: 100%;
  }
}
</style>
