import React, { useContext, useEffect, useState } from "react";
import { Background } from "../Contexts/sm";

const FileUploadForm = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const {isProfileUpdated,setIsProfileUpdated }=useContext(Background)
  const [isTaskComplete, setIsTaskComplete] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError("File size should be less than 5MB.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/user/updateProfile/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload the file.");
      }

      const result = await response.json();
      console.log("Response from server:", result);

      setIsTaskComplete(true);
      alert("File uploaded successfully!");

      // Notify the parent component about the upload
      if (props.onUploadComplete) {
        props.onUploadComplete(result);
      }

      // Reset the state
      setSelectedFile(null);
      setError("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred while uploading the file. Please try again.");
    }
    setIsProfileUpdated(!isProfileUpdated)

  };

  return (
    <div
      className={
        (props.className || "") +
        " flex w-max justify-center items-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
      }
    >
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Upload Your File
        </h1>

        <div className="mb-4">
          <label
            htmlFor="fileUpload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select a file (Max: 5MB)
          </label>
          <input
            type="file"
            id="fileUpload"
            name="updatedFile"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        {selectedFile && (
          <div className="mb-4 text-sm text-gray-700">
            Selected File:{" "}
            <span className="font-medium text-purple-600">
              {selectedFile.name}
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUploadForm;
