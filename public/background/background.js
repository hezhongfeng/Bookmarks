// let color = '#3aa757';

const FOLDER = 'pineconee';

chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color });
  // console.log('Default background color set to %cgreen', `color: ${color}`);\
  console.log('background.js onInstalled');
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log(id, changeInfo);
});

// 只能先搜索一个文件夹，或者成为workspace
chrome.bookmarks.search(FOLDER, BookmarkTreeNodes => {
  // BookmarkTreeNodes是个列表，使用第一个就行，node的数据格式
  // {
  //   dateAdded: 1660015576029;
  //   dateGroupModified: 1660015576029;
  //   id: '751';
  //   index: 18;
  //   parentId: '1';
  //   title: 'pineconee';
  // }
  console.log(BookmarkTreeNodes);

  // 查询文件夹下的所有子节点
  // [
  //   {
  //     "children": [
  //       {
  //         "dateAdded": 1660091168701,
  //         "id": "752",
  //         "index": 0,
  //         "parentId": "751",
  //         "title": "chrome.bookmarks - Chrome Developers",
  //         "url": "https://developer.chrome.com/docs/extensions/reference/bookmarks/#method-search"
  //       }
  //     ],
  //     "dateAdded": 1660015576029,
  //     "dateGroupModified": 1660091171834,
  //     "id": "751",
  //     "index": 18,
  //     "parentId": "1",
  //     "title": "pineconee"
  //   }
  // ]
  chrome.bookmarks.getSubTree(BookmarkTreeNodes[0].id, subTree => {
    console.log(subTree);
  });
});

chrome.bookmarks.create({
  title: 'pineconee1',
  // parentId: '1', 顶级目录Id是1
  parentId: '1'
});
