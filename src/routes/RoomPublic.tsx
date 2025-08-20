import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

const RoomPublic = ({ children }: { children: React.ReactNode }) => {
  const inRoom = useSelector((state: any) => state.roomCheck.inRoom);
//   const { roomId } = useParams(); 
// const { roomId }: any = useParams<{ roomId: string }>();
  const roomId = useSelector((state:any)=>state.roomCheck.roomId)
  
  
  if (inRoom == true) {
    
    return <Navigate to={`/room/${roomId}`} />
    
}

return children
 
};

export default RoomPublic;
