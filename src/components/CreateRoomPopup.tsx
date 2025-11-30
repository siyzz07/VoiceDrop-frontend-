import { useFormik } from "formik";
import * as Yup from "yup";
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
import { useDispatch } from "react-redux";
import { roomIn } from "../redux/RoomSlice";
import { useTheme } from "../context/ThemeContext";

const CreateRoomPopup = ({ popup }: any) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      topic: "",
      roomType: "Open",
    },
    validationSchema: Yup.object({
      topic: Yup.string()
        .min(3, "Topic must be at least 3 characters long")
        .max(30, "Topic can only include less than 30 characters")
        .required("Topic is required"),
      roomType: Yup.string().required("Room type is required"),
    }),

    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");

        const response = await createRoom(values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response) {
          popup();
          dispatch(roomIn(response.data.roomId));
          navigate(`/room/${response.data.roomId}`);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="relative z-10" aria-modal="true">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">

          <div
            className={`relative transform overflow-hidden rounded-2xl shadow-xl w-full max-w-lg transition-all 
            ${isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-via-gray-800 to-gray-900 text-white"
              : "bg-white text-black"
            }`}
          >
            <form onSubmit={formik.handleSubmit}>
              <div className="px-6 pt-6 pb-8">

                {/* Heading */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                    Create a Room
                  </h2>
                  <p
                    className="text-xl pb-5 cursor-pointer hover:text-red-400"
                    onClick={popup}
                  >
                    X
                  </p>
                </div>

                {/* Topic */}
                <TextField
                  fullWidth
                  label="Enter the topic to be discussed"
                  variant="outlined"
                  name="topic"
                  value={formik.values.topic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.topic && Boolean(formik.errors.topic)}
                  helperText={formik.touched.topic && formik.errors.topic}
                  InputLabelProps={{
                    style: { color: isDarkMode ? "#bbb" : "#000" },
                  }}
                  InputProps={{
                    style: {
                      color: isDarkMode ? "#fff" : "#000",
                      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                    },
                  }}
                />

                {/* Room Type */}
                <FormControl className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Room Type
                  </h3>

                  <RadioGroup
                    row
                    name="roomType"
                    value={formik.values.roomType}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="Open"
                      control={
                        <Radio
                          sx={{
                            color: isDarkMode ? "#fff" : "#000",
                          }}
                        />
                      }
                      label={
                        <span className="flex items-center">
                          <GroupIcon className="mr-2" />
                          Open
                        </span>
                      }
                    />

                    <FormControlLabel
                      value="Private"
                      control={
                        <Radio
                          sx={{
                            color: isDarkMode ? "#fff" : "#000",
                          }}
                        />
                      }
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
                <div className="mt-8 flex justify-center sm:justify-end">
                  <Button
                    type="submit"
                    variant="contained"
                    className="rounded-lg px-6 py-2 font-semibold"
                    style={{
                      backgroundColor: isDarkMode ? "#2563eb" : "#1976d2",
                      color: "#fff",
                    }}
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
  );
};

export default CreateRoomPopup;
