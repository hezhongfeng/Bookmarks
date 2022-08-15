import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const tags = ref([]);
const nodeandtags = ref([]);

const listenUpdateTagMessage = async () => {
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const { action, payload } = request;

    switch (action) {
      case 'tags update':
        console.log('tags update', payload);
        await getTags();
        break;
    }
    sendResponse();
  });
};

const sendUpdateTagMessage = async () => {
  chrome.runtime.sendMessage(
    {
      payload: {},
      action: 'tags update'
    },
    function (response) {
      console.log('response', response);
    }
  );
};

const createTag = async name => {
  if (tags.value.some(item => item.name === name)) {
    return;
  }
  tags.value.push({
    name,
    id: uuidv4()
  });
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

const bindTag = async (tagId, nodeId) => {
  if (nodeandtags.value.some(item => item.tagId === tagId && item.nodeId === nodeId)) {
    return;
  }
  nodeandtags.value.push({
    tagId,
    nodeId
  });
  await chrome.storage.sync.set({
    NODEANDTAGS: nodeandtags.value.map(item => {
      return {
        tagId: item.tagId,
        nodeId: item.nodeId
      };
    })
  });
};

const bindTags = async (tagIds, nodeId) => {
  // 解绑所有
  while (nodeandtags.value.some(item => item.nodeId === nodeId)) {
    nodeandtags.value.splice(
      nodeandtags.value.find(item => item.nodeId === nodeId),
      1
    );
  }
  for (const tagId of tagIds) {
    nodeandtags.value.push({
      tagId,
      nodeId
    });
  }
  await chrome.storage.sync.set({
    NODEANDTAGS: nodeandtags.value.map(item => {
      return {
        tagId: item.tagId,
        nodeId: item.nodeId
      };
    })
  });
};

const updateTag = async ({ tagId, tagName }) => {
  tags.value.find(item => item.id === tagId).nameq = tagName;
};

const getTags = async () => {
  let storageObj = await chrome.storage.sync.get('TAGS');
  tags.value = 'TAGS' in storageObj ? storageObj.TAGS : [];
};

const getNodeandtags = async () => {
  let storageObj = await chrome.storage.sync.get('NODEANDTAGS');
  nodeandtags.value = 'NODEANDTAGS' in storageObj ? storageObj.NODEANDTAGS : [];
};

listenUpdateTagMessage();
getTags();
getNodeandtags();

export const useTags = () => {
  return { tags, nodeandtags, createTag, bindTag, bindTags, sendUpdateTagMessage, getTags, updateTag };
};
