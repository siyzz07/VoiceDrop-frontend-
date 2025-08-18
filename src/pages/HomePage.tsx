import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { MdRecordVoiceOver } from "react-icons/md";
import CreateRoomPopup from "../components/CreateRoomPopup";
import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import FloatingRoom from "../components/FloatingRoom";
import socket from "../config/Socket";
import { useNavigate } from "react-router-dom";
import { number } from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { roomIn } from "../redux/RoomSlice";
import RoomPassword from "../components/RoomPassword";

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [createRoom, setCreateRoom] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<any>([]);
  const [filter, setFilter] = useState<any>([]);
  const [roomPassword, setRoomPassword] = useState<boolean>(false);
  const [password,setPassword] = useState('')
  const [IDroom,setIDRoom] = useState('')

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("dddd");
  useEffect(() => {
    socket.emit("get_data");

    socket.on("room_data", (data) => {
      setRoomData(data);
      setFilter(data);
    });

    socket.on("data-updated", (data) => {
      setRoomData(data);
      setFilter(data);
    });

    return () => {
      socket.off("room_data");
      socket.off("data-updated");
    };
  }, []);

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const result = roomData.filter((val: any) =>
      val.topic.toLowerCase().includes(value.toLowerCase())
    );

    setFilter(result);
  };

  // useEffect(() => {
  //   console.log("Updated filter:", filter);
  // }, [filter]);

  const containerStyles = isDarkMode
    ? "bg-[#1b1818] text-white"
    : "bg-gray-200  00 text-gray-800";

  const cardStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-100 hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-50";

  const inputStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-200 placeholder-gray-500 border-gray-700 focus:ring-blue-500"
    : "bg-white text-gray-800 placeholder-gray-400 border-gray-300 focus:ring-blue-400";

  //------------------------ fetch popup data ----------------------

  //  function deletRoom(){

  //  }

  const roomEnter = (roomId: any, roomType: any,passwordRoom:any) => {
    if (roomType == "Private") {
          setPassword(passwordRoom)
          setRoomPassword(true)
          setIDRoom(roomId)
    } else {
      dispatch(roomIn(roomId));
      navigate(`/room/${roomId}`);
    }
  };

  const closePopup = () => {
    setRoomPassword(false);
  };

   const closeRoomPopup = () => {
    setRoomPassword(false);
  };


  return (
    <div>
      <div
        className={`${containerStyles} min-h-screen relative overflow-hidden font-sans antialiased`}
      >
        {createRoom && <CreateRoomPopup popup={closePopup} />}
        {roomPassword && <RoomPassword popup={closeRoomPopup} password={password} roomId={IDroom}/>}
        <Navbar />
        {/* <FloatingRoom/> */}
        <header
          className={`flex flex-col border-t-2 border-t-gray-500 sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-6 ${containerStyles}`}
        >
          <div className="relative w-full sm:w-96 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search voice rooms..."
              onChange={search}
              className={`w-full p-3 pl-10 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${inputStyles}`}
              aria-label="Search voice rooms"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              aria-label="Open chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7 4a9 9 0 100-18 9 9 0 000 18z"
                />
              </svg>
              <span className="font-medium">Chat</span>
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 flex items-center text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              aria-label="Start a new voice room"
              onClick={() => setCreateRoom(true)}
            >
              <MdRecordVoiceOver className="mr-2 text-xl" />
              <span className="font-medium">Start a Room</span>
            </button>
          </div>
        </header>
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 py-6">
          {filter.map((room: any, index: any) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-[999] ${cardStyles}`}
              role="button"
              tabIndex={0}
              aria-label={`Join room: ${room.topic}`}
              onClick={() => roomEnter(room.roomId, room.type,room?.password)}
              // onClick={()=>navigate(`/room/${room.roomId}`)}
            >
              <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                {room.topic}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {/* {room.hosts.map((host:any, idx:any) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full ${host.color} ring-2 ring-gray-600 mr-2`}
                  ></div>
                  <span className="text-sm font-medium">{host.name}</span>
                </div>
              ))} */}
              </div>
              <div className="flex items-center justify-between text-gray-400 w-full">
                {/* Left side: participants */}
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {room.participants.length} participants
                  </span>
                </div>

                {/* Right side: lock */}
                { room.type == "Private" &&
                  <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v2H5a2 2 0 
         00-2 2v6a2 2 0 
         002 2h10a2 2 0 002-2v-6a2 2 0 
         00-2-2h-1V6a4 4 0 00-4-4zm-2 
         6V6a2 2 0 114 0v2H8z"
                    clipRule="evenodd"
                  />
                </svg>
                }
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
