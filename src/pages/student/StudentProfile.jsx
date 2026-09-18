import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  getStudentById,
  getStudentImage,
  uploadStudentImage,
} from "../../services/studentService";
import Loading from "../../components/Loading";

const Profile = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [student, setStudent] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const imageUrlRef = useRef("");

  const fetchImage = async () => {
    if (!user?.studentId) return;
    try {
      setImageLoading(true);
      const imageBlob = await getStudentImage(user.studentId);
      const url = URL.createObjectURL(imageBlob);
      setImageUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return url;
      });
      imageUrlRef.current = url;
    } catch {
      setImageUrl("");
      imageUrlRef.current = "";
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.studentId) {
        toast.error("Student information not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await getStudentById(user.studentId);
        setStudent(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.studentId]);

  useEffect(() => {
    fetchImage();
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    };
  }, [user?.studentId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }
    try {
      setUploading(true);
      await uploadStudentImage(user.studentId, selectedFile);
      toast.success("Profile image updated!");
      setSelectedFile(null);
      await fetchImage();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading message="Loading profile..." />;

  if (!student) {
    return (
      <div>
        <h2>Profile</h2>
        <p>Could not load profile. Please try again.</p>
        <Link to="/student/dashboard" className="secondary-button" style={{ marginTop: "12px", display: "inline-flex" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View and manage your personal information.</p>
      </div>

      <div className="profile-container">

        {/* Profile Photo */}
        <div className="profile-card">
          <h3>Profile Photo</h3>
          {imageLoading ? (
            <div className="profile-placeholder">Loading...</div>
          ) : imageUrl ? (
            <img className="profile-image" src={imageUrl} alt="Profile" />
          ) : (
            <div className="profile-placeholder">
              {student.firstName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div className="profile-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedFile && (
              <p className="profile-upload-filename">{selectedFile.name}</p>
            )}
            <button
              className="primary-button"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              style={{ marginTop: "12px", width: "100%" }}
            >
              {uploading ? (
                <><span className="btn-spinner btn-spinner--sm" /> Uploading...</>
              ) : (
                "Upload Image"
              )}
            </button>
          </div>
        </div>

        {/* Student Details */}
        <div className="profile-details">
          <h3>Personal Information</h3>
          {[
            { label: "Student ID",    value: student.studentId    },
            { label: "First Name",    value: student.firstName    },
            { label: "Last Name",     value: student.lastName     },
            { label: "Email",         value: student.email        },
            { label: "Mobile Number", value: student.mobileNumber },
            { label: "Address",       value: student.address      },
          ].map(({ label, value }) => (
            <div className="profile-detail-row" key={label}>
              <span className="profile-detail-label">{label}</span>
              <span className="profile-detail-value">{value}</span>
            </div>
          ))}
          <div className="profile-actions">
            <Link to="/student/edit-profile" className="primary-button">
              Edit Profile
            </Link>
            <Link to="/student/courses" className="secondary-button">
              Browse Courses
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
