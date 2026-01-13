import React, { useEffect, useState, useRef } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '@clerk/clerk-react';
import Modal from '../../components/common/Modal';

const AdminEducatorRequests = () => {
  const { getToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [actionType, setActionType] = useState('approve');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewBlobUrlRef = useRef(null);
  const previewBackendUrlRef = useRef('');

  const load = async (p=1) => {
    try {
      const token = await getToken();
      const res = await apiService.adminListEducatorRequests({ page: p, limit: 20 }, token);
      if (res.success) { setRequests(res.requests || []); setTotal(res.total || 0); }
    } catch (e) { console.error(e); }
  };

  useEffect(()=>{ load(1); }, []);

  // Load when page changes
  useEffect(() => { load(page); }, [page]);

  const openConfirm = (reqId, act) => { setTarget(reqId); setActionType(act); setConfirmOpen(true); };

  const openPreview = async (r) => {
    if (!r || !r.cvPath) return;
    try {
      setPreviewLoading(true);
      const backendBase = import.meta.env.VITE_BACKEND_URL || '';
      const url = `${backendBase.replace(/\/$/, '')}/${r.cvPath.replace(/^\//, '')}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Failed to fetch CV');
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      // revoke previous
      if (previewBlobUrlRef.current) URL.revokeObjectURL(previewBlobUrlRef.current);
      previewBlobUrlRef.current = blobUrl;
      previewBackendUrlRef.current = url;
      setPreviewUrl(blobUrl);
      setPreviewOpen(true);
    } catch (err) {
      console.error('Preview CV error', err);
      alert('Failed to load CV preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const onConfirm = async () => {
    setConfirmOpen(false);
    if (!target) return;
    try {
      const token = await getToken();
      const res = await apiService.adminProcessEducatorRequest(target, actionType === 'approve' ? 'approve' : 'reject', '', token);
      if (res.success) {
        load(page);
      } else alert(res.message || res.error || 'Failed');
    } catch (e) { console.error(e); }
    setTarget(null);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    if (previewBlobUrlRef.current) {
      URL.revokeObjectURL(previewBlobUrlRef.current);
      previewBlobUrlRef.current = null;
    }
    setPreviewUrl('');
    previewBackendUrlRef.current = '';
  };

  const backendBase = import.meta.env.VITE_BACKEND_URL || '';

  const totalPages = Math.max(1, Math.ceil((total || 0) / 20));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Educator Requests</h2>
      <div className="bg-white rounded shadow overflow-auto">
        {/* Desktop/tablet view */}
        <div className="hidden md:block">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left"><th className="p-3">Applicant</th><th>Phone</th><th>Submitted</th><th>Status</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.name || r.email}<div className="text-xs text-gray-500">{r.email}</div></td>
                  <td>{r.phone || '-'}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>{r.status}</td>
                  <td className="p-3 text-right">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={()=>openConfirm(r._id,'approve')} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Approve</button>
                        <button onClick={()=>openConfirm(r._id,'reject')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                      </>
                    )}
                    {r.cvPath && (
                      <>
                        <button onClick={()=>openPreview(r)} className="ml-2 text-sm text-blue-600">Preview CV</button>
                        <a
                          className="ml-2 text-sm text-blue-600"
                          href={`${backendBase.replace(/\/$/, '')}/${r.cvPath.replace(/^\//, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download CV
                        </a>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view: stacked cards */}
        <div className="md:hidden p-2 space-y-3">
          {requests.map(r => (
            <div key={r._id} className="border rounded p-3 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{r.name || r.email}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                </div>
                <div className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-2 text-sm text-gray-700">Phone: {r.phone || '-'}</div>
              <div className="mt-2 text-sm">Status: <span className="font-medium">{r.status}</span></div>
              <div className="mt-3 flex flex-col gap-2">
                {r.status === 'pending' && (
                  <>
                    <button onClick={()=>openConfirm(r._id,'approve')} className="w-full bg-green-600 text-white px-3 py-2 rounded">Approve</button>
                    <button onClick={()=>openConfirm(r._id,'reject')} className="w-full bg-red-600 text-white px-3 py-2 rounded">Reject</button>
                  </>
                )}
                {r.cvPath && (
                  <div className="flex gap-2">
                    <button onClick={()=>openPreview(r)} className="flex-1 text-sm text-blue-600 underline">Preview CV</button>
                    <a className="flex-1 text-sm text-blue-600 underline" href={`${backendBase.replace(/\/$/, '')}/${r.cvPath.replace(/^\//, '')}`} target="_blank" rel="noopener noreferrer">Download CV</a>
                  </div>
                )}
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

      <Modal open={confirmOpen} title={`${actionType === 'approve' ? 'Approve' : 'Reject'} request`} onCancel={()=>setConfirmOpen(false)} onConfirm={onConfirm} confirmLabel={actionType === 'approve' ? 'Approve' : 'Reject'}>
        <p>Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} this educator request?</p>
      </Modal>

      <Modal open={previewOpen} title={previewLoading ? 'Loading...' : 'CV Preview'} onCancel={() => {
          // download / open original backend file
          if (previewBackendUrlRef.current) window.open(previewBackendUrlRef.current, '_blank');
        }} onConfirm={closePreview} confirmLabel="Close" cancelLabel="Download">
        {previewLoading ? (
          <div className="p-6 text-center">Loading preview…</div>
        ) : (
          previewUrl ? (
            <div className="w-full h-[70vh]">
              <iframe title="CV preview" src={previewUrl} className="w-full h-full" />
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-600">No preview available</div>
          )
        )}
      </Modal>
    </div>
  );
};

export default AdminEducatorRequests;
