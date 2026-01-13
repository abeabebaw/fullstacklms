import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const makeId = (prefix='id') => `${prefix}_${Math.random().toString(36).slice(2,9)}`;

const CreateQuiz = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [questions, setQuestions] = useState([
    { questionId: makeId('q'), questionText: '', options: [ { id: makeId('o'), text: '' }, { id: makeId('o'), text: '' } ], correctOptionId: null, points: 1 }
  ]);
  const [errors, setErrors] = useState({}); // For inline validation

  // Load courses for selection
  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await apiService.getAllCourses();
        if (res.success) setCourses(res.courses || []);
        else console.error('Failed to load courses', res);
      } catch (err) {
        console.error('Load courses error', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  // If we arrived with a quiz to edit, populate state
  useEffect(() => {
    const st = location && location.state && location.state.quiz ? location.state.quiz : null;
    if (st) {
      setIsEdit(true);
      setEditingQuizId(st._id);
      setCourseId(st.courseId || '');
      setTitle(st.title || '');
      setDescription(st.description || '');
      const mapped = Array.isArray(st.questions) ? st.questions.map(q => ({
        questionId: q.questionId || makeId('q'),
        questionText: q.questionText || '',
        options: Array.isArray(q.options) ? q.options.map(o => ({ id: o.id || makeId('o'), text: o.text || '' })) : [ { id: makeId('o'), text: '' }, { id: makeId('o'), text: '' } ],
        correctOptionId: q.correctOptionId || null,
        points: Number(q.points || 1)
      })) : [ { questionId: makeId('q'), questionText: '', options: [ { id: makeId('o'), text: '' }, { id: makeId('o'), text: '' } ], correctOptionId: null, points: 1 } ];
      setQuestions(mapped);
    }
  }, [location]);

  // Handlers for question/option CRUD
  const addQuestion = () => {
    setQuestions(qs => [
      ...qs,
      { questionId: makeId('q'), questionText: '', options: [ { id: makeId('o'), text: '' }, { id: makeId('o'), text: '' } ], correctOptionId: null, points: 1 }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(qs => qs.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index, value) => {
    setQuestions(qs => qs.map((q, i) => i === index ? { ...q, questionText: value } : q));
  };

  const addOption = (qIndex) => {
    setQuestions(qs => qs.map((q, i) => i === qIndex ? { ...q, options: [...q.options, { id: makeId('o'), text: '' }] } : q));
  };

  const removeOption = (qIndex, oIndex) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qIndex) return q;
      const newOptions = q.options.filter((_, oi) => oi !== oIndex);
      const newCorrect = newOptions.find(op => op.id === q.correctOptionId) ? q.correctOptionId : null;
      return { ...q, options: newOptions, correctOptionId: newCorrect };
    }));
  };

  const updateOptionText = (qIndex, oIndex, value) => {
    setQuestions(qs => qs.map((q, i) => i === qIndex ? { ...q, options: q.options.map((op, oi) => oi === oIndex ? { ...op, text: value } : op) } : q));
  };

  const setCorrectOption = (qIndex, optionId) => {
    setQuestions(qs => qs.map((q, i) => i === qIndex ? { ...q, correctOptionId: optionId } : q));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation logic (enhanced to set error state)
    if (!courseId) newErrors.course = 'Please select a course';
    if (!title.trim()) newErrors.title = 'Title is required';

    const questionErrors = {};
    questions.forEach((q, qi) => {
      if (!q.questionText.trim()) questionErrors[qi] = 'Question text is required';
      if (!q.correctOptionId) questionErrors[qi] = 'Select the correct option';
    });
    if (Object.keys(questionErrors).length > 0) newErrors.questions = questionErrors;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = { courseId, title: title.trim(), description: description.trim(), questions };
      try {
        const token = await getToken();
        let res;
        if (isEdit && editingQuizId) res = await apiService.updateQuiz(editingQuizId, payload, token);
        else res = await apiService.createQuiz(payload, token);
        if (res && res.success) {
          alert(isEdit ? 'Quiz updated' : 'Quiz created');
          navigate('/educator/my-quizzes');
        } else {
          console.error('Quiz save failed', res);
          alert(res?.message || res?.error || 'Failed to save quiz');
        }
      } catch (err) {
        console.error('Quiz save error', err);
        alert('Failed to save quiz');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-slate-700 mt-2">
            Design your quiz by adding questions and setting the correct answers.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form - Left Column */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Quiz Metadata Card */}
              <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-sky-100 rounded-lg">📋</span>
                  Quiz Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-slate-700 mb-2">
                      Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="course"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      aria-describedby={errors.course ? "courseError" : undefined}
                    >
                      <option value="">Select a course</option>
                      {loadingCourses ? (
                        <option disabled>Loading courses...</option>
                      ) : (
                        courses.map(c => (
                          <option key={c._id} value={c._id}>{c.courseTitle}</option>
                        ))
                      )}
                    </select>
                    {errors.course && (
                      <p id="courseError" className="mt-2 text-sm text-red-600" role="alert">
                        ⚠️ {errors.course}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                      Quiz Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Chapter 5: JavaScript Fundamentals"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      aria-describedby={errors.title ? "titleError" : undefined}
                    />
                    {errors.title && (
                      <p id="titleError" className="mt-2 text-sm text-red-600" role="alert">
                        ⚠️ {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide a brief description of the quiz..."
                      rows="3"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Questions Section */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 rounded-lg">❓</span>
                    Questions ({questions.length})
                  </h2>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2"
                  >
                    <span>+</span>
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {questions.map((q, qi) => (
                    <div key={q.questionId} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-sky-100 text-sky-700 rounded-lg font-bold">
                            {qi + 1}
                          </div>
                          <h3 className="font-medium text-slate-800">Question {qi + 1}</h3>
                          {errors.questions && errors.questions[qi] && (
                            <span className="text-sm text-red-600" role="alert">
                              ⚠️ {errors.questions[qi]}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qi)}
                          className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-sm font-medium"
                          aria-label={`Remove question ${qi + 1}`}
                        >
                          Remove
                        </button>
                      </div>

                      {/* Question Text Input */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Question Text <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={q.questionText}
                          onChange={(e) => updateQuestionText(qi, e.target.value)}
                          placeholder="Enter your question here..."
                          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                        />
                      </div>

                      {/* Options Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-slate-700">
                            Options <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => addOption(qi)}
                            className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                          >
                            + Add Option
                          </button>
                        </div>

                        <div className="space-y-3">
                          {q.options.map((op, oi) => (
                            <div key={op.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-sky-300 transition-colors">
                              <div className="flex items-center gap-3 flex-1">
                                <input
                                  type="radio"
                                  id={`option_${q.questionId}_${op.id}`}
                                  name={`correct_${q.questionId}`}
                                  checked={q.correctOptionId === op.id}
                                  onChange={() => setCorrectOption(qi, op.id)}
                                  className="w-5 h-5 accent-green-600"
                                  aria-label={`Mark option ${oi + 1} as correct`}
                                />
                                <label htmlFor={`option_${q.questionId}_${op.id}`} className="sr-only">
                                  Correct option
                                </label>
                                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 rounded-lg font-bold">
                                  {String.fromCharCode(65 + oi)}
                                </div>
                                <input
                                  value={op.text}
                                  onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                                  placeholder={`Option ${oi + 1}`}
                                  className="flex-1 p-2 border-none focus:outline-none"
                                />
                              </div>
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(qi, oi)}
                                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                  aria-label={`Remove option ${String.fromCharCode(65 + oi)}`}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="sticky bottom-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/educator/my-quizzes')}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl hover:from-sky-700 hover:to-sky-600 transition-all shadow-lg font-medium"
                  >
                    {isEdit ? 'Update Quiz' : 'Create Quiz'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Preview & Stats Panel - Right Column */}
          <div className="lg:w-1/3">
            <aside className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="p-2 bg-purple-100 rounded-lg">📊</span>
                  Quiz Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Total Questions</span>
                    <span className="font-bold text-slate-900">{questions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Total Points</span>
                    <span className="font-bold text-slate-900">
                      {questions.reduce((sum, q) => sum + q.points, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Status</span>
                    <span className={`font-bold ${isEdit ? 'text-yellow-600' : 'text-green-600'}`}>
                      {isEdit ? 'Editing' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-100 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="p-2 bg-sky-100 rounded-lg">💡</span>
                  Tips for a Great Quiz
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Keep questions clear and concise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Provide 3-5 options per question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Mark the correct answer for each question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Use descriptive quiz titles</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;