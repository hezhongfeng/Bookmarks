import { ref, onMounted } from 'vue';

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
  await chrome.runtime.sendMessage({
    payload: {},
    action: 'tags update'
  });
};

const createTag = async tag => {
  if (tags.value.some(item => item === tag)) {
    return;
  }
  tags.value.push(tag);
  await chrome.storage.sync.set({
    TAGS: tags.value.map(item => item)
  });
  // sendUpdateTagMessage();
};

const bindTag = async (tag, nodeId) => {
  if (nodeandtags.value.some(item => item.tag === tag && item.nodeId === nodeId)) {
    return;
  }
  nodeandtags.value.push({
    tag,
    nodeId
  });
  await chrome.storage.sync.set({
    NODEANDTAGS: nodeandtags.value.map(item => {
      return {
        tag: item.tag,
        nodeId: item.nodeId
      };
    })
  });
};

const getTags = async () => {
  let storageObj = await chrome.storage.sync.get('TAGS');
  tags.value = 'TAGS' in storageObj ? storageObj.TAGS : [];
};

export const useTags = () => {
  onMounted(() => {
    console.log(62, onMounted);
    listenUpdateTagMessage();
    getTags();
  });
  return { tags, createTag, bindTag, sendUpdateTagMessage, getTags };
};
