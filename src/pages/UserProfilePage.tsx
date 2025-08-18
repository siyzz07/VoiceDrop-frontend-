import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const UserProfilePage = () => {
  const { isDarkMode } = useTheme();

  const [name, setName] = useState("Shibin Siyad");
  const [gender, setGender] = useState("male");
  const [showImage, setShowImage] = useState(true);
  const [image, setImage] = useState("carr.jpeg"); // default image

  const containerStyles = isDarkMode
    ? "bg-[#1b1818] text-white"
    : "bg-gray-200 text-gray-800";

  const cardStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-100 hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-50";

  const inputStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-200 placeholder-gray-500 border-gray-700 focus:ring-blue-500"
    : "bg-white text-gray-800 placeholder-gray-400 border-gray-300 focus:ring-blue-400";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-10 ${containerStyles}`}>
      <div className={`w-full max-w-md shadow-2xl shadow-black rounded-3xl flex flex-col items-center justify-center p-6 sm:p-8 gap-4 ${cardStyles}`}>
        
        {/* Profile Photo */}
        {showImage && (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
            <img src={image} alt="User" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Show/hide toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showImage}
            onChange={() => setShowImage(!showImage)}
            className="accent-blue-600"
          />
          <label className="text-sm">Show Profile Photo</label>
        </div>

        {/* Upload Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm w-full max-w-xs"
        />

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full h-10 px-3 rounded-md border focus:outline-none ${inputStyles}`}
          placeholder="Enter your name"
        />

        {/* Gender select */}
        {/* <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={`w-full h-10 px-3 rounded-md border focus:outline-none ${inputStyles}`}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select> */}

        {/* Save button */}
        <button className="mt-2 bg-red-950 text-white hover:bg-red-800 transition duration-300 w-full h-10 rounded-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
