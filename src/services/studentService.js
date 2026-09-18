import api from "./api";

// Get student by ID
export const getStudentById = async (studentId) => {
  const response = await api.get(`/findstudentbyid/${studentId}`);
  return response.data;
};

// Update student
export const updateStudent = async (studentId, studentData) => {
  const response = await api.put(
    `/updatestudent/${studentId}`,
    studentData
  );

  return response.data;
};

// Upload student profile image
// We must explicitly set Content-Type to undefined so Axios drops the
// instance-level "application/json" default and lets the browser set
// "multipart/form-data; boundary=..." automatically with the correct boundary.
export const uploadStudentImage = async (studentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.put(`/uploadimage/${studentId}`, formData, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};

// Fetch student profile image as a Blob
export const getStudentImage = async (studentId) => {
  const response = await api.get(`/fetchimage/${studentId}`, {
    responseType: "blob",
  });

  return response.data;
};
