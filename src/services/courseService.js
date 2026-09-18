import api from "./api";

// Get all courses
export const getAllCourses = async () => {
  const response = await api.get("/getallcourses");
  return response.data;
};

// Add course to student
export const addCourse = async (studentId, courseId) => {
  const response = await api.put(
    `/addcourse/${studentId}/${courseId}`
  );

  return response.data;
};

// Remove course from student
export const removeCourse = async (studentId, courseId) => {
  const response = await api.put(
    `/removecourse/${studentId}/${courseId}`
  );

  return response.data;
};

// Get student's courses
export const getStudentCourses = async (studentId) => {
  const response = await api.get(
    `/fetchstudentcourses/${studentId}`
  );

  return response.data;
};