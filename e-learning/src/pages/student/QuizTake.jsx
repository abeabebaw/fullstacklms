import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';

const QuizTake = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let token = null;
        try { token = await getToken(); } catch (e) {}
        const res = await apiService.getQuizById(quizId, token);
        if (res.success) setQuiz(res.quiz);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, [quizId]);

  const handleSelect = async (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    try {
      let token = null;
      try { token = await getToken(); } catch (e) {}
      const res = await apiService.checkQuizAnswer(quizId, questionId, optionId, token);
      if (res?.success) {
        setFeedback(prev => ({ ...prev, [questionId]: res.correct ? 'correct' : 'incorrect' }));
      }
    } catch (e) {}
  };

  const handleSubmit = async () => {
    try {
      let token = null;
      try { token = await getToken(); } catch (e) {}
      const payload = Object.keys(answers).map(qid => ({
        questionId: qid,
        selectedOptionId: answers[qid]
      }));
      const res = await apiService.submitQuiz(quizId, payload, token);
      if (res.success) setResult(res);
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <p className="text-lg font-medium text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <p className="text-lg font-medium text-gray-600">Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 hover:text-blue-600"
        >
          ← Back
        </button>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
          <p className="text-gray-600 mt-2">{quiz.description}</p>
        </div>

        {!result && (
          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div
                key={q.questionId}
                className="bg-white rounded-xl shadow-md p-5"
              >
                <p className="font-semibold text-gray-800">
                  {idx + 1}. {q.questionText}
                </p>

                <div className="mt-4 space-y-3">
                  {q.options.map(opt => {
                    const selected = answers[q.questionId] === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                          ${selected
                            ? 'bg-blue-50 border-blue-400'
                            : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                      >
                        <input
                          type="radio"
                          name={q.questionId}
                          checked={selected}
                          onChange={() => handleSelect(q.questionId, opt.id)}
                          className="accent-blue-600"
                        />
                        <span className="text-gray-700">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>

                {feedback[q.questionId] === 'correct' && (
                  <p className="mt-3 text-sm font-medium text-green-600">
                    ✅ Correct answer!
                  </p>
                )}

                {feedback[q.questionId] === 'incorrect' && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    ❌ Incorrect answer. Try again.
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button
                onClick={() => {
                  setAnswers({});
                  setFeedback({});
                }}
                disabled={Object.keys(answers).length === 0}
                className={`px-5 py-2 rounded-lg font-medium border
                  ${Object.keys(answers).length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Reset Answers
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-md hover:from-green-700 hover:to-emerald-700"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800">Quiz Result</h3>

            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                Score: <span className="font-semibold">{result.scorePercent}%</span>
              </p>
              <p className={`font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                Status: {result.passed ? 'Passed' : 'Failed'}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-2">Answer Details</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                {result.details.map(d => (
                  <li
                    key={d.questionId}
                    className={d.correct ? 'text-green-600' : 'text-red-600'}
                  >
                    {d.questionId} — {d.correct ? 'Correct' : 'Incorrect'}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setAnswers({});
                  setFeedback({});
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Try Again
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
              >
                Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizTake;
