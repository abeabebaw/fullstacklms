import React, { useEffect, useRef, useState, useContext } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { assets } from '../../assets/assets';
import { useAuth } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { useParams, Link } from 'react-router-dom';

const EditCourse = () => {
  // Support both ":id" and ":courseId" param names
  const { id, courseId } = useParams();
  const effectiveId = id || courseId;
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const { getToken } = useAuth();
  const { fetchEducatorCourses } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState('');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [courseCategory, setCourseCategory] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [courseDescription, setCourseDescription] = useState('');
  const [image, setImage] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  });
  const [editingLectureId, setEditingLectureId] = useState(null);
  const lectureFilesRef = useRef(new Map());
  const [popupFile, setPopupFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing course
  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const result = await apiService.getCourseById(effectiveId, token);
        if (result.success && result.courseData) {
          const c = result.courseData;
          setCourseTitle(c.courseTitle || '');
          setCourseLevel(c.courseLevel || 'beginner');
          setCourseCategory(c.courseCategory || '');
          setCoursePrice(Number(c.coursePrice || 0));
          setDiscount(Number(c.discount || 0));
          setExistingThumbnail(c.courseThumbnail || '');
          setCourseDescription(c.courseDescription || '');
          setChapters(Array.isArray(c.courseContent) ? c.courseContent.map(ch => ({
            ...ch,
            collapsed: false
          })) : []);
          if (quillRef.current) {
            try {
              quillRef.current.clipboard.dangerouslyPasteHTML(c.courseDescription || '');
            } catch (err) {
              quillRef.current.root.innerHTML = c.courseDescription || '';
            }
          } else if (editorRef.current) {
            // Initialize then set
            quillRef.current = new Quill(editorRef.current, {
              theme: 'snow',
              placeholder: 'Write your course description here...',
              modules: {
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  ['link', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }]
                ]
              }
            });
            try {
              quillRef.current.clipboard.dangerouslyPasteHTML(c.courseDescription || '');
            } catch (err) {
              quillRef.current.root.innerHTML = c.courseDescription || '';
            }
          }
        }
      } catch (e) {
        console.error('Failed to load course:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveId]);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your course description here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }]
          ]
        }
      });
    }
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    const sync = () => {
      const plain = q.getText().trim();
      setCourseDescription(plain.length > 0 ? q.root.innerHTML : '');
    };

    q.on('text-change', sync);
    // initial sync
    sync();
    return () => {
      try { q.off('text-change', sync); } catch (e) { /* ignore */ }
    };
  }, [loading]);

  const addChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `ch_${Math.random().toString(36).slice(2)}`,
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(chapters.map((chapter) => (chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter)));
    }
  };

  const openAddLecture = (chapterId) => {
    setCurrentChapterId(chapterId);
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false });
    setEditingLectureId(null);
    setShowPopup(true);
  };

  const openEditLecture = (chapterId, lecture) => {
    setCurrentChapterId(chapterId);
    setLectureDetails({
      lectureTitle: lecture.lectureTitle || '',
      lectureDuration: String(lecture.lectureDuration || ''),
      lectureUrl: lecture.lectureUrl || '',
      isPreviewFree: !!lecture.isPreviewFree
    });
    setEditingLectureId(lecture.lectureId);
    setPopupFile(null);
    setShowPopup(true);
  };

  const saveLecture = () => {
    if (!currentChapterId) return;
    // If editing existing lecture
    if (editingLectureId) {
      setChapters((s) => s.map((c) => {
        if (c.chapterId !== currentChapterId) return c;
        const updatedLectures = c.chapterContent.map((l) => {
          if (l.lectureId !== editingLectureId) return l;
          const updated = {
            ...l,
            lectureTitle: lectureDetails.lectureTitle || 'Untitled Lecture',
            lectureDuration: Number(lectureDetails.lectureDuration) || 0,
            lectureUrl: popupFile ? URL.createObjectURL(popupFile) : (lectureDetails.lectureUrl || ''),
            isPreviewFree: !!lectureDetails.isPreviewFree
          };
          return updated;
        });
        // if a file was selected, map it to existing lectureId for backend replacement
        if (popupFile) {
          try {
            const renamed = new File([popupFile], `${editingLectureId}_${popupFile.name}`, { type: popupFile.type });
            lectureFilesRef.current.set(editingLectureId, renamed);
          } catch (err) {
            lectureFilesRef.current.set(editingLectureId, popupFile);
          }
        }
        return { ...c, chapterContent: updatedLectures };
      }));
    } else {
      // Adding new lecture
      setChapters((s) => s.map((c) => {
        if (c.chapterId !== currentChapterId) return c;
        const newLectureId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `lec_${Math.random().toString(36).slice(2)}`;
        const newLecture = {
          lectureId: newLectureId,
          lectureTitle: lectureDetails.lectureTitle || 'Untitled Lecture',
          lectureDuration: Number(lectureDetails.lectureDuration) || 0,
          lectureUrl: popupFile ? URL.createObjectURL(popupFile) : (lectureDetails.lectureUrl || ''),
          isPreviewFree: !!lectureDetails.isPreviewFree,
          lectureOrder: c.chapterContent.length + 1
        };
        if (popupFile) {
          try {
            const renamed = new File([popupFile], `${newLectureId}_${popupFile.name}`, { type: popupFile.type });
            lectureFilesRef.current.set(newLectureId, renamed);
          } catch (err) {
            lectureFilesRef.current.set(newLectureId, popupFile);
          }
        }
        return { ...c, chapterContent: [...c.chapterContent, newLecture] };
      }));
    }
    setShowPopup(false);
    setPopupFile(null);
    setEditingLectureId(null);
  };

  const removeLecture = (chapterId, lectureId) => {
    setChapters((s) => s.map((c) => (c.chapterId === chapterId ? { ...c, chapterContent: c.chapterContent.filter((l) => l.lectureId !== lectureId) } : c)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // basic validation
    if (!courseTitle.trim()) {
      alert('Course title is required');
      setSubmitting(false);
      return;
    }
    const priceNum = Number(coursePrice);
    const discountNum = Number(discount);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      alert('Price must be a non-negative number');
      setSubmitting(false);
      return;
    }
    if (Number.isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      alert('Discount must be between 0 and 100');
      setSubmitting(false);
      return;
    }

    let description = '';
    if (quillRef.current) {
      const plain = quillRef.current.getText().trim();
      description = plain.length > 0 ? quillRef.current.root.innerHTML : '';
    } else {
      description = courseDescription || '';
    }

    const descriptionPlain = quillRef.current
      ? quillRef.current.getText().trim()
      : (() => {
        const div = document.createElement('div');
        div.innerHTML = description || '';
        return (div.textContent || div.innerText || '').trim();
      })();

    if (!descriptionPlain) {
      alert('Course description is required');
      setSubmitting(false);
      return;
    }
    const courseData = {
      courseTitle,
      courseLevel,
      courseCategory,
      coursePrice: priceNum || 0,
      discount: discountNum || 0,
      courseDescription: description,
      courseContent: chapters
    };

    try {
      const token = await getToken();
      const lectureFiles = Array.from(lectureFilesRef.current.values());
      const result = await apiService.updateEducatorCourse(effectiveId, courseData, image, lectureFiles, token);
      if (result.success) {
        alert('Course updated successfully!');
        try { await fetchEducatorCourses(); } catch (e) {}
      } else {
        console.error('Update course response:', result);
        alert(result.message || result.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p>Loading course...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl text-slate-900">Edit Course</h2>
        <Link className="text-sky-600" to="/educator/my-courses">Back to My Courses</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input
            type="text"
            onChange={e => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder='type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-slate-300 focus:ring-2 focus:ring-sky-300'
            required
          />
        </div>

        <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
          <div className='flex flex-col gap-1'>
            <p>Course Level</p>
            <select
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
              className='outline-none md:py-2.5 py-2 px-3 rounded border border-slate-300 focus:ring-2 focus:ring-sky-300'
            >
              <option value='beginner'>Beginner</option>
              <option value='intermediate'>Intermediate</option>
              <option value='advanced'>Advanced</option>
            </select>
          </div>
          <div className='flex flex-col gap-1'>
            <p>Course Category</p>
            <select
              value={courseCategory}
              onChange={(e) => setCourseCategory(e.target.value)}
              className='outline-none md:py-2.5 py-2 px-3 rounded border border-slate-300 focus:ring-2 focus:ring-sky-300'
              required
            >
              <option value=''>Select a category</option>
              <option value='Web Development'>Web Development</option>
              <option value='Cyber Security'>Cyber Security</option>
              <option value='Machine Learning'>Machine Learning</option>
              <option value='Data Science'>Data Science</option>
              <option value='Mobile Development'>Mobile Development</option>
              <option value='Cloud Computing'>Cloud Computing</option>
              <option value='DevOps'>DevOps</option>
              <option value='UI/UX'>UI/UX</option>
              <option value='Programming Languages'>Programming Languages</option>
              <option value='Blockchain'>Blockchain</option>
              <option value='Artificial Intelligence'>Artificial Intelligence</option>
              <option value='Database'>Database</option>
            </select>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef} style={{ height: '200px' }}></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input
              onChange={e => setCoursePrice(e.target.value)}
              value={coursePrice}
              type='number'
              placeholder='0'
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-slate-300 focus:ring-2 focus:ring-sky-300'
              required
            />
          </div>
        </div>

        <div className='flex md:flex-row flex-col items-center gap-3'>
          <p>Course Thumbnail</p>
          <label htmlFor='thumbnailImage' className='flex items-center gap-3 cursor-pointer'>
            <img
              src={assets.file_upload_icon}
              alt='Upload'
              className='p-3 bg-sky-500 rounded'
            />
          </label>
          <input
            type='file'
            id='thumbnailImage'
            onChange={e => setImage(e.target.files[0])}
            accept='image/*'
            hidden
          />
          {image ? (
            <img className='max-h-10' src={URL.createObjectURL(image)} alt='Thumbnail preview' />
          ) : existingThumbnail ? (
            <img className='max-h-10' src={existingThumbnail} alt='Current thumbnail' />
          ) : null}
        </div>

        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input
            onChange={e => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500'
            required
          />
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.chapterId} className="bg-white border border-slate-200 rounded-lg mb-4 w-full">
            <div className='flex justify-between items-center p-4 border-b border-slate-200'>
              <div className='flex items-center'>
                <img
                  src={assets.dropdown_icon}
                  width={14}
                  alt='Toggle'
                  className={`mr-2 cursor-pointer transition-all ${chapter.collapsed ? '-rotate-90' : ''}`}
                  onClick={() => addChapter('toggle', chapter.chapterId)}
                />
                <span className='font-semibold'>
                  {chapterIndex + 1}. {chapter.chapterTitle}
                </span>
              </div>
              <span className='text-gray-500'>
                {chapter.chapterContent.length} Lectures
              </span>
              <img
                src={assets.cross_icon}
                alt="Remove chapter"
                className='cursor-pointer'
                onClick={() => addChapter('remove', chapter.chapterId)}
              />
            </div>
            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div key={lecture.lectureId} className="flex justify-between items-center mb-2">
                    <span>
                      {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - {lecture.lectureUrl ? (<a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 ml-1">Link</a>) : (<span className="ml-1 text-slate-400">No link</span>)} - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                    </span>
                    <div className="flex items-center gap-3">
                      <button type="button" className="text-sky-600" onClick={() => openEditLecture(chapter.chapterId, lecture)}>Edit</button>
                      <button type="button" className="text-rose-600" onClick={() => removeLecture(chapter.chapterId, lecture.lectureId)}>Remove</button>
                    </div>
                  </div>
                ))}
                <div
                  className="inline-flex bg-slate-100 p-2 rounded cursor-pointer mt-2"
                  onClick={() => openAddLecture(chapter.chapterId)}
                >
                  + Add Lecture
                </div>
              </div>
            )}
          </div>
        ))}

        <div
          className="flex justify-center items-center bg-sky-100 p-2 rounded-lg cursor-pointer"
          onClick={() => addChapter('add')}
        >
          + Add Chapter
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-sky-700'}`}
        >
          {submitting ? 'Processing…' : 'Save Changes'}
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 z-50">
          <div className="bg-white text-slate-700 p-4 rounded relative w-full max-w-md border border-slate-200">
            <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

            <label className="block text-sm text-slate-600">Title</label>
            <input
              className="mt-1 block w-full border border-slate-300 rounded py-1 px-2 mb-2 focus:ring-2 focus:ring-sky-300"
              value={lectureDetails.lectureTitle}
              onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
            />

            <label className="block text-sm text-slate-600">Duration (minutes)</label>
            <input
              className="mt-1 block w-full border border-slate-300 rounded py-1 px-2 mb-2 focus:ring-2 focus:ring-sky-300"
              type="number"
              value={lectureDetails.lectureDuration}
              onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
            />

            <label className="block text-sm text-slate-600">Video URL</label>
            <input
              className="mt-1 block w-full border border-slate-300 rounded py-1 px-2 mb-2 focus:ring-2 focus:ring-sky-300"
              value={lectureDetails.lectureUrl}
              onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
              placeholder="Or choose a local video below"
            />

            <label className="block text-sm text-slate-600 mt-2">Or upload local video</label>
            <input
              type="file"
              accept="video/*"
              className="mt-1 block w-full border border-slate-300 rounded py-1 px-2 mb-2 focus:ring-2 focus:ring-sky-300"
              onChange={(e) => setPopupFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            />
            {popupFile && (
              <div className="text-sm text-slate-500">Selected: {popupFile.name}</div>
            )}

            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
              />
              Preview free
            </label>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                className="px-3 py-1 bg-slate-200 rounded"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-sky-600 text-white rounded"
                onClick={saveLecture}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
