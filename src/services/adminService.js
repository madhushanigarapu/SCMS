import api from "./api";

export const createCourse = async (courseData) => {
  const response = await api.post("/savecourse", [courseData]);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/deletecourse/${courseId}`);
  return response.data;
};

// Get all students (admin only)
export const getAllStudents = async () => {
  const response = await api.get("/getallstudents");
  return response.data;
};

// Delete a student (admin action)
export const deleteStudent = async (studentId) => {
  const response = await api.delete(`/deletestudent/${studentId}`);
  return response.data;
};