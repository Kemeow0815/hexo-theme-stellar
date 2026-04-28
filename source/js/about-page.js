/**
 * 关于页面动画脚本
 * 实现文字轮播滚动效果 - 一段话完全上去后再出现下一段话
 */

(function () {
  "use strict";

  // 全局定时器存储，用于 PJAX 切换时清理
  let textCarouselTimer = null;

  // 等待DOM加载完成
  function initAboutPage() {
    // 检查是否在关于页面
    const aboutPage = document.getElementById("about-page");
    if (!aboutPage) return;

    // 文字轮播动画
    initTextCarousel();
  }

  // 文字轮播动画实现
  // 效果：一段话完全上去后再出现下一段话
  function initTextCarousel() {
    const mask = document.querySelector(".aboutsiteTips .mask");
    if (!mask) return;

    const spans = mask.querySelectorAll("span");
    if (spans.length < 2) return;

    // 清理旧的定时器
    if (textCarouselTimer) {
      clearInterval(textCarouselTimer);
      textCarouselTimer = null;
    }

    let currentIndex = 0;
    const interval = 2500; // 每段话显示2.5秒后切换

    // 初始化所有span的状态
    // 第一个显示，其他都在下方等待
    function initStates() {
      spans.forEach((span, index) => {
        span.removeAttribute("data-show");
        span.removeAttribute("data-up");
        span.removeAttribute("data-wait");

        if (index === 0) {
          // 第一个：显示状态（在中间）
          span.setAttribute("data-show", "");
        } else {
          // 其他：等待状态（在下方）
          span.setAttribute("data-wait", "");
        }
      });
    }

    // 切换到下一个
    function rotate() {
      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % spans.length;

      spans.forEach((span, index) => {
        span.removeAttribute("data-show");
        span.removeAttribute("data-up");
        span.removeAttribute("data-wait");

        if (index === currentIndex) {
          // 当前要显示的：从下方移动到中间
          span.setAttribute("data-show", "");
        } else if (index === prevIndex) {
          // 上一个：从中间移动到上方
          span.setAttribute("data-up", "");
        } else {
          // 其他：在下方等待
          span.setAttribute("data-wait", "");
        }
      });
    }

    // 初始化
    initStates();

    // 启动定时器
    textCarouselTimer = setInterval(rotate, interval);
  }

  // 初始化入口
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAboutPage);
  } else {
    initAboutPage();
  }

  // PJAX 完成后重新初始化
  document.addEventListener("pjax:complete", function () {
    // 清理旧定时器
    if (textCarouselTimer) {
      clearInterval(textCarouselTimer);
      textCarouselTimer = null;
    }
    // 重新初始化
    initAboutPage();
  });

  // 导出到全局，供 PJAX 使用
  window.initAboutPage = initAboutPage;
})();
