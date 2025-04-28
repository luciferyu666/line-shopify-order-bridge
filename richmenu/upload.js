#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * LINE Rich-Menu uploader
 * 使用方式：node richmenu/upload.js
 * 需求：環境變數 LINE_CHANNEL_ACCESS_TOKEN 必須存在
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import chalk from "chalk";
import cliProgress from "cli-progress";

// ------------------- 檔案路徑 -------------------
const DIR = path.resolve(import.meta.dirname); // richmenu/
const files = {
  bound: {
    json: path.join(DIR, "rich_menu_bound.json"),
    img: path.join(DIR, "bound_menu.png"),
  },
  unbound: {
    json: path.join(DIR, "rich_menu_unbound.json"),
    img: path.join(DIR, "unbound_menu.png"),
  },
};
const savePath = path.join(DIR, "ids.json");

// ------------------- 檢查檔案 -------------------
Object.values(files).forEach(({ json, img }) => {
  [json, img].forEach((f) => {
    if (!fs.existsSync(f)) {
      console.error(chalk.red(`✘ 檔案不存在：${f}`));
      process.exit(1);
    }
  });
});

const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!token) {
  console.error(chalk.red("✘ 未設定 LINE_CHANNEL_ACCESS_TOKEN"));
  process.exit(1);
}

const http = axios.create({
  baseURL: "https://api.line.me/v2/bot/",
  headers: { Authorization: `Bearer ${token}` },
});

// ------------------- 進度列 -------------------
const bar = new cliProgress.SingleBar(
  {
    format: "{stage} {bar} {percentage}% | elapsed: {duration}s",
    barCompleteChar: "█",
    barIncompleteChar: "░",
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
);

// ------------------- 主流程 -------------------
(async () => {
  // 覆寫提醒
  if (fs.existsSync(savePath)) {
    console.warn(chalk.yellow("⚠  ids.json 已存在，將被覆寫"));
  }

  const idMap = {};

  // total = 4 個步驟（Bound JSON → IMG → Unbound JSON → IMG）
  bar.start(4, 0, { stage: "初始化" });

  // 迭代 bound / unbound 兩種
  for (const [key, val] of Object.entries(files)) {
    // 1) 建立 RichMenu
    bar.update({ stage: `上傳 ${key} JSON` });
    const template = JSON.parse(fs.readFileSync(val.json, "utf8"));
    const res = await http.post("richmenu", template).catch((err) => {
      console.error(
        chalk.red(JSON.stringify(err.response?.data || err.message))
      );
      process.exit(1);
    });
    const richMenuId = res.data?.richMenuId;
    idMap[key] = richMenuId;
    bar.increment();

    // 2) 上傳圖檔
    bar.update({ stage: `上傳 ${key} 圖片` });
    const body = new FormData();
    body.append("file", fs.createReadStream(val.img));
    await http.post(`richmenu/${richMenuId}/content`, body, {
      headers: body.getHeaders(),
    });
    bar.increment();
  }

  bar.stop();

  // 寫 ids.json
  fs.writeFileSync(savePath, JSON.stringify(idMap, null, 2));
  console.log(
    chalk.green(
      `✅ Bound RichMenu created: ${idMap.bound}\n✅ Unbound RichMenu created: ${idMap.unbound}`
    )
  );
  console.log(chalk.cyan(`✔ 已寫入 ${path.relative(process.cwd(), savePath)}`));
})();
