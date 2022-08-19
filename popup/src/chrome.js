import { DEFAULTFOLDER } from '../../utils/setting';

const getTreeByBookmarkTreeNodes = (bookmarkTreeNodes, trees) => {
  for (const bookmarkTreeNode of bookmarkTreeNodes) {
    // 判断是不是 bookmark
    if ('url' in bookmarkTreeNode) {
      continue;
    }
    const tree = {
      value: bookmarkTreeNode.id,
      label: bookmarkTreeNode.title
    };

    trees.push(tree);

    if ('children' in bookmarkTreeNode) {
      tree.children = [];
      getTreeByBookmarkTreeNodes(bookmarkTreeNode['children'], tree.children);
    }
  }
};

const getTree = async () => {
  // 搜索下 workspace
  const searchBookmarkTreeNodes = await chrome.bookmarks.search(DEFAULTFOLDER);
  const BookmarkTreeNodes = await chrome.bookmarks.getSubTree(searchBookmarkTreeNodes[0].id);
  const tree = [];
  getTreeByBookmarkTreeNodes(BookmarkTreeNodes, tree);
  return tree;
};

// 获取当前tab信息
const getCurrentTab = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return tab;
};

export { getTree, getCurrentTab };
