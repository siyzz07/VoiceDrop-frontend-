import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import { useTheme } from "../context/ThemeContext";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";

const CreateRoomPopup = ({popup}:any) => {
  const { isDarkMode } = useTheme();

  const cardStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-100 shadow-xl"
    : "bg-white text-gray-900 shadow-md";

  const headingStyles = isDarkMode ? "text-white" : "text-gray-900";

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDarkMode ? "#3e3e3e" : "#ffffff",
      color: isDarkMode ? "#f5f5f5" : "#000",
      "& fieldset": {
        borderColor: isDarkMode ? "#707070" : "#cfcfcf",
      },
      "&:hover fieldset": {
        borderColor: isDarkMode ? "#a1a1a1" : "#000",
      },
      "&.Mui-focused fieldset": {
        borderColor: isDarkMode ? "#ffffff" : "#000",
      },
    },
    "& .MuiInputLabel-root": {
      color: isDarkMode ? "#cfcfcf" : "#707070",
    },
    "& .Mui-focused": {
      color: isDarkMode ? "#ffffff" : "#000",
    },
  };

  const buttonStyles = isDarkMode
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-blue-500 text-white hover:bg-blue-600";

 
  const formik = useFormik({
    initialValues: {
      topic: "",
      roomType: "open",
    },
    validationSchema: Yup.object({
      topic: Yup.string()
        .min(3, "Topic must be at least 3 characters long")
        .required("Topic is required"),
      roomType: Yup.string().required("Room type is required"),
    }),
    onSubmit: (values) => {
      
    },
  });

  return (
    <div>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <div
              className={`relative transform overflow-hidden rounded-2xl ${cardStyles} w-full max-w-lg`}
            >
              <form onSubmit={formik.handleSubmit}>
                <div className="px-6 pt-6 pb-8">
                  {/* Heading */}
                  <div className="flex justify-between items-center">
                    <h2
                      className={`text-2xl md:text-3xl font-semibold mb-6 ${headingStyles}`}
                    >
                      Create a Room
                    </h2>
                    <p
                      className="text-xl pb-5 cursor-pointer hover:text-red-600"
                      aria-label="Close modal"
                      onClick={popup()}
                      // Add close function here
                    >
                      X
                    </p>
                  </div>

                  {/* Input for Topic */}
                  <TextField
                    fullWidth
                    label="Enter the topic to be discussed"
                    variant="outlined"
                    className="mb-6"
                    sx={inputStyles}
                    name="topic"
                    value={formik.values.topic}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.topic && Boolean(formik.errors.topic)}
                    helperText={formik.touched.topic && formik.errors.topic}
                  />

                  {/* Room Type */}
                  <FormControl component="fieldset">
                    <h3 className="text-lg font-semibold mb-2">Room Type</h3>
                    <RadioGroup
                      row
                      name="roomType"
                      value={formik.values.roomType}
                      onChange={formik.handleChange}
                      className="flex flex-wrap"
                    >
                      <FormControlLabel
                        value="open"
                        control={<Radio />}
                        label={
                          <span className="flex items-center">
                            <GroupIcon className="mr-2" />
                            Open
                          </span>
                        }
                      />
                      <FormControlLabel
                        value="private"
                        control={<Radio />}
                        label={
                          <span className="flex items-center">
                            <LockIcon className="mr-2" />
                            Private
                          </span>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {/* Create Button */}
                  <div className="mt-6 flex justify-center sm:justify-end">
                    <Button
                      type="submit"
                      variant="contained"
                      className={`rounded-lg px-6 py-2 font-semibold ${buttonStyles}`}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPopup;
