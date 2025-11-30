import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { roomIn } from "../redux/RoomSlice";
import { useTheme } from "../context/ThemeContext";

const RoomPassword = ({ popup, password, roomId }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const formik = useFormik({
    initialValues: {
      roomPassword: "",
    },
    validationSchema: Yup.object({
      roomPassword: Yup.string()
        .oneOf([password], "Password is incorrect")
        .min(3, "Password must be at least 3 characters long")
        .required("Required"),
    }),

    onSubmit: async (values) => {
      if (values.roomPassword == password) {
        popup();
        dispatch(roomIn(roomId));
        navigate(`/room/${roomId}`);
      }
    },
  });


  const modalBg = isDarkMode
    ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-950 text-white border border-gray-700"
    : "bg-white text-black border border-gray-200";

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isDarkMode ? "#555" : "#ccc",
      },
      "&:hover fieldset": {
        borderColor: isDarkMode ? "#888" : "#000",
      },
    },
    "& .MuiInputBase-input": {
      color: isDarkMode ? "#fff" : "#000",
    },
    "& .MuiInputLabel-root": {
      color: isDarkMode ? "#ccc" : "#555",
    },
  };

  return (
    <div className="relative z-[1000]" aria-modal="true">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">

          {/* MODAL */}
          <div
            className={`relative transform overflow-hidden rounded-2xl shadow-xl w-full max-w-lg p-6 ${modalBg}`}
          >
            <form onSubmit={formik.handleSubmit}>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold">Room Key</h2>

                <p
                  className="text-xl cursor-pointer hover:text-red-500"
                  onClick={popup}
                >
                  X
                </p>
              </div>

              {/* Input */}
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
                  formik.touched.roomPassword &&
                  formik.errors.roomPassword
                }
                sx={textFieldStyles}
              />

              {/* Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: isDarkMode ? "#2563eb" : "#1976d2",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#1e4ecf" : "#1156b5",
                    },
                    paddingX: "24px",
                    paddingY: "10px",
                    borderRadius: "8px",
                  }}
                >
                  Enter
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomPassword;
