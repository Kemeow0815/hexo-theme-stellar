/**
 * 计算全站文章总字数
 * @returns {number} 总字数
 */
hexo.extend.helper.register('totalcount', function() {
  var total = 0;
  
  // 获取所有文章
  var posts = this.site.posts;
  
  // 遍历所有文章
  posts.forEach(function(post) {
    if (post.content) {
      // 移除 HTML 标签
      var text = post.content.replace(/<[^>]+>/g, '');
      
      // 计算中文字符数
      var chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
      
      // 计算英文单词数
      var english = (text.match(/[a-zA-Z0-9_\u00C0-\u00FF]+/g) || []).length;
      
      total += chinese + english;
    }
  });
  
  return total;
});
