import axios from 'axios';
import { config } from 'dotenv';
config();
export const shopify = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10`,
  headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN },
  timeout: 7000
});
