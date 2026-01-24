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
  const [fieldErrors, setFieldErrors] = useState({});
  const debounceRef = useRef(null);

  // Validation functions
  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international phone regex
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid phone number';
    return '';
  };

  const validateFile = (file) => {
    if (!file) return 'CV upload is required';
    if (file.type !== 'application/pdf') return 'Please upload a PDF file only';
    if (file.size > 5 * 1024 * 1024) return 'File size must be less than 5MB'; // 5MB limit
    return '';
  };

  const validateAdditionalInfo = (info) => {
    if (!info.trim()) return 'Additional information is required';
    if (info.trim().length < 50) return 'Please provide at least 50 characters describing your experience';
    if (info.trim().length > 1000) return 'Additional information must be less than 1000 characters';
    return '';
  };

  const validateForm = () => {
    const errors = {};
    errors.phone = validatePhone(phone);
    errors.file = validateFile(file);
    errors.additionalInfo = validateAdditionalInfo(additionalInfo);
    setFieldErrors(errors);
    return !Object.values(errors).some(err => err);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }
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

  // Clear phone error on change
  useEffect(() => {
    if (fieldErrors.phone) {
      const phoneError = validatePhone(phone);
      setFieldErrors(prev => ({ ...prev, phone: phoneError }));
    }
  }, [phone]);

  // Clear additional info error on change
  useEffect(() => {
    if (fieldErrors.additionalInfo) {
      const infoError = validateAdditionalInfo(additionalInfo);
      setFieldErrors(prev => ({ ...prev, additionalInfo: infoError }));
    }
  }, [additionalInfo]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setPhone('');
      setAdditionalInfo('');
      setFile(null);
      setError('');
      setFieldErrors({});
      setDuplicateEmail(false);
      setDuplicatePhone(false);
    }
  }, [open]);

  const confirmDisabled = submitting || duplicateEmail || duplicatePhone || Object.values(fieldErrors).some(err => err);
  return (
    <Modal
      open={open}
      title={
        <span className="flex items-center gap-2 text-2xl font-bold text-sky-700">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Become an Educator
        </span>
      }
      onCancel={onClose}
      onConfirm={handleSubmit}
      confirmLabel={submitting ? 'Submitting...' : 'Submit'}
      confirmDisabled={confirmDisabled}
    >
      <div className="max-h-[70vh] md:max-h-[75vh] overflow-y-auto space-y-6 px-1 py-2 w-full min-w-[90vw] md:min-w-[420px] md:max-w-[500px] lg:max-w-[600px] mx-auto">
        <div className="bg-sky-50 border-l-4 border-sky-400 rounded-lg p-3 mb-2 text-sky-800 text-sm flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Fill out this form to request educator access. Upload your CV and provide a short summary of your experience.
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Phone number <span className="text-red-500">*</span></label>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
            }}
            className={`w-full border-2 py-2 px-3 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition ${fieldErrors.phone ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. +251912345678"
            autoFocus
          />
          {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">CV (PDF) <span className="text-red-500">*</span></label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              if (selectedFile) {
                const fileError = validateFile(selectedFile);
                setFieldErrors(prev => ({ ...prev, file: fileError }));
              } else {
                setFieldErrors(prev => ({ ...prev, file: 'CV upload is required' }));
              }
            }}
            className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 ${fieldErrors.file ? 'border-red-500' : ''}`}
          />
          {fieldErrors.file && <p className="text-xs text-red-600 mt-1">{fieldErrors.file}</p>}
          <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Short summary / additional info <span className="text-red-500">*</span></label>
          <textarea
            value={additionalInfo}
            onChange={(e) => {
              setAdditionalInfo(e.target.value);
              if (fieldErrors.additionalInfo) setFieldErrors(prev => ({ ...prev, additionalInfo: '' }));
            }}
            className={`w-full border-2 py-2 px-3 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition ${fieldErrors.additionalInfo ? 'border-red-500' : 'border-slate-300'}`}
            rows={5}
            placeholder="Describe your teaching experience, qualifications, and why you want to become an educator (minimum 50 characters)"
            maxLength={1000}
          />
          <div className="flex justify-between items-center">
            {fieldErrors.additionalInfo && <p className="text-xs text-red-600 mt-1">{fieldErrors.additionalInfo}</p>}
            <p className="text-xs text-gray-500 mt-1 ml-auto">{additionalInfo.length}/1000 characters</p>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 mt-2 font-medium flex items-center gap-2"><svg width='18' height='18' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='#dc2626' strokeWidth='2'/><path d='M12 8v4m0 4h.01' stroke='#dc2626' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>{error}</div>}
        {duplicateEmail && <div className="text-sm text-yellow-700 mt-2 font-medium flex items-center gap-2"><svg width='18' height='18' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='#f59e42' strokeWidth='2'/><path d='M12 8v4m0 4h.01' stroke='#f59e42' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>There is already an application or educator with this email.</div>}
        {duplicatePhone && <div className="text-sm text-yellow-700 mt-2 font-medium flex items-center gap-2"><svg width='18' height='18' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='#f59e42' strokeWidth='2'/><path d='M12 8v4m0 4h.01' stroke='#f59e42' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>An application with this phone number already exists.</div>}
      </div>
    </Modal>
  );
};

export default BecomeEducatorModal;
