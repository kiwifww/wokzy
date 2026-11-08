# Wokzy 一镬熟 · 暖红手绘体验版

中文个人菜谱应用，面向手机和电脑浏览器。无需安装依赖。

## 手机体验

打开 **https://kiwifww.github.io/wokzy/**，无需登录、无需安装。

原有体验链接：https://wokzy.kiwifww.chatgpt.site/

当前为暖番茄红与米白主题，采用 C 方案笔刷手绘食材图标。

## 本地运行

在当前目录运行 `node server.mjs`，打开终端显示的 `http://127.0.0.1:4173`。

## 已实现

- 食材与常备调料的添加、编辑、移除；可选库存数量和单位。
- 基于菜谱库的推荐、别名匹配、缺料与用量状态、兼容单位换算。
- 六道示例菜谱；名称、食材与标签搜索；收藏与筛选。
- 份数调整、缺料清单复制、烹饪步骤及进度恢复。
- 创建与编辑个人菜谱，手动整理网络参考内容并保留来源链接。
- 做菜心得、浏览器数据保存、JSON 备份导出、体验反馈记录与复制。
- 食材统一使用本地手绘 PNG，共 36 张；未知食材使用通用食材袋，不依赖 emoji 字体。

数据使用当前站点的浏览器 localStorage，不含账号和跨设备同步。不同设备或域名的数据独立保存。首次打开为空食材库，用户可主动填入示例。测试与本地预览数据不随部署上传。

网页自动导入、视频理解和 Bilibili 提取尚未实现；界面明确引导使用手动整理。示例步骤为 Wokzy 整理，图片是成品参考；图片出处在每份菜谱详情中标注。

## 检查

`node --test tests/*.test.mjs`

当前手绘图位于 `dist/assets/brush-ingredients/`，名称映射和未知食材的通用图定义在 `dist/ingredient-icons.js`。历史像素图保留供参考，当前界面使用手绘版。已有浏览器记录无需迁移。

需求依据见上级目录 `docs/requirements-v0.1.md`。静态产物位于 `dist/`，Sites 身份和部署配置保存在 `.openai/hosting.json`。

## GitHub Pages 发布

推送到 `main` 后，GitHub Actions 自动运行测试，并将 `dist/` 发布到 GitHub Pages。工作流为 `.github/workflows/pages.yml`。

GitHub Pages 仓库设置应选择 GitHub Actions 作为发布来源。部署不需要 Sites 或其他服务密钥；`.openai/hosting.json` 仅保留原 Sites 项目标识。
