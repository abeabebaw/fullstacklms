import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useAuth, useUser } from '@clerk/clerk-react';
import { apiService } from '../../services/api';

const BecomeEducatorModal = ({ open, onClose, onSubmitted }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [phone, setPhone] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [duplicatePhone, setDuplicatePhone] = useState(false);
  const debounceRef = useRef(null);

  const handleSubmit = async () => {
    try {
      if (duplicateEmail || duplicatePhone) {
        setError('Please resolve duplicate email or phone before submitting');
        return;
      }
      setSubmitting(true);
      setError('');
      const token = await getToken();
      const fd = new FormData();
      fd.append('phone', phone);
      fd.append('additionalInfo', additionalInfo);
      fd.append('name', user?.fullName || user?.firstName || '');
      fd.append('email', user?.primaryEmailAddress?.emailAddress || user?.email || '');
      if (file) fd.append('cv', file);
      const res = await apiService.submitEducatorRequest(fd, token);
      if (res.success) {
        onSubmitted && onSubmitted(res.request);
        onClose();
      } else {
        setError(res.message || res.error || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Submit educator request', err);
      setError('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  // Live duplicate checks for email and phone (debounced)
  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress || user?.email || '';
    const phoneVal = phone || '';
    setDuplicateEmail(false);
    setDuplicatePhone(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (!email && !phoneVal) return;
        const res = await apiService.checkEducatorDuplicate({ email, phone: phoneVal });
        if (res && res.success) {
          setDuplicateEmail(!!res.duplicateEmail);
          setDuplicatePhone(!!res.duplicatePhone);
          if (res.duplicateEmail) setError('An application or educator already exists with your email');
          else if (res.duplicatePhone) setError('An application with this phone number already exists');
          else setError('');
        }
      } catch (err) {
        console.error('Duplicate check', err);
      }
    }, 450);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [phone, user]);

  const confirmDisabled = submitting || duplicateEmail || duplicatePhone;
  return (
    <Modal open={open} title="Become an Educator" onCancel={onClose} onConfirm={handleSubmit} confirmLabel={submitting ? 'Submitting...' : 'Submit'} confirmDisabled={confirmDisabled}>
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Fill out this form to request educator access. Upload your CV and provide a short summary of your experience.</p>

        <div>
          <label className="text-xs font-medium">Phone number</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border p-2 rounded mt-1" placeholder="e.g. +2519..." />
        </div>

        <div>
          <label className="text-xs font-medium">CV (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files[0])} className="w-full mt-1" />
        </div>

        <div>
          <label className="text-xs font-medium">Short summary / additional info</label>
          <textarea value={additionalInfo} onChange={(e)=>setAdditionalInfo(e.target.value)} className="w-full border p-2 rounded mt-1" rows={4} />
        </div>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        {duplicateEmail && <div className="text-sm text-yellow-700 mt-2">There is already an application or educator with this email.</div>}
        {duplicatePhone && <div className="text-sm text-yellow-700 mt-2">An application with this phone number already exists.</div>}
      </div>
    </Modal>
  );
};

export default BecomeEducatorModal;
