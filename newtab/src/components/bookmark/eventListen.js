import { ref } from 'vue';
import { useTags } from '../tags/tags';

const { nodeandtags } = useTags();

const nodes = ref([]);

const currentFolderId = ref(null);

const getNodes = async () => {
  const subNodes = await chrome.bookmarks.getChildren(currentFolderId.value);

  const tempNodes = [];
  for (const node of subNodes) {
    tempNodes.push({
      id: node.id,
      title: node.title,
      isFolder: !node.url,
      url: node.url || '',
      tagIds: nodeandtags.value.filter(item => item.nodeId === node.id).map(item => item.tagId)
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

chrome.bookmarks.onRemoved.addListener((id, bookmark) => {
  // 当前folder 需要刷新
  if (bookmark.parentId === currentFolderId.value) {
    getNodes();
  }
});

chrome.bookmarks.onChanged.addListener((id, bookmark) => {
  // 当前folder的一级node变化 需要刷新
  if (nodes.value.some(node => node.id === id)) {
    getNodes();
  }
});

chrome.bookmarks.onMoved.addListener((id, bookmark) => {
  // 当前folder 需要刷新
  if (bookmark.parentId === currentFolderId.value || bookmark.oldParentId === currentFolderId.value) {
    getNodes();
  }
});

export function useNodes() {
  return { nodes, currentFolderId, getNodes };
}
