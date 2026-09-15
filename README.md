# 燕云行笺

面向小型玩家群体的《燕云十六声》静态知识与清单网站。无需构建工具或后端，可直接部署到 GitHub Pages。

## 本地预览

在本 README 所在的 `wwm-knowledge-site` 目录运行任意静态文件服务器，例如 `python -m http.server 8000`，然后访问 `http://localhost:8000`。首页自动跳转到 `zh-Hans/checklist.html`。

## 页面结构

每篇攻略都是独立的 HTML 文件，正文直接保存在该文件中。无需构建工具即可发布。

```text
index.html                         # 默认跳转及旧书签兼容
zh-Hans/
  checklist.html
  no-miss/
    hexi-glazed-tiles.html
    merchants.html
  guild/
    activity-guide.html
    perk-guide.html
  wiki/
    develop/
      divinecraft.html
      stores-must-buy.html
      energy-well-spent.html
    farm/
      fire-oil-farming.html
      mohist-blueprint.html
    jianghu/
      trading-guide.html
scripts/
  pages.js                         # 页面路径、分类、栏目默认页、旧链接映射
  locales/zh-Hans.js                # 导航和动态界面的简体中文文案
  site.js                          # 共享导航、目录、页脚和图片查看器
  checklist.js                     # 仅清单页加载的清单逻辑
  redirect.js                      # 入口页跳转
  verify.cjs                       # 可选的 Node.js 校验工具
styles.css                         # 共享样式
assets/                            # 共享图片，保留原有作者署名
data/                              # 活动数据
pages/                             # 原始攻略文档，不是网页发布路径
```

路径规则为 `<lang>/<main-feature>/[category/]<page>.html`；清单是独立栏目页 `<lang>/checklist.html`。分类只作为文件夹和侧栏分组，没有额外的目录首页。顶栏进入每个栏目配置的默认攻略。旧的 `#knowledge/...`、`#guild/...`、`#must-do/...` 书签从根目录入口自动跳转到对应的新页面。

### 新增页面

1. 先请网站所有者提供或确认页面路径名称，使用小写英文与连字符，并以 `.html` 结尾。
2. 在 `scripts/pages.js` 中登记稳定的页面 ID、路径、栏目和可选分类。在 `scripts/locales/zh-Hans.js` 中添加显示名称；顶栏和侧栏由这两处定义统一生成。
3. 复制同栏目现有页面作为外壳，填写正文，并更新 `data-page`、标题、描述和资源相对路径。页面越深，指向根目录的 `../` 越多。
4. 仅清单页加载活动数据及 `scripts/checklist.js`；攻略页直接包含正文，并加载共享脚本。保留图片署名和来源链接。
5. 运行 `node scripts/verify.cjs`，再通过静态服务器检查新页面、图片和手机布局。

### 多语言

当前仅发布 `zh-Hans`。`zh-Hant` 和 `en` 在语言配置中标记为未启用，不显示不可用的语言入口。未来翻译时，以相同页面 ID 和路径在对应语言目录创建 HTML，设置正确的 `<html lang>`，添加并加载相应的 `scripts/locales/<lang>.js`。正文及清单表单文字在语言目录的 HTML 中维护；共享动态文字在语言文案文件中维护。活动名称、奖励等数据内容也需要对应语言版本。全部准备好后再启用该语言并提供切换入口。

链接以站点脚本的位置为基准解析，因此可部署于域名根目录或 GitHub Pages 的仓库子路径。切换页面不会改变 `localStorage` 的原有键或活动 ID；在相同域名下保留用户的完成状态。

## 数据维护

周期活动源资料来自 `../raw-data/WWM Daily_Weekly_Monthly.xlsx`，网站数据位于 `data/activities.js`。限时活动源资料来自 `../raw-data/WWM Limited Time Events.xlsx`，网站数据位于 `data/limited-events.json`。两者均与 HTML 展示逻辑分离，更新工作簿后需同步转换对应数据文件。

用户完成状态保存在浏览器 `localStorage`，并按北京时间在每日 05:00、每周一 05:00、每月 1 日 05:00 自动切换到新的清单周期。

## GitHub Pages

在仓库 Settings → Pages 中选择从 `main` 分支根目录发布即可。发布根目录应包含此处的 `index.html`、`zh-Hans/`、`scripts/`、`assets/`、`data/` 和 `styles.css`。保留 `.nojekyll`，不需要 SPA 路由回退或构建流程。
