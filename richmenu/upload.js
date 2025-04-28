/**
 * richmenu/upload.js
 *
 * CLI：node richmenu/upload.js
 * 依據 rich_menu_unbound.json / bound_menu.png、
 *       rich_menu_bound.json   / bound_menu.png
 * 兩組檔案，自動呼叫 LINE Messaging API 上傳並回存 ID。
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RICH_MENU_DIR = __dirname; // ../richmenu

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("❌  LINE_CHANNEL_ACCESS_TOKEN 尚未設置於 .env");
  process.exit(1);
}

const menus = [
  {
    key: "UNBOUND",
    json: "rich_menu_unbound.json",
    image: "unbound_menu.png",
  },
  {
    key: "BOUND",
    json: "rich_menu_bound.json",
    image: "bound_menu.png",
  },
];

const http = axios.create({
  baseURL: "https://api.line.me/v2/bot/",
  headers: { Authorization: `Bearer ${TOKEN}` },
  timeout: 10000,
});

async function uploadOne({ json, image, key }) {
  const jsonFile = path.join(RICH_MENU_DIR, json);
  const imgFile = path.join(RICH_MENU_DIR, image);

  if (!fs.existsSync(jsonFile) || !fs.existsSync(imgFile)) {
    console.warn(`⚠️  找不到 ${json} 或 ${image}，略過`);
    return null;
  }

  /* 1️⃣ 建立 rich menu */
  const template = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const {
    data: { richMenuId },
  } = await http.post("richmenu", template);
  console.log(`✅  ${key} Rich Menu created → ${richMenuId}`);

  /* 2️⃣ 上傳圖片 */
  const imgBuf = fs.readFileSync(imgFile);
  await http.post(`richmenu/${richMenuId}/content`, imgBuf, {
    headers: { "Content-Type": "image/png" },
  });
  console.log(`   🖼  image uploaded (${image})`);

  /* 3️⃣ 建立 alias（方便版本替換） */
  const aliasId = `MENU_${key}`;
  await http.post("richmenu/alias", { richMenuAliasId: aliasId, richMenuId });
  console.log(`   🔗  alias "${aliasId}" 指向 ${richMenuId}`);

  return { key, richMenuId, aliasId };
}

(async () => {
  try {
    const results = (await Promise.all(menus.map(uploadOne))).filter(Boolean);

    if (!results.length) {
      console.error("❌  沒有成功上傳任何 Rich Menu");
      process.exit(1);
    }

    /* 4️⃣ 將 ID 回存到 ids.json 方便後續引用 */
    const idMap = Object.fromEntries(
      results.map((r) => [`RICH_MENU_${r.key}_ID`, r.richMenuId])
    );
    const savePath = path.join(RICH_MENU_DIR, "ids.json");
    fs.writeFileSync(savePath, JSON.stringify(idMap, null, 2));
    console.log(`📄  已寫入 ${savePath}`);
    console.table(idMap);

    console.log(
      "\n👉  請將上表 ID 填入 Vercel 的 Environment Variables " +
        "(RICH_MENU_BOUND_ID / RICH_MENU_UNBOUND_ID) 後重新部署"
    );
  } catch (err) {
    console.error("❌  上傳失敗：", err.response?.data ?? err.message);
    process.exit(1);
  }
})();
