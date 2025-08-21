import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoomProtect = ({ children }: { children: React.ReactNode }) => {
  const inRoom = useSelector((state: any) => state.roomCheck.inRoom);
//   const { roomId } = useParams(); 
// const { roomId }: any = useParams<{ roomId: string }>();
  // const roomId = useSelector((state:any)=>state.roomCheck.roomId)

  
  if (inRoom == false) {
    
    return <Navigate to='/home' />
    
}

return children
 
};

export default RoomProtect;
