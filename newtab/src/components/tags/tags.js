import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const tags = ref([]);
const nodeandtags = ref([]);

chrome.bookmarks.onRemoved.addListener(async (id, bookmark) => {
  // 把此 node 的所有关联解除
  while (nodeandtags.value.some(item => item.nodeId === id)) {
    const index = nodeandtags.value.findIndex(item => item.nodeId === id);
    nodeandtags.value.splice(index, 1);
  }
  await saveNodeandtags();
});

const listenUpdateTagMessage = async () => {
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const { action, payload } = request;

    switch (action) {
      case 'tags update':
        await getTags();
        break;

      case 'nodeandtags update':
        await getNodeandtags();
        break;
    }
    sendResponse();
  });
};

const sendUpdateTagMessage = async (action = 'tags update') => {
  chrome.runtime
    .sendMessage({
      payload: {},
      action
    })
    .then(response => {
      console.log('response', response);
    })
    .catch(() => {});
};

const createTag = async name => {
  if (tags.value.some(item => item.name === name)) {
    return;
  }
  tags.value.push({
    name,
    id: uuidv4()
  });
  await saveTags();
};

const deleteTag = async tagId => {
  // 先把此 tag 的所有关联解除
  while (nodeandtags.value.some(item => item.tagId === tagId)) {
    const index = nodeandtags.value.findIndex(item => item.tagId === tagId);
    nodeandtags.value.splice(index, 1);
  }
  await saveNodeandtags();

  tags.value.splice(
    tags.value.findIndex(item => item.id === tagId),
    1
  );
  await saveTags();
};

const bindTags = async (tagIds, nodeId) => {
  // 解绑这个 node 的所有 tag
  while (nodeandtags.value.some(item => item.nodeId === nodeId)) {
    const index = nodeandtags.value.findIndex(item => item.nodeId === nodeId);
    nodeandtags.value.splice(index, 1);
  }
  // 重新绑定
  for (const tagId of tagIds) {
    nodeandtags.value.push({
      tagId,
      nodeId
    });
  }
  saveNodeandtags();
};

const updateTag = async ({ tagId, tagName }) => {
  tags.value.find(item => item.id === tagId).name = tagName;
  await saveTags();
};

const getTags = async () => {
  let storageObj = await chrome.storage.sync.get('TAGS');
  tags.value = 'TAGS' in storageObj ? storageObj.TAGS : [];
};

const saveTags = async () => {
  await chrome.storage.sync.set({
    TAGS: tags.value.map(item => {
      return {
        name: item.name,
        id: item.id
      };
    })
  });
  sendUpdateTagMessage();
};

const saveNodeandtags = async () => {
  await chrome.storage.sync.set({
    NODEANDTAGS: nodeandtags.value.map(item => {
      return {
        tagId: item.tagId,
        nodeId: item.nodeId
      };
    })
  });
  sendUpdateTagMessage('nodeandtags update');
};

const getNodeandtags = async () => {
  let storageObj = await chrome.storage.sync.get('NODEANDTAGS');
  nodeandtags.value = 'NODEANDTAGS' in storageObj ? storageObj.NODEANDTAGS : [];
};

listenUpdateTagMessage();
getTags();
getNodeandtags();

export const useTags = () => {
  return { tags, nodeandtags, createTag, bindTags, sendUpdateTagMessage, getTags, updateTag, deleteTag };
};
