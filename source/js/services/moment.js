/**
 * Moment 侧边栏组件 - 即刻短文数据获取
 * 数据格式参考: https://tgtalk.kemeow.top/
 */

utils.jq(() => {
  $(function () {
    const moments = document.getElementsByClassName("ds-moment");

    for (var i = 0; i < moments.length; i++) {
      const el = moments[i];
      const api = el.dataset.api;

      if (api == null) {
        console.warn("[moment] API 地址未设置");
        continue;
      }

      // 添加加载状态
      $(el).html(
        '<div class="loading-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="60"><animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" values="60;0;60"/></circle></svg><span>加载中...</span></div>',
      );

      // 请求数据
      utils.request(
        el,
        api,
        async (resp) => {
          try {
            const data = await resp.json();
            const messages = data.ChannelMessageData || [];

            // 清空加载状态
            $(el).empty();

            // 限制显示数量
            const limit = parseInt(el.getAttribute("limit")) || 5;
            const displayMessages = messages.slice(0, limit);

            if (displayMessages.length === 0) {
              $(el).append(
                '<div class="timenode empty"><div class="body"><p>暂无动态</p></div></div>',
              );
              return;
            }

            displayMessages.forEach((item, index) => {
              var cell = '<div class="timenode" index="' + index + '">';

              // 头部：时间
              cell += '<div class="header">';
              if (item.time) {
                const date = new Date(item.time);
                cell +=
                  '<span class="time">' +
                  date.toLocaleString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                  "</span>";
              }
              if (item.views) {
                cell += '<span class="views">👁 ' + item.views + "</span>";
              }
              cell += "</div>";

              // 内容体
              cell += '<div class="body">';

              // 文本内容 - 处理 HTML 和分隔线
              if (item.text) {
                let processedText = item.text;
                // 处理 Telegram 表情 HTML
                processedText = processedText.replace(
                  /<i\s+class="emoji"[^>]*><b>([^<]+)<\/b><\/i>/g,
                  "$1",
                );
                // 处理 Markdown 分隔线 ---
                processedText = processedText.replace(
                  /---/g,
                  '<hr style="border:none;border-top:2px solid var(--block-border);margin:12px 0;"/>',
                );
                cell += '<div class="content">' + processedText + "</div>";
              }

              // 图片 - 支持 fancybox 灯箱
              if (item.image && item.image.length > 0) {
                // 过滤掉 emoji 图片
                const validImages = item.image.filter(
                  (img) => img && !img.includes("telegram.org/img/emoji"),
                );

                if (validImages.length > 0) {
                  cell += '<div class="images">';
                  validImages.forEach((img, imgIndex) => {
                    cell += '<div class="image-item">';
                    // 使用 fancybox 包裹图片，添加 data-fancybox 属性
                    cell +=
                      '<a href="' +
                      img +
                      '" data-fancybox="moment-gallery-' +
                      index +
                      '" data-caption="">';
                    cell +=
                      '<img src="' +
                      img +
                      '" alt="moment image" loading="lazy">';
                    cell += "</a>";
                    cell += "</div>";
                  });
                  cell += "</div>";
                }
              }

              cell += "</div>"; // end body
              cell += "</div>"; // end timenode

              $(el).append(cell);
            });

            // 添加懒加载支持
            if (window.wrapLazyloadImages) {
              window.wrapLazyloadImages(el);
            }

            // 初始化 fancybox（如果可用）
            if (typeof Fancybox !== "undefined") {
              Fancybox.bind('[data-fancybox="moment-gallery"]');
            }
          } catch (error) {
            console.error("[moment] 解析数据错误:", error);
            $(el).html(
              '<div class="timenode error"><div class="body"><p>数据解析失败</p></div></div>',
            );
          }
        },
        () => {
          // 加载失败回调
          console.error("[moment] 加载失败:", api);
          $(el).html(
            '<div class="timenode error"><div class="body"><p>加载失败，请检查网络连接</p></div></div>',
          );
        },
      );
    }
  });
});
