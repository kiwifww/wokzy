# 食用手册数据快照

来源：https://github.com/YunYouJun/cook

固定提交：3e6930d315dd7be73e7d0e8a6304f43841a9de3c，下载于 2026-11-09。

- `recipe.csv`、`food.json`、`aliases.json`、`recipe-text.json`、`recipe-amounts.json` 下载自该提交的 `packages/data/`。
- `recipe.ts`、`recipe-text.ts` 为上游类型说明，来自 `packages/cook/src/types/`。
- `upstream-data.md` 为上游数据文档，来自 `docs/dev/data.md`。
- `LICENSE` 为 YunYouJun/cook MIT 许可原文。
- `HowToCook-LICENSE` 为正文来源 Anduin2017/HowToCook 在 0e106eea348c734fe1586f781202994439cf98a5 提交的 Unlicense 原文。
- `manifest.json` 保存来源、计数及原始文件 SHA-256。

共 887 道索引、232 份完整文字正文、675 个视频入口；视频和正文可能指向同一道菜谱。未下载视频、外链配图或第三方机构文章正文。

`node scripts/import-cook.mjs` 从原始快照重新生成 `dist/cook-data.js`；`node scripts/build-data-notice.mjs` 生成网页内可查看的数据来源与许可。

Wokzy 使用独立 ID 前缀 `cook-`。保留原始 CSV 主料索引，不把大类（米、面食、菌菇）悄悄等同于具体食材；不猜测缺失人数和耗时，也不把主料索引当作完整备料清单。正文区块完整保留，有文字步骤时按原文操作段落生成分步阅读。

用量只将精确同名的简单原方数值显示为原文用量。复杂公式、范围基准和未注明的信息保持待确认。导入配方暂不自动按人数缩放。

上游别名、食材表保留作为参考，目前不直接覆盖 Wokzy 的别名规则和手绘图标。
