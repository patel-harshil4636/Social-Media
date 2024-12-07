import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [allUserNames, setAllUserNames] = useState([]);
  useEffect(() => {
    const fetchUserName = async () => {
      const response = await fetch("user/AllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jData = await response.json();

      setAllUserNames(jData?.map((json) => json.userName));
    };
    fetchUserName();
  }, []);
  const [formData, setFormData] = useState({
    FullName: "",
    userName: "",
    email: "",
    password: "",
    picture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "userName"
          ? value.toLowerCase().replace(" ", "_")
          : files
            ? files[0]
            : value,
    });

    console.log(allUserNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., API call)
    console.log("Form Data:", formData);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Sign Up
        </h2>
        <form
          action="http://localhost:8000/user/signUp"
          method="POST"
          encType="multipart/form-data"
        >
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              name="FullName"
              placeholder="Enter your first name"
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              name="FullName"
              placeholder="Enter your last name"
              value={formData.lname}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <h3 className="text-4xl">{formData.FullName} </h3>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <div className="flex border  px-2 rounded-lg border-gray-300">
              <input
                type="text"
                name="userName"
                placeholder="Choose a username"
                value={formData.userName}
                onChange={handleChange}
                required
                className="w-full my-1  py-2 outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <i
                className={`bi bi-exclamation-triangle block my-auto ${allUserNames.includes(formData.userName) ? "text-red-800" : "text-green-500"} `}
              ></i>
            </div>
            {allUserNames.includes(formData.userName) && (
              <p className="text-sm  text-red-800">
                Username already exists, please choose a different one.
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border-0 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Profile Picture
            </label>
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg file:bg-blue-50 file:border-none file:rounded file:px-4 file:py-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>

          <Link to="/login" replace>
            <button
              type="button"
              className="w-full my-5 py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
