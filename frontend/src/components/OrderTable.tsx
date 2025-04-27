import React from 'react';

export default function OrderTable({ data }) {
  if (!data.length) return <p>尚無資料</p>;
  return (
    <table border={1} cellPadding={4}>
      <thead><tr><th>訂單</th><th>金額</th><th>狀態</th><th>物流</th></tr></thead>
      <tbody>
        {data.map(o => (
          <tr key={o.id}>
            <td>{o.name}</td>
            <td>{o.total_price}</td>
            <td>{o.financial_status}</td>
            <td>{o.logistics ? o.logistics.steps?.[0]?.status || '已出貨' : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
