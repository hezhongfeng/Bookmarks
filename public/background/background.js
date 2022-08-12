// // let color = '#3aa757';

// // const { FOLDER } = import('../utils/setting');
// // import { FOLDER } from '../../utils/setting';

// const FOLDER = 'pineconee';
// const TAGS = 'TAGS';
// const NODEANDTAGS = 'NODEANDTAGS';

// let tags = [];
// let nodeandtags = [];

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   const { action, payload } = request;

//   switch (action) {
//     case 'create tag':
//       console.log('create tag', payload);
//       await createTag(payload.tag);
//       await bindTag(payload.tag, payload.node.id);
//       break;
//   }
//   sendResponse();
// });

// const createTag = async tag => {
//   console.log('create tag', tag);
//   if (tags.some(item => item === tag)) {
//     return;
//   }
//   tags.push(tag);
//   console.log('tags', {
//     TAGS: tags
//   });
//   await chrome.storage.sync.set({
//     TAGS: tags
//   });
//   await chrome.runtime.sendMessage({
//     payload: {},
//     action: 'tags update'
//   });
// };

// const bindTag = async (tag, nodeId) => {
//   if (nodeandtags.some(item => item.tag === tag && item.nodeId === nodeId)) {
//     return;
//   }
//   nodeandtags.push({
//     tag,
//     nodeId
//   });
//   await chrome.storage.sync.set({
//     NODEANDTAGS: nodeandtags
//   });
// };

// // 后台的初始化，在 chrome 启动的时候运行
// async function init() {
//   // 取值的时候可以分开取值
//   let storageObj = await chrome.storage.sync.get(TAGS);
//   tags = TAGS in storageObj ? storageObj.TAGS : [];

//   console.log('tags', tags);

//   storageObj = await chrome.storage.sync.get(NODEANDTAGS);
//   nodeandtags = NODEANDTAGS in storageObj ? storageObj.NODEANDTAGS : [];

//   console.log('nodeandtags', nodeandtags);
// }

// init();
