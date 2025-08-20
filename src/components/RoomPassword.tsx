import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { roomIn } from "../redux/RoomSlice";

const RoomPassword = ({ popup, password, roomId }: any) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      roomPassword: "",
    },
    validationSchema: Yup.object({
      roomPassword: Yup.string()
        .oneOf([password], "Password is incorrect")
        .min(3, "roomPassword must be at least 3 characters long")
        .required("required"),
    }),

    //----------------------------------create room------------

    onSubmit: async (values) => {
      if (values.roomPassword == password) {
        popup();
        dispatch(roomIn(roomId));
        navigate(`/room/${roomId}`);
      }
    },
  });

  return (
    <div>
      <div
        className="relative z-[1000]"
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
            <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl w-full max-w-lg">
              <form onSubmit={formik.handleSubmit}>
                <div className="px-6 pt-6 pb-8">
                  {/* Heading */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-black">
                      Room Key
                    </h2>
                    <p
                      className="text-xl pb-5 cursor-pointer hover:text-red-600 text-black"
                      aria-label="Close modal"
                      onClick={popup}
                    >
                      X
                    </p>
                  </div>

                  {/* Input for roomPassword */}
                  <TextField
                    fullWidth
                    label="Enter room key"
                    variant="outlined"
                    className="mb-6"
                    name="roomPassword"
                    value={formik.values.roomPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.roomPassword &&
                      Boolean(formik.errors.roomPassword)
                    }
                    helperText={
                      formik.touched.roomPassword && formik.errors.roomPassword
                    }
                  />

                  {/* Room Type */}

                  {/* Create Button */}
                  <div className="mt-6 flex justify-center sm:justify-end">
                    <Button
                      type="submit"
                      variant="contained"
                      className="rounded-lg px-6 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Enter
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

export default RoomPassword;
