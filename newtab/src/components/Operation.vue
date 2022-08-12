<template>
  <div class="operation">
    <el-row class="mb-4" justify="end">
      <el-button type="primary" :disabled="hasSelectedEdit || hasSelectedDelete" @click="onAdd">添加</el-button>
      <el-button type="primary" :disabled="hasSelectedCreate || hasSelectedDelete" @click="onEdit">编辑</el-button>
      <el-button type="primary" :disabled="hasSelectedCreate || hasSelectedEdit" @click="onDelete">删除</el-button>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Add" width="40%" @close="onClosed">
      <el-form label-width="120px" :model="form" style="max-width: 460px">
        <el-form-item>
          <el-checkbox v-show="!isEditStatus" v-model="form.isFolder">isFolder</el-checkbox>
        </el-form-item>
        <el-form-item v-show="!form.isFolder" label="URL">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item :label="form.isFolder ? 'FolderName' : 'Bookmark Name'">
          <el-input v-model="form.title" />
        </el-form-item>
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
import { ref, watch, nextTick } from 'vue';
import { ElMessageBox } from 'element-plus';

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

const isDelete = ref(false);

const hasSelectedCreate = ref(false);
const hasSelectedEdit = ref(false);
const hasSelectedDelete = ref(false);

const emit = defineEmits(['edit-status-change']);

watch(
  () => props.selectedNode,
  newVal => {
    if (newVal) {
      if (isDelete.value) {
        ElMessageBox.confirm('确定删除所选?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await chrome.bookmarks.remove(props.selectedNode.id);
          })
          .finally(() => {
            isDelete.value = false;
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

const dialogVisible = ref(false);

const sendMessage = (payload, action) => {
  chrome.runtime.sendMessage({ payload, action }, function (response) {
    console.log('response', response);
  });
};

const form = ref({
  tag: '',
  title: '',
  url: '',
  isFolder: false
});

const onAdd = () => {
  hasSelectedCreate.value = true;
  dialogVisible.value = true;
};

const onEdit = () => {
  if (hasSelectedEdit.value) {
    hasSelectedEdit.value = false;
    emit('edit-status-change', false);
  } else {
    hasSelectedEdit.value = true;
    emit('edit-status-change', true);
  }
};

const onDelete = () => {
  if (hasSelectedDelete.value) {
    isDelete.value = false;
    hasSelectedDelete.value = false;
    emit('edit-status-change', false);
  } else {
    isDelete.value = true;
    hasSelectedDelete.value = true;
    emit('edit-status-change', true);
  }
};

const clearForm = () => {
  isDelete.value = false;
  form.value = {
    tag: '',
    title: '',
    url: '',
    isFolder: false
  };
  hasSelectedCreate.value = false;
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
  sendMessage(node, 'create tag');
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
};

const onConfirm = async () => {
  if (props.isEditStatus) {
    await edit();
  } else {
    await create();
  }

  dialogVisible.value = false;
};

const onCancel = () => {
  dialogVisible.value = false;
  emit('edit-status-change', false);
};

const onClosed = () => {
  clearForm();
  emit('edit-status-change', false);
};
</script>

<style lang="scss">
.operation {
  height: 20%;
  padding-top: 10px;
}
</style>
