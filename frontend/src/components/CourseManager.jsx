import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles/CourseManager.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilePdf, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function CourseManager() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('beginner');
  const [pdfUrl, setPdfUrl] = useState('');
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const result = await axios.get("http://localhost:8081/api/auth/v1/course/all");
      setCourses(result.data);
    } catch (error) {
      console.error("Error loading courses:", error);
      alert("Failed to load courses");
    }
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    try {
      await axios.post("http://localhost:8081/api/auth/v1/course/add", {
        title, description, category, pdfUrl
      });
      alert("Course Added Successfully");
      clearForm();
      loadCourses();
    } catch (error) {
      alert("Error while adding course");
    }
  };

  const updateCourse = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    try {
      await axios.put(`http://localhost:8081/api/auth/v1/course/update/${id}`, {
        title, description, category, pdfUrl
      });
      alert("Course Updated Successfully");
      clearForm();
      loadCourses();
    } catch (error) {
      alert("Error while updating course");
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      await axios.delete(`http://localhost:8081/api/auth/v1/course/delete/${courseId}`);
      alert("Course Deleted Successfully");
      loadCourses();
    } catch (error) {
      alert("Error while deleting course");
    }
  };

  const editCourse = (course) => {
    setId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setPdfUrl(course.pdfUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setId('');
    setTitle('');
    setDescription('');
    setCategory('beginner');
    setPdfUrl('');
  };

  const validateForm = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return false;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return false;
    }
    if (!pdfUrl.trim()) {
      alert("Please enter a PDF URL");
      return false;
    }
    return true;
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="app-background">
      <div className="course-manager-container">
        <div className="course-form-container">
          <h2>{id ? 'Update Course' : 'Add New Course'}</h2>
          <form>
            <div className="form-group">
              <label>Title*</label>
              <input 
                type="text" 
                className="form-control" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter course title"
              />
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea 
                className="form-control" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter course description"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level*</label>
              <select 
                className="form-control" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                {difficultyLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>PDF URL*</label>
              <input 
                type="text" 
                className="form-control" 
                value={pdfUrl} 
                onChange={(e) => setPdfUrl(e.target.value)} 
                placeholder="Enter PDF URL"
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={id ? updateCourse : saveCourse}>
                {id ? 'Update Course' : 'Add Course'}
              </button>
              {id && (
                <button className="btn btn-secondary" onClick={clearForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="course-list-container">
          <div className="course-list-header">
            <h3>Available Courses</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
          </div>

          {currentCourses.length > 0 ? (
            <>
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Level</th>
                    <th>Description</th>
                    <th>PDF</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>
                        <span className={`level-badge ${course.category}`}>
                          {difficultyLevels.find(l => l.value === course.category)?.label || course.category}
                        </span>
                      </td>
                      <td>{course.description}</td>
                      <td>
                        <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-link">
                          <FontAwesomeIcon icon={faFilePdf} /> View
                        </a>
                      </td>
                      <td>
                        <button className="btn btn-edit" onClick={() => editCourse(course)}>
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                        <button className="btn btn-delete" onClick={() => deleteCourse(course.id)}>
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-courses">
              {searchTerm ? 'No courses match your search.' : 'No courses available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseManager;