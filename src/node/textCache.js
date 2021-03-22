export default {
  list: [], // 每次渲染前的更新后，等待测量的文字对象列表
  data: {}, // Text中存入的特殊等待测量的信息，字体+字号+粗细为key
  charWidth: {}, // key的文字宽度hash
  padding: {}, // key的文字宽度偏移，少量字体的少量文字有
  ELLIPSIS: '…',
};
