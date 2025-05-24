import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Room = () => {
  const { isDarkMode } = useTheme();

  const containerStyles = isDarkMode
    ? "bg-[#1b1818] text-white"
    : "bg-gray-200 text-gray-800";

  const buttonStyles = "bg-gray-700 hover:bg-gray-600";

   const cardStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-100 hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-50";


  const speakers = [
    { name: "Adriana", color: "border-blue-500" },
    { name: "Brad", color: "border-green-500" },
    { name: "Brian", color: "border-purple-500" },
    { name: "Rosy", color: "border-pink-500" },
  ];

  const participants = [
    { name: "Adriana", color: "border-blue-500" },
    { name: "Waheed", color: "border-green-500" },
    { name: "Ivan", color: "border-purple-500" },
    { name: "Adriana", color: "border-blue-500" },
    { name: "Waheed", color: "border-green-500" },
    { name: "Adriana", color: "border-blue-500" },
    { name: "Denis", color: "border-orange-500" },
    { name: "Rayu", color: "border-yellow-500" },
    { name: "Patrick", color: "border-red-500" },
    { name: "Maxim", color: "border-teal-500" },
    { name: "Rosy", color: "border-pink-500" },
    { name: "Denis", color: "border-orange-500" },
    { name: "Rayu", color: "border-yellow-500" },
    { name: "Patrick", color: "border-red-500" },
    { name: "Maxim", color: "border-teal-500" },
    { name: "Rosy", color: "border-pink-500" },
  ];

  return (
    <div
      className={`${containerStyles} min-h-screen font-sans antialiased flex flex-col items-center  `}
    >
      <Navbar />
      <div className="w-full border-t-2 border-amber-500 flex flex-col items-center font-sans antialiased">
        {/* Room Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
          Artificial Intelligence is the Future?
        </h2>

        {/* Speakers Section */}
        <section className="w-full max-w-4xl mb-10 ">
          <h3 className="text-lg font-medium mb-4">Speakers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-4 rounded-lg shadow-lg ${cardStyles} animate-pulse `}
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gray-500 ${speaker.color} border-4 mb-3 `}
                ></div>
                <span className="text-base font-semibold text-center">
                  {speaker.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Participants Section */}
        <section className="w-full max-w-5xl"> 
          <h3 className="text-lg font-medium mb-4">Others in the Room</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 pb-5 gap-6">
            {participants.map((participant, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg shadow-md ${cardStyles}  `}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-500 ${participant.color} border-4 mb-2`}
                ></div>
                <span className="text-sm font-medium text-center">
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="fixed bottom-6 right-6 flex space-x-4">
          <button
            className={`${buttonStyles} flex items-center gap-3 text-gray-900 dark:text-white px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105`}
            aria-label="Raise hand"
          >
            {/* <svg
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M12 5H8v2h4V5zM8 9h4v2H8V9zm0 4h4v2H8v-2zm-6-8h2v10H2V5zm16 0h-2v10h2V5z" />
          </svg> */}
            <motion.span
              className="font-medium inline-block"
              animate={{
                rotate: [0, -20, 20, -20, 0], 
              }}
              transition={{
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut", 
              }}
            >
              🖐️
            </motion.span>
            Raise Hand
          </button>
          <button
            className={`${buttonStyles} flex items-center gap-3 text-gray-900 dark:text-white px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105`}
            aria-label="Leave quietly"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
              />
            </svg>
            <span className="font-medium">Leave Quietly</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
