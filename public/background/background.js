// let color = '#3aa757';

// const { FOLDER } = import('../utils/setting');
// import { FOLDER } from '../../utils/setting';

const FOLDER = 'pineconee';

// chrome.runtime.onInstalled.addListener(() => {
//   // chrome.storage.sync.set({ color });
//   // console.log('Default background color set to %cgreen', `color: ${color}`);\
//   console.log('background.js onInstalled');
// });

// chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
//   console.log(id, changeInfo);
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, payload } = request;

  switch (action) {
    case 'create tag':
      console.log('create tag', payload);
      break;
  }
  sendResponse();
});

// // 后台的初始化，在 chrome 启动的时候运行
// async function init() {
//   console.log('background.js init');
//   // 获取存储的数据
//   // const data = await getData();
//   // set的时候，不会替换其他的key
//   await chrome.storage.sync.set({
//     name: 'hello'
//   });

//   await chrome.storage.sync.set({
//     age: 1231321
//   });

//   // 取值的时候可以分开取值
//   const data = await chrome.storage.sync.get('name');

//   console.log(data);
// }

// init();
