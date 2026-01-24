import React, { useEffect, useRef, useState, useContext } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css' // Important: import styles for the editor
import { assets } from '../../assets/assets'
import { useAuth } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { apiService } from '../../services/api'

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const { getToken } = useAuth();
  const { fetchAllCourses } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState('');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [courseCategory, setCourseCategory] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  });
  // map of lectureId -> File for local video uploads (ref so mutations don't re-render)
  const lectureFilesRef = useRef(new Map());
  const [popupFile, setPopupFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // handlers
  const [showChapterInput, setShowChapterInput] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const addChapter = (action, chapterId) => {
    if (action === 'add') {
      setShowChapterInput(true);
    }
    else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    }
    else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? {
            ...chapter,
            collapsed: !chapter.collapsed
          } : chapter
        )
      )
    }
  }

  const handleAddChapterConfirm = () => {
    const title = newChapterTitle.trim();
    if (title) {
      const newChapter = {
        chapterId: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `ch_${Math.random().toString(36).slice(2)}`,
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder: chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1
      }
      setChapters([...chapters, newChapter]);
      setNewChapterTitle('');
      setShowChapterInput(false);
    }
  }

  const handleAddChapterCancel = () => {
    setNewChapterTitle('');
    setShowChapterInput(false);
  }

  const toggleChapter = (id) => {
    setChapters((s) => s.map(c => c.chapterId === id ? { ...c, collapsed: !c.collapsed } : c))
  }

  const openAddLecture = (chapterId) => {
    setCurrentChapterId(chapterId)
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false })
    setShowPopup(true)
  }

  const saveLecture = () => {
    if (!currentChapterId) return
    setChapters((s) => s.map(c => {
      if (c.chapterId !== currentChapterId) return c
      const newLectureId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `lec_${Math.random().toString(36).slice(2)}`;
      const newLecture = {
        lectureId: newLectureId,
        lectureTitle: lectureDetails.lectureTitle || 'Untitled Lecture',
        lectureDuration: Number(lectureDetails.lectureDuration) || 0,
        // if a local file was provided, create an object URL for preview; otherwise use provided URL
        lectureUrl: popupFile ? URL.createObjectURL(popupFile) : (lectureDetails.lectureUrl || ''),
        isPreviewFree: !!lectureDetails.isPreviewFree,
        lectureOrder: c.chapterContent.length + 1
      }

      // if a file was selected in the popup, store it in the ref map with a name prefixed by lectureId
      if (popupFile) {
        try {
          const renamed = new File([popupFile], `${newLectureId}_${popupFile.name}`, { type: popupFile.type });
          lectureFilesRef.current.set(newLectureId, renamed);
        } catch (err) {
          // fallback: some browsers may not allow File constructor; keep original file but prefix not available
          lectureFilesRef.current.set(newLectureId, popupFile);
        }
      }

      return { ...c, chapterContent: [...c.chapterContent, newLecture] }
    }))
    setShowPopup(false)
    setPopupFile(null)
  }

  const removeLecture = (chapterId, lectureId) => {
    setChapters((s) => s.map(c => c.chapterId === chapterId ?
      { ...c, chapterContent: c.chapterContent.filter(l => l.lectureId !== lectureId) } : c))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return;
    setSubmitting(true);
    let description = ''
    if (quillRef.current) {
      const plain = quillRef.current.getText().trim()
      description = plain.length > 0 ? quillRef.current.root.innerHTML : ''
    }
    const courseData = {
      courseTitle,
      courseLevel,
      courseCategory,
      coursePrice: Number(coursePrice) || 0,
      discount: Number(discount) || 0,
      courseDescription: description,
      courseContent: chapters
    }

    try {
      const token = await getToken();
      // collect lecture files from the ref
      const lectureFiles = Array.from(lectureFilesRef.current.values());
      const result = await apiService.addCourse(courseData, image, lectureFiles, token);
      if (result.success) {
        alert('Course added successfully!')
        // Refresh global course list
        try { await fetchAllCourses(); } catch (e) { /* ignore */ }
        // Reset form
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        lectureFilesRef.current = new Map();
        if (quillRef.current) {
          try {
            quillRef.current.clipboard.dangerouslyPasteHTML('');
          } catch (err) {
            quillRef.current.root.innerHTML = '';
          }
        }
      } else {
        console.error('Add course response:', result);
        alert(result.message || result.error || 'Failed to add course')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding course')
    } finally {
      setSubmitting(false);
    }
  }

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
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl mb-4 text-slate-900">Add Course</h2>

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
          {image && (
            <img
              className='max-h-10'
              src={URL.createObjectURL(image)}
              alt='Thumbnail preview'
            />
          )}
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
            className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-slate-300 focus:ring-2 focus:ring-sky-300'
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
              <span className='text-slate-600'>
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
                      {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                      <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 ml-1">Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                    </span>
                    <img
                      src={assets.cross_icon}
                      alt="Remove lecture"
                      className="cursor-pointer"
                      onClick={() => removeLecture(chapter.chapterId, lecture.lectureId)}
                    />
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


        {showChapterInput ? (
          <div className="flex flex-col md:flex-row items-center gap-2 bg-sky-50 p-3 rounded-lg border border-sky-200 my-2">
            <input
              type="text"
              className="outline-none py-2 px-3 rounded border border-slate-300 focus:ring-2 focus:ring-sky-300 w-full md:w-64"
              placeholder="Enter Chapter Name"
              value={newChapterTitle}
              onChange={e => setNewChapterTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddChapterConfirm(); }}
              autoFocus
            />
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                type="button"
                className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
                onClick={handleAddChapterConfirm}
              >
                Add
              </button>
              <button
                type="button"
                className="bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300"
                onClick={handleAddChapterCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center bg-sky-100 p-2 rounded-lg cursor-pointer"
            onClick={() => addChapter('add')}
          >
            + Add Chapter
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-sky-700'}`}
        >
          {submitting ? 'Processing…' : 'Add Course'}
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-2xl relative w-full max-w-lg border border-slate-200 animate-fadeIn">
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold focus:outline-none"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-sky-700 flex items-center gap-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Add New Lecture
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Lecture Title</label>
                <input
                  className="block w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  placeholder="Enter lecture title"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Duration <span className="text-xs text-slate-400">(minutes)</span></label>
                <input
                  className="block w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                  type="number"
                  min="0"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Video URL</label>
                <input
                  className="block w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  placeholder="Paste video URL or upload below"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Or upload local video</label>
                <input
                  type="file"
                  accept="video/*"
                  className="block w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  onChange={(e) => setPopupFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                />
                {popupFile && (
                  <div className="text-xs text-slate-500 mt-1">Selected: <span className="font-medium">{popupFile.name}</span></div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="previewFree"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  className="accent-sky-600 h-4 w-4"
                />
                <label htmlFor="previewFree" className="text-sm text-slate-600 select-none cursor-pointer">Preview free</label>
              </div>
            </div>
            <div className="mt-8 flex gap-3 justify-end">
              <button
                type="button"
                className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition shadow"
                onClick={saveLecture}
              >
                Save Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;