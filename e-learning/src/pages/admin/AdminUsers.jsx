import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '@clerk/clerk-react';
import Modal from '../../components/common/Modal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { getToken } = useAuth();
  const [search, setSearch] = useState('');
  const [limit] = useState(20);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const load = async (p = 1) => {
    try {
      const token = await getToken();
      const res = await apiService.adminListUsers({ page: p, limit, search }, token);
      if (res.success) {
        setUsers(res.users || []);
        setTotal(res.total || 0);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(1); }, []);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { load(page); }, [page]);

  const changeRole = async (userId, role) => {
    try {
      const token = await getToken();
      const res = await apiService.adminUpdateUserRole(userId, role, token);
      if (res.success) load(page);
      else alert(res.message || 'Failed');
    } catch (e) { console.error(e); }
  };

  const removeUser = async (userId) => {
    try {
      const token = await getToken();
      const res = await apiService.adminDeleteUser(userId, token);
      if (res.success) load(page);
      else alert(res.message || 'Failed');
    } catch (e) { console.error(e); }
  };

  const openConfirm = (userId) => { setConfirmTarget(userId); setConfirmOpen(true); };
  const onConfirm = async () => { setConfirmOpen(false); if (confirmTarget) await removeUser(confirmTarget); setConfirmTarget(null); };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      <div className="flex items-center gap-3 mb-4">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name or email" className="border p-2 rounded flex-1" />
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        {/* Desktop/tablet table */}
        <div className="hidden md:block">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left"><th className="p-3">Name</th><th>Email</th><th>Role</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t"><td className="p-3">{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                  <td className="p-3 text-right">
                    <select value={u.role} onChange={(e)=>changeRole(u._id,e.target.value)} className="mr-2 p-1 border rounded">
                      <option value="student">student</option>
                      <option value="educator">educator</option>
                      <option value="admin">admin</option>
                    </select>
                    <button onClick={()=>openConfirm(u._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden p-2 space-y-3">
          {users.map(u => (
            <div key={u._id} className="border rounded p-3 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <div className="text-sm text-gray-600">{u.role}</div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <select value={u.role} onChange={(e)=>changeRole(u._id,e.target.value)} className="w-full p-2 border rounded">
                  <option value="student">student</option>
                  <option value="educator">educator</option>
                  <option value="admin">admin</option>
                </select>
                <button onClick={()=>openConfirm(u._id)} className="w-full bg-red-600 text-white px-3 py-2 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex items-center gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 bg-gray-100 rounded">Prev</button>
          <div className="px-3 py-1">Page {page} / {totalPages}</div>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 bg-gray-100 rounded">Next</button>
        </div>
      </div>

      <Modal open={confirmOpen} title="Confirm delete" onCancel={()=>setConfirmOpen(false)} onConfirm={onConfirm} confirmLabel="Delete">
        <p>Are you sure you want to delete this user? This will remove their account and data.</p>
      </Modal>
    </div>
  );
};

export default AdminUsers;
