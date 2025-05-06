import axios from 'axios';
import { useEffect, useState } from 'react';
import './CourseManager.css';


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


  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const result = await axios.get("http://localhost:8080/api/v1/course/all");
    setCourses(result.data);
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/v1/course/add", {
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
    try {
      await axios.put(`http://localhost:8080/api/v1/course/update/${id}`, {
        title, description, category, pdfUrl
      });
      alert("Course Updated.");
      clearForm();
      loadCourses();
    } catch (error) {
      alert("Error while updating course");
    }
  };

  const deleteCourse = async (courseId) => {
    await axios.delete(`http://localhost:8080/api/v1/course/delete/${courseId}`);
    alert("Course Deleted");
    loadCourses();
  };

  const editCourse = (course) => {
    setId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setPdfUrl(course.pdfUrl);
  };

  const clearForm = () => {
    setId('');
    setTitle('');
    setDescription('');
    setCategory('');
    setPdfUrl('');
  };

  return (
    <div className="container mt-4">
      <h2>Course Management</h2>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className="form-group">
          <label>PDF URL</label>
          <input type="text" className="form-control" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} />
        </div>

        <button className="btn btn-primary mt-3" onClick={saveCourse}>Add Course</button>
        <button className="btn btn-warning mt-3 ml-2" onClick={updateCourse}>Update Course</button>
      </form>

      <hr />
      <h4>Available Courses</h4>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>PDF</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.category}</td>
              <td>{course.description}</td>
              <td><a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a></td>
              <td>
                <button className="btn btn-warning" onClick={() => editCourse(course)}>Edit</button>{' '}
                <button className="btn btn-danger" onClick={() => deleteCourse(course.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseManager;
