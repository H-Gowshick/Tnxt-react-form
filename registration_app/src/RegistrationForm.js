import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const RegistrationForm = () => {
  const [registrations, setRegistrations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    email: "",
    phoneNumber: "",
    subject: "",
    image: null,
  });
  // Add the following lines to define formErrors and setFormErrors
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    email: "",
    phoneNumber: "",
    subject: "",
    image: "",
  });
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const validateForm = () => {
    let valid = true;
    const newFormErrors = { ...formErrors };

    // Validate First Name
    if (formData.firstName.trim() === "") {
      newFormErrors.firstName = "First Name is required";
      valid = false;
    }
    else {
      newFormErrors.firstName = "";
    }

    // Validate Last Name
    if (formData.lastName.trim() === "") {
      newFormErrors.lastName = "Last Name is required";
      valid = false;
    } else {
      newFormErrors.lastName = "";
    }

    // Validate Birthday (You can add more specific validations if needed)
    if (formData.birthday === "") {
      newFormErrors.birthday = "Birthday is required";
      valid = false;
    } else {
      newFormErrors.birthday = "";
    }

    // Validate Gender
    if (!formData.gender) {
      newFormErrors.gender = "Gender is required";
      valid = false;
    } else {
      newFormErrors.gender = "";
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newFormErrors.email = "Valid Email is required";
      valid = false;
    } else {
      newFormErrors.email = "";
    }

    // Validate Phone Number
    const phoneRegex = /^[0-9]{10}$/;
    if (
      !formData.phoneNumber.trim() ||
      !phoneRegex.test(formData.phoneNumber)
    ) {
      newFormErrors.phoneNumber = "Valid Phone Number is required";
      valid = false;
    }
    if(formData.phoneNumber.length<10){
      newFormErrors.phoneNumber = "valid 10 digits required";
      valid = false;
    } else {
      newFormErrors.phoneNumber = "";
    }

    // Validate Subject
    if (!formData.subject) {
      newFormErrors.subject = "Subject is required";
      valid = false;
    } else {
      newFormErrors.subject = "";
    }

    // Validate Image
    if (!formData.image) {
      newFormErrors.image = "Image is required";
      valid = false;
    } else if (formData.image.size > 1024 * 1024) {
      newFormErrors.image = "Image size should be less than 1MB";
      valid = false;
    } else {
      newFormErrors.image = "";
    }

    setFormErrors(newFormErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // If the form is not valid, do not proceed with submission
      return;
    }
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append("firstName", formData.firstName);
      formDataWithImage.append("lastName", formData.lastName);
      formDataWithImage.append("birthday", formData.birthday);
      formDataWithImage.append("gender", formData.gender);
      formDataWithImage.append("email", formData.email);
      formDataWithImage.append("phoneNumber", formData.phoneNumber);
      formDataWithImage.append("subject", formData.subject);
      formDataWithImage.append("image", formData.image);

      if (editingId) {
        const response = await fetch(
          `http://localhost:3001/api/register/${editingId}`,
          {
            method: "PUT",
            body: formDataWithImage,
          }
        );

        if (response.ok) {
          console.log("Update successful");
          setEditingId(null); // Clear the editing state

          setRegistrations((prevRegistrations) => {
            return prevRegistrations.map((registration) =>
              registration._id === editingId
                ? {
                    ...registration,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    birthday: formData.birthday,
                    gender: formData.gender,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    subject: formData.subject,

                    image: formData.image ? formData.image : registration.image,
                  }
                : registration
            );
          });
        } else {
          console.error("Update failed");
        }
      } else {
        const response = await fetch("http://localhost:3001/api/register", {
          method: "POST",
          body: formDataWithImage,
        });

        if (response.ok) {
          console.log("Registration successful");
        } else {
          console.error("Registration failed");
        }
      }

      setFormData({
        firstName: "",
        lastName: "",
        birthday: "",
        gender: "",
        email: "",
        phoneNumber: "",
        subject: "",
        image: null,
      });

      fetchRegistrations();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (registration) => {
    setFormData({
      firstName: registration.firstName,
      lastName: registration.lastName,
      birthday: registration.birthday,
      gender: registration.gender,
      email: registration.email,
      phoneNumber: registration.phoneNumber,
      subject: registration.subject,
      image: null,
    });

    setEditingId(registration._id);
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/registrations");
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      } else {
        console.error("Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/register/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Delete successful");

        setRegistrations((prevRegistrations) =>
          prevRegistrations.filter((registration) => registration._id !== id)
        );
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <small className="text-danger">{formErrors.firstName}</small>
          </div>
          <div className="col">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <small className="text-danger">{formErrors.lastName}</small>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="birthday" className="form-label">
              Birthday
            </label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
            <small className="text-danger">{formErrors.birthday}</small>
          </div>
          <div className="col">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <div className="d-flex align-items-center">
              <div className="form-check me-4">
                <input
                  type="radio"
                  className="form-check-input"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                <label htmlFor="male" className="form-check-label">
                  Male
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                <label htmlFor="female" className="form-check-label">
                  Female
                </label>
              </div>
            </div>
            <small className="text-danger">{formErrors.gender}</small>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <small className="text-danger">{formErrors.email}</small>
          </div>
          <div className="col">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              placeholder="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <small className="text-danger">{formErrors.phoneNumber}</small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <select
              className="form-select"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="english">English</option>
            </select>
            <small className="text-danger">{formErrors.subject}</small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleChange}
            />
            <small className="text-danger">{formErrors.image}</small>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>

      {/* registered User */}
      <h2 className="mt-5">Registered Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Subject</th>
            <th>Image</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr key={registration._id}>
              <td>{registration.firstName}</td>
              <td>{registration.lastName}</td>
              <td>{registration.birthday}</td>
              <td>{registration.gender}</td>
              <td>{registration.email}</td>
              <td>{registration.phoneNumber}</td>
              <td>{registration.subject}</td>
              <td>
                {registration.image && (
                  <img
                    src={`data:image/png;base64,${registration.image}`}
                    alt="User"
                    style={{ maxWidth: "100px" }}
                  />
                )}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={() => handleEdit(registration)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(registration._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationForm;
