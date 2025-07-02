import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import { createRoom } from "../services/UserAPI";
import { useNavigate } from "react-router-dom";

const CreateRoomPopup = ({ popup }:any) => {
  const navigate=useNavigate()
  const formik = useFormik({
    initialValues: {
      topic: "",
      roomType: "Open",
    },
    validationSchema: Yup.object({
      topic: Yup.string()
        .min(3, "Topic must be at least 3 characters long")
        .required("Topic is required"),
      roomType: Yup.string().required("Room type is required"),
    }),




    //----------------------------------create room------------

    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const response = await createRoom(values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) {
          popup(); 
          navigate(`/room/${response.data.roomId}`)

        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div>
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl w-full max-w-lg">
              <form onSubmit={formik.handleSubmit}>
                <div className="px-6 pt-6 pb-8">
                  {/* Heading */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">Create a Room</h2>
                    <p
                      className="text-xl pb-5 cursor-pointer hover:text-red-600"
                      aria-label="Close modal"
                      onClick={popup} 
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
                    >
                      <FormControlLabel
                        value="Open"
                        control={<Radio />}
                        label={
                          <span className="flex items-center">
                            <GroupIcon className="mr-2" />
                            Open
                          </span>
                        }
                      />
                      <FormControlLabel
                        value="Private"
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
                    <Button type="submit" variant="contained" className="rounded-lg px-6 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600">
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
