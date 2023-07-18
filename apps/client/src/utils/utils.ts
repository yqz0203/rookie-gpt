export function copyToClipboard(text: string) {
  // 创建一个临时的div元素
  const div = document.createElement('div');
  // 设置要复制的文本内容
  div.textContent = text;
  // 将div元素添加到页面中
  document.body.appendChild(div);

  // 创建一个新的Range对象
  const range = document.createRange();
  // 选择div元素中的文本内容
  range.selectNodeContents(div);

  // 获取当前的选择对象
  const selection = window.getSelection();

  if (!selection) return;

  // 移除所有的范围
  selection.removeAllRanges();
  // 添加Range对象到选择对象中
  selection.addRange(range);

  // 执行复制命令
  document.execCommand('copy');

  // 清除选择对象的内容
  selection.removeAllRanges();

  // 移除div元素
  document.body.removeChild(div);
}
