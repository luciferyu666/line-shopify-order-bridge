import React, { useState } from "react";
import axios from "axios";

interface Binding {
  line_id: string;
  phone: string;
  email: string;
  bound_at: string;
}

export default function Rebind() {
  const [lineId, setLineId] = useState("");
  const [binding, setBinding] = useState<Binding | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const fetchBinding = async () => {
    try {
      const { data } = await axios.get<Binding>(`/api/admin/binding`, {
        params: { lineId },
      });
      setBinding(data);
      setPhone(data.phone);
      setEmail(data.email);
      setMsg("");
    } catch (e: any) {
      setMsg(e.response?.data?.error || "查無資料");
      setBinding(null);
    }
  };

  const submit = async () => {
    try {
      await axios.post(`/api/admin/binding`, { lineId, phone, email });
      setMsg("✅ 更新完成");
    } catch (e: any) {
      setMsg(e.response?.data?.error || e.message);
    }
  };

  return (
    <div>
      <h2>重新綁定 / 修改聯絡資訊</h2>
      <div>
        <input
          placeholder="輸入 LINE ID"
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
        />
        <button onClick={fetchBinding}>查詢</button>
      </div>

      {binding && (
        <div style={{ marginTop: 20 }}>
          <p>LineID：{binding.line_id}</p>
          <p>
            Phone：
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </p>
          <p>
            Email：
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </p>
          <button onClick={submit}>更新</button>
        </div>
      )}

      {msg && <p>{msg}</p>}
    </div>
  );
}
