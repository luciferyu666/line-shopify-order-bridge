#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import axios from "axios";
import chalk from "chalk";
import cliProgress from "cli-progress";

/* ---------- 檔案路徑 ---------- */
const DIR = path.resolve(import.meta.dirname);
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

/* ---------- 讀取 Access-Token ---------- */
const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!token) {
  console.error(
    chalk.red("✘ 未找到 LINE_CHANNEL_ACCESS_TOKEN，請先設定環境變數")
  );
  process.exit(1);
}

/* ---------- Axios ---------- */
const http = axios.create({
  baseURL: "https://api.line.me/v2/bot/",
  headers: { Authorization: `Bearer ${token}` },
  timeout: 5000,
});

/* ---------- 工具函式 ---------- */

// (1) 檢查資源檔
function ensureAssets() {
  Object.values(files).forEach(({ json, img }) => {
    [json, img].forEach((f) => {
      if (!fs.existsSync(f)) {
        console.error(
          chalk.red(`✘ 缺少檔案：${path.relative(process.cwd(), f)}`)
        );
        process.exit(1);
      }
    });
  });
}

// (2) 驗證 Access-Token 是否屬於此 Channel
async function verifyToken() {
  try {
    const { data } = await http.get("info");
    return data;
  } catch {
    return null;
  }
}

// (3) 建立 RichMenu，回傳 ID
async function createRichMenu(templatePath) {
  const payload = JSON.parse(fs.readFileSync(templatePath, "utf8"));
  const { data } = await http.post("richmenu", payload);
  return data.richMenuId;
}

// 🚩【4】最終修正版：改用原生 fetch API (無法解決Axios 415問題時)
async function uploadImage(richMenuId, imgPath) {
  const imageBuffer = fs.readFileSync(imgPath);

  const res = await fetch(
    `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/png",
      },
      body: imageBuffer,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`圖片上傳失敗：${res.status} - ${text}`);
  }
}

/* ---------- 主程式 ---------- */
(async () => {
  ensureAssets();

  const verify = await verifyToken();
  if (!verify) {
    console.error(
      chalk.red("✘ Access-Token 驗證失敗 ─ 請確認是否拿錯 Channel 的 Token")
    );
    process.exit(1);
  }
  console.log(
    chalk.green(
      `✓ Token 屬於 Channel 名稱：${verify.displayName}，基本ID：${verify.basicId}`
    )
  );

  if (fs.existsSync(savePath))
    console.warn(chalk.yellow("⚠  將覆寫現有 ids.json"));

  const bar = new cliProgress.SingleBar(
    {
      format: "{stage} {bar} {percentage}% | {value}/4 | {duration_formatted}",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );
  bar.start(4, 0, { stage: "初始化" });

  const idMap = {};

  for (const [key, asset] of Object.entries(files)) {
    bar.update({ stage: `建立 ${key} JSON` });
    const id = await createRichMenu(asset.json);
    idMap[key] = id;
    bar.increment();

    bar.update({ stage: `上傳 ${key} PNG` });
    await uploadImage(id, asset.img);
    bar.increment();
  }

  bar.stop();

  fs.writeFileSync(savePath, JSON.stringify(idMap, null, 2));
  console.log(chalk.cyan(`✔ 已寫入 ${path.relative(process.cwd(), savePath)}`));
  console.log(
    chalk.green(`✅ Bound  ID：${idMap.bound}\n✅ Unbound ID：${idMap.unbound}`)
  );
})().catch((err) => {
  console.error(chalk.red(`✘ 發生錯誤：${err.message}`));
  process.exit(1);
});
