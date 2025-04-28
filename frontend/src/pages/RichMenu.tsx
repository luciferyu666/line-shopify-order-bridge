import React, { useEffect, useState } from "react";
import axios from "axios";

interface MenuItem {
  id: string;
  alias: string;
  size: string;
  selected: boolean;
}

export default function RichMenu() {
  const [list, setList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<MenuItem[]>("/api/richmenu/list");
      setList(data);
    } catch (e: any) {
      setErr(e.message || "讀取失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleSwitch = async (id: string) => {
    try {
      await axios.post("/api/richmenu", {
        bound: id.endsWith("BOUND"),
        userId: "ALL",
      });
      fetchMenus();
    } catch (e: any) {
      alert(e.response?.data?.error || e.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;

  return (
    <div>
      <h2>Rich Menu 管理</h2>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Alias</th>
            <th>Size</th>
            <th>選中</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.alias}</td>
              <td>{m.size}</td>
              <td>{m.selected ? "✅" : ""}</td>
              <td>
                {!m.selected && (
                  <button onClick={() => handleSwitch(m.id)}>切換為此</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
