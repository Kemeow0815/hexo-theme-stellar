/**
 * 字数统计
 * @param {string} content - 文章内容
 * @returns {number} 字数
 */
hexo.extend.helper.register("wordcount", function (content) {
  if (!content) return 0;

  // 移除 HTML 标签
  const text = content.replace(/<[^>]+>/g, "");

  // 计算中文字符数
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;

  // 计算英文单词数
  const english = (text.match(/[a-zA-Z0-9_\u00C0-\u00FF]+/g) || []).length;

  return chinese + english;
});

/**
 * 阅读时长计算（分钟）
 * @param {string} content - 文章内容
 * @returns {number} 阅读时长（分钟）
 */
hexo.extend.helper.register("min2read", function (content) {
  if (!content) return 0;

  const words = this.wordcount(content);

  // 假设每分钟阅读 300 字
  const minutes = Math.ceil(words / 300);

  return minutes > 0 ? minutes : 1;
});
