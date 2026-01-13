import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';

const QuizList = () => {
  const { id: courseId } = useParams();
  const { getToken } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let token = null;
        try { token = await getToken(); } catch (e) { token = null; }
        const res = await apiService.getQuizzesByCourse(courseId, token);
        if (res.success) setQuizzes(res.quizzes || []);
        // fetch course progress to determine if student can take quiz
        try {
          if (token) {
            const p = await apiService.getCourseProgress(courseId, token);
            if (p.success) setProgress(p.progress || null);
          } else {
            setProgress(null);
          }
        } catch (e) {
          console.error('Load progress', e);
        }
      } catch (err) {
        console.error('Load quizzes', err);
      } finally { setLoading(false); }
    };
    load();
  }, [courseId]);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-semibold mb-4">Quizzes</h2>
      {loading && <p>Loading...</p>}
      {!loading && quizzes.length === 0 && <p>No quizzes for this course yet.</p>}
      <div className="space-y-3">
        {quizzes.map(q => (
          <div key={q._id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{q.title}</h3>
                <p className="text-sm text-gray-500">{q.description}</p>
              </div>
              {/* Disable quiz taking unless progress.completed is true (student finished course) */}
              {progress && progress.completed ? (
                <Link to={`/quiz/${q._id}`} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Take Quiz</Link>
              ) : (
                <button disabled className="text-sm bg-gray-300 text-white px-3 py-1 rounded cursor-not-allowed" title={progress ? 'Complete the course to take this quiz' : 'Sign in and complete the course to take this quiz'}>Take Quiz</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
