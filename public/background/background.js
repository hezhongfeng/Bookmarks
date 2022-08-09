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
});
