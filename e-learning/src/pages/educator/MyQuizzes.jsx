import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MyQuizzes = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiService.getMyQuizzes(token);
      if (res.success) setQuizzes(res.quizzes || []);
      else console.error('Failed to load quizzes', res);
    } catch (err) {
      console.error('Load my quizzes', err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const handleDelete = async (quizId) => {
    if (!confirm('Delete this quiz? This cannot be undone.')) return;
    try {
      const token = await getToken();
      const res = await apiService.deleteQuiz(quizId, token);
      if (res.success) {
        setQuizzes(qs => qs.filter(q => q._id !== quizId));
      } else {
        alert(res.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete quiz', err);
      alert('Failed to delete quiz');
    }
  };

  const handleEdit = (quiz) => {
    navigate('/educator/create-quiz', { state: { quiz } });
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900">My Quizzes</h2>

      {loading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {quizzes.length === 0 && <p className="text-slate-600">No quizzes yet. Create one.</p>}
          {quizzes.map(q => (
            <div key={q._id} className="border border-slate-200 bg-white p-3 rounded flex justify-between items-center">
              <div>
                <h3 className="font-medium text-slate-800">{q.title}</h3>
                <p className="text-sm text-slate-600">Course: {q.courseTitle || q.courseId}</p>
                <p className="text-sm text-slate-500 mt-1">Questions: {q.questions?.length || 0}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>handleEdit(q)} className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700">Edit</button>
                <button onClick={()=>handleDelete(q._id)} className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
