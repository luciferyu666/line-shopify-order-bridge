// lib/shopify/orderFetcher.js – enhanced to spec‑2 (GraphQL + pagination)

import { shopify } from "./restClient.js";

/**
 * Shopify REST: 取 email = X 的訂單，最多拉取 limit×pages 筆
 */
async function fetchOrdersPaginated(email, pages = 5, limit = 250) {
  let url = `/orders.json?status=any&email=${encodeURIComponent(
    email
  )}&limit=${limit}`;
  const all = [];
  for (let i = 0; i < pages && url; i++) {
    const { data, headers } = await shopify.get(url);
    all.push(...(data.orders || []));
    // Link header for pagination → <https://xxx.com/admin/api/.../orders.json?page_info=xxxx>; rel="next"
    const link = headers["link"];
    const next = /<([^>]+)>; rel="next"/.exec(link || "");
    url = next
      ? next[1].replace(`https://${process.env.SHOPIFY_STORE_DOMAIN}`, "")
      : null;
  }
  return all;
}

/**
 * Shopify GraphQL Search：email & phone 同時比對，若店家開啟 phone 資料可直接命中
 */
async function fetchOrdersGraphQL(email, phone) {
  const queryStr = `email:'${email}' AND phone:'${phone}'`;
  const gql = {
    query: `query($first:Int!, $query:String!){\n      orders(first:$first, query:$query){\n        edges{ node{ id name phone email createdAt totalPriceSet{shopMoney{amount}} displayFinancialStatus orderNumber fulfillmentOrders(first:1){edges{node{trackingInfo{number url}}}} } } }\n    }`,
    variables: { first: 50, query: queryStr },
  };

  const { data } = await shopify.post("/graphql.json", gql);
  const edges = data?.data?.orders?.edges || [];
  return edges.map((e) => {
    const n = e.node;
    const fulfillment = n.fulfillmentOrders.edges[0]?.node.trackingInfo || [];
    return {
      id: n.id,
      name: `#${n.orderNumber}`,
      email: n.email,
      phone: n.phone,
      created_at: n.createdAt,
      total_price: n.totalPriceSet.shopMoney.amount,
      financial_status: n.displayFinancialStatus,
      fulfillments: [
        {
          tracking_number: fulfillment[0]?.number || null,
          tracking_url: fulfillment[0]?.url || null,
        },
      ],
    };
  });
}

function normalizePhone(p = "") {
  return p.replace(/\D/g, "");
}

export async function fetchOrders(email) {
  // fallback to REST paginated (max 1250)
  return await fetchOrdersPaginated(email);
}

/**
 * 更精準：若 GraphQL 可直接搜尋 phone，優先走 GQL；否則 fallback 篩選 REST
 */
export async function filterOrdersByPhone(email, phone) {
  const cleanPhone = normalizePhone(phone);

  try {
    // 若店鋪權限允許，GraphQL 一次查詢
    const gqlOrders = await fetchOrdersGraphQL(email, cleanPhone);
    if (gqlOrders.length) return gqlOrders;
  } catch {
    // GraphQL 失敗 (許可權或 API 版本)，退回 REST
  }

  // REST 分頁 + 後 4 碼 fallback
  const orders = await fetchOrdersPaginated(email, 5); // up to 1250 orders
  const tail = cleanPhone.slice(-4);
  return orders.filter((o) => normalizePhone(o.phone).endsWith(tail));
}
