import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import Loader from "../components/Loader";
import { useToast } from "../components/Toast";
import OrderTable from "../components/OrderTable";

export default function Orders() {
  const { t } = useTranslation();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const query = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders", {
        params: { email, phone },
      });
      setOrders(data);
      if (!data.length) toast({ text: t("orders.noData"), type: "info" });
    } catch (e: any) {
      toast({ text: e.response?.data?.error || e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{t("orders.title")}</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder={t("orders.emailPlaceholder") as string}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder={t("orders.phonePlaceholder") as string}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={query}>{t("orders.query")}</button>
      </div>

      {loading ? <Loader /> : <OrderTable data={orders} />}
    </div>
  );
}
