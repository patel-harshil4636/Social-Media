import React, { useState } from "react";
import { motion } from "framer-motion";

const OTPVerification = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showOtp, setShowOtp] = useState(false);

  const handleMobileChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleMobileSubmit = async () => {
    if (mobileNumber.length === 10) {
      setShowOtp(true); // Show OTP fields once the mobile number is valid
      console.log(mobileNumber);

      const sendOtp = await fetch(
        "http://localhost:8000/user/sendOtp/" + mobileNumber,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const result = await sendOtp.json();
      console.log(result);
    } else {
      alert("Please enter a valid mobile number");
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/[0-9]/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus on the next input when the current one is filled
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // If backspace is pressed and the current input is empty, move to the previous input
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = () => {
    if (otp.join("").length === 6) {
      alert("OTP Submitted: " + otp.join(""));
    } else {
      alert("Please enter all 6 digits");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-2xl font-semibold text-gray-800 text-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Enter Mobile Number
        </motion.h2>

        <motion.input
          type="text"
          value={mobileNumber}
          disabled={showOtp}
          onChange={handleMobileChange}
          maxLength="10"
          className="w-full  p-3 mb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 text-lg"
          placeholder="Mobile Number"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {!showOtp && (
          <motion.button
            onClick={handleMobileSubmit}
            className="w-full py-3 bg-blue-600 text-white rounded-full text-lg font-semibold mt-4 hover:bg-blue-700 transition-all duration-200 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Get OTP
          </motion.button>
        )}
        {showOtp && (
          <>
            <motion.h3
              className="text-xl font-semibold text-gray-800 text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              Enter OTP
            </motion.h3>

            <div className="flex justify-between mt-4">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl font-medium text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 transition-all duration-300 ease-in-out"
                  placeholder="–"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.3 }}
                />
              ))}
            </div>

            <motion.button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-full text-lg font-semibold mt-6 hover:bg-blue-700 transition-all duration-200 ease-in-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              Submit OTP
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OTPVerification;
