# 燕云行笺

面向小型玩家群体的《燕云十六声》静态知识与清单网站。无需构建工具或后端，可直接部署到 GitHub Pages。

## 本地预览

在仓库目录运行任意静态文件服务器，例如 `python -m http.server 8000`，然后访问 `http://localhost:8000`。

## 数据维护

周期活动源资料来自 `../raw-data/WWM Daily_Weekly_Monthly.xlsx`，网站数据位于 `data/activities.js`。限时活动源资料来自 `../raw-data/WWM Limited Time Events.xlsx`，网站数据位于 `data/limited-events.json`。两者均与 HTML 展示逻辑分离，更新工作簿后需同步转换对应数据文件。

用户完成状态保存在浏览器 `localStorage`，并按北京时间在每日 05:00、每周一 05:00、每月 1 日 05:00 自动切换到新的清单周期。

## GitHub Pages

在仓库 Settings → Pages 中选择从 `main` 分支根目录发布即可。
