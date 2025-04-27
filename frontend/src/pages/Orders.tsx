import React, { useState } from 'react';
import axios from 'axios';
import OrderTable from '../components/OrderTable';

export default function Orders() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const query = async () => {
    const { data } = await axios.get(`/api/admin/orders`, { params: { email, phone } });
    setOrders(data);
  };
  return (
    <>
      <div>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <button onClick={query}>查詢</button>
      </div>
      <OrderTable data={orders} />
    </>
  );
}
