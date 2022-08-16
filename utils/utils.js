// 根据getSubTree获取的bookmarkTreeNodes，拿到所有级别的folder列表
const getFoldersByBookmarkTreeNodes = (bookmarkTreeNodes, folders, preFolderName = '') => {
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
};

const aa = [
  {
    children: [
      {
        dateAdded: 1660091168701,
        id: '752',
        index: 0,
        parentId: '751',
        title: 'chrome.bookmarks - Chrome Developers',
        url: 'https://developer.chrome.com/docs/extensions/reference/bookmarks/#method-search'
      },
      {
        children: [
          {
            dateAdded: 1660093802008,
            id: '754',
            index: 0,
            parentId: '753',
            title: '掘金课程',
            url: 'https://juejin.cn/course'
          },
          {
            children: [
              {
                dateAdded: 1660110437694,
                id: '762',
                index: 0,
                parentId: '761',
                title: '百度翻译-200种语言互译、沟通全世界！',
                url: 'https://fanyi.baidu.com/translate?aldtype=16047&query=&keyfrom=baidu&smartresult=dict&lang=auto2zh#zh/en/%E5%89%8D%E7%BD%AE'
              }
            ],
            dateAdded: 1660110436011,
            dateGroupModified: 1660110442660,
            id: '761',
            index: 1,
            parentId: '753',
            title: '23423驱动器额1'
          }
        ],
        dateAdded: 1660093788976,
        dateGroupModified: 1660110437694,
        id: '753',
        index: 1,
        parentId: '751',
        title: '新建文件夹'
      }
    ],
    dateAdded: 1660015576029,
    dateGroupModified: 1660093802008,
    id: '751',
    index: 18,
    parentId: '1',
    title: 'pineconee'
  }
];

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

const bb = [];

getTreeByBookmarkTreeNodes(aa, bb);

export { getFoldersByBookmarkTreeNodes, getTreeByBookmarkTreeNodes };
