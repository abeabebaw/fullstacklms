import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '@clerk/clerk-react';
import Modal from '../../components/common/Modal';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const { getToken } = useAuth();
  const [search, setSearch] = useState('');
  const [limit] = useState(20);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const load = async (p = page) => {
    try {
      const token = await getToken();
      const res = await apiService.adminListCourses({ page: p, limit, search }, token);
      if (res.success) {
        setCourses(res.courses || []);
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

  const togglePublish = async (c) => {
    try {
      const token = await getToken();
      const res = await apiService.adminUpdateCourse(c._id, { isPublished: !c.isPublished }, token);
      if (res.success) load();
      else alert(res.message || 'Failed');
    } catch (e) { console.error(e); }
  };

  const removeCourse = async (id) => {
    try {
      const token = await getToken();
      const res = await apiService.adminDeleteCourse(id, token);
      if (res.success) load(page);
      else alert(res.message || 'Failed');
    } catch (e) { console.error(e); }
  };

  const openConfirm = (id) => { setConfirmTarget(id); setConfirmOpen(true); };
  const onConfirm = async () => { setConfirmOpen(false); if (confirmTarget) await removeCourse(confirmTarget); setConfirmTarget(null); };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Courses</h2>

      <div className="flex items-center gap-3 mb-4">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by title" className="border p-2 rounded flex-1" />
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        {/* Desktop/tablet */}
        <div className="hidden md:block">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left"><th className="p-3">Title</th><th>Educator</th><th>Published</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id} className="border-t"><td className="p-3">{c.courseTitle}</td><td>{c.educator?.name || c.educator}</td><td>{c.isPublished ? 'Yes' : 'No'}</td>
                  <td className="p-3 text-right">
                    <button onClick={()=>togglePublish(c)} className="mr-2 px-2 py-1 bg-blue-600 text-white rounded">{c.isPublished ? 'Unpublish' : 'Publish'}</button>
                    <button onClick={()=>openConfirm(c._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden p-2 space-y-3">
          {courses.map(c => (
            <div key={c._id} className="border rounded p-3 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{c.courseTitle}</div>
                  <div className="text-xs text-gray-500">{c.educator?.name || c.educator}</div>
                </div>
                <div className="text-sm text-gray-600">{c.isPublished ? 'Published' : 'Draft'}</div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={()=>togglePublish(c)} className="w-full bg-blue-600 text-white px-3 py-2 rounded">{c.isPublished ? 'Unpublish' : 'Publish'}</button>
                <button onClick={()=>openConfirm(c._id)} className="w-full bg-red-600 text-white px-3 py-2 rounded">Delete</button>
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
        <p>Are you sure you want to delete this course? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminCourses;
