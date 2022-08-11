import { ref, onMounted } from 'vue';

const nodes = ref([]);

const currentFolderId = ref(null);

const getNodes = async () => {
  const subTree = await chrome.bookmarks.getSubTree(currentFolderId.value);

  const tempNodes = [];
  for (const node of subTree[0].children) {
    tempNodes.push({
      id: node.id,
      title: node.title,
      idFolder: !node.url,
      url: node.url || ''
    });
  }

  nodes.value = tempNodes;
};

// 处理来自chrome的关于bookmark的事件
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  // 当前folder 需要刷新
  if (bookmark.parentId === currentFolderId.value) {
    getNodes();
  }
});

// chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
//   chrome.runtime.sendMessage({ id, removeInfo, action: 'delete' }, function (response) {
//     response && console.log(response.farewell);
//   });
// });

// chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
//   chrome.runtime.sendMessage({ id, changeInfo, action: 'change' }, function (response) {
//     console.log(response.farewell);
//   });
// });

// chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
//   chrome.runtime.sendMessage({ id, moveInfo, action: 'move' }, function (response) {
//     console.log(response.farewell);
//   });
// });

export function useNodes() {
  return { nodes, currentFolderId, getNodes };
}
