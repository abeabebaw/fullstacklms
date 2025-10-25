import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import 'quill/dist/quill.snow.css' // Important: import styles for the editor
import { assets } from '../../assets/assets'

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
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

  // handlers
  const addChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          id: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1
        }
        setChapters([...chapters, newChapter])
      }
    }
    else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId))
    }
    else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId ? {
            ...chapter,
            collapsed: !chapter.collapsed
          } : chapter
        )
      )
    }
  }

  const toggleChapter = (id) => {
    setChapters((s) => s.map(c => c.id === id ? { ...c, collapsed: !c.collapsed } : c))
  }

  const openAddLecture = (chapterId) => {
    setCurrentChapterId(chapterId)
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false })
    setShowPopup(true)
  }

  const saveLecture = () => {
    if (!currentChapterId) return
    setChapters((s) => s.map(c => {
      if (c.id !== currentChapterId) return c
      const newLecture = {
        lectureId: uniqid(),
        lectureTitle: lectureDetails.lectureTitle || 'Untitled Lecture',
        lectureDuration: Number(lectureDetails.lectureDuration) || 0,
        lectureUrl: lectureDetails.lectureUrl || '',
        isPreviewFree: !!lectureDetails.isPreviewFree
      }
      return { ...c, chapterContent: [...c.chapterContent, newLecture] }
    }))
    setShowPopup(false)
  }

  const removeLecture = (chapterId, lectureId) => {
    setChapters((s) => s.map(c => c.id === chapterId ?
      { ...c, chapterContent: c.chapterContent.filter(l => l.lectureId !== lectureId) } : c))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const description = quillRef.current ? quillRef.current.root.innerHTML : ''
    const payload = {
      courseTitle,
      coursePrice: Number(coursePrice) || 0,
      discount: Number(discount) || 0,
      image,
      description,
      chapters
    }
    console.log('Course Data:', payload)
    // Add your submission logic here
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your course description here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }]
          ]
        }
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-full text-gray-500 w-full">
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input
            type="text"
            onChange={e => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder='type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
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
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500'
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
              className='p-3 bg-blue-500 rounded'
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
            className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500'
            required
          />
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="bg-white border rounded-lg mb-4 w-full">
            <div className='flex justify-between items-center p-4 border-b'>
              <div className='flex items-center'>
                <img
                  src={assets.dropdown_icon}
                  width={14}
                  alt='Toggle'
                  className={`mr-2 cursor-pointer transition-all ${chapter.collapsed ? '-rotate-90' : ''}`}
                  onClick={() => addChapter('toggle', chapter.id)}
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
                onClick={() => addChapter('remove', chapter.id)}
              />
            </div>
            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div key={lecture.lectureId} className="flex justify-between items-center mb-2">
                    <span>
                      {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -
                      <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                    </span>
                    <img
                      src={assets.cross_icon}
                      alt="Remove lecture"
                      className="cursor-pointer"
                      onClick={() => removeLecture(chapter.id, lecture.lectureId)}
                    />
                  </div>
                ))}
                <div
                  className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                  onClick={() => openAddLecture(chapter.id)}
                >
                  + Add Lecture
                </div>
              </div>
            )}
          </div>
        ))}

        <div
          className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
          onClick={() => addChapter('add')}
        >
          + Add Chapter
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Course
        </button>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

              <label className="block text-sm text-gray-600">Title</label>
              <input
                className="mt-1 block w-full border rounded py-1 px-2 mb-2"
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
              />

              <label className="block text-sm text-gray-600">Duration (minutes)</label>
              <input
                className="mt-1 block w-full border rounded py-1 px-2 mb-2"
                type="number"
                value={lectureDetails.lectureDuration}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
              />

              <label className="block text-sm text-gray-600">Video URL</label>
              <input
                className="mt-1 block w-full border rounded py-1 px-2 mb-2"
                value={lectureDetails.lectureUrl}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
              />

              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
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
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={saveLecture}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCourse;