export function getFoldersByBookmarkTreeNodes(bookmarkTreeNodes, folders, preFolderName = '') {
  // const folders = [];
  for (const bookmarkTreeNode of bookmarkTreeNodes) {
    // 判断是不是 bookmark
    if ('url' in bookmarkTreeNode) {
      continue;
    }
    const folderName = preFolderName ? preFolderName + '/' + bookmarkTreeNode.title : bookmarkTreeNode.title;
    folders.push({
      id: bookmarkTreeNode.id,
      title: folderName
    });
    if ('children' in bookmarkTreeNode) {
      getFoldersByBookmarkTreeNodes(bookmarkTreeNode['children'], folders, folderName);
    }
  }
}
