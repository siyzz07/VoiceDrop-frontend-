import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";

// Custom styled Material-UI Switch
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const UserInfo = ({ user, onNameClick }: any) => (
  <div className="flex items-center space-x-3 relative">
    <img
      src={user.profilePicture}
      alt={`${user.name}'s profile`}
      className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
    />
    <span
      onClick={onNameClick}
      className="font-semibold text-lg cursor-pointer hover:underline"
    >
      {user.name}
    </span>
  </div>
);

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = {
    name: "John Doeyyyyyyy",
    profilePicture: "https://via.placeholder.com/150",
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleNameClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`w-full px-4 py-2 flex justify-between items-center ${
        isDarkMode ? "bg-[#1b1818] text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h1 className="text-2xl font-bold">Voice Drop</h1>

      <div className="flex items-center space-x-4 relative">
        <UserInfo user={user} onNameClick={handleNameClick} />

        {menuOpen && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper className="absolute top-16 right-0 z-50 shadow-lg">
              <MenuList>
                <MenuItem onClick={() => console.log("View Profile clicked")}>
                  View Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "red", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1,
                  }}
                >
                  <LogoutIcon sx={{ color: "red" }} />{" "}
                  {/* Set icon color to red */}
                  Logout
                </MenuItem>
              </MenuList>
            </Paper>
          </ClickAwayListener>
        )}

        <FormControlLabel
          control={
            <MaterialUISwitch
              checked={isDarkMode}
              onChange={toggleTheme}
              sx={{ m: 1 }}
            />
          }
          label=""
        />
      </div>
    </nav>
  );
};

export default Navbar;


//  <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>