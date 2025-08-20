

import  { createSlice } from '@reduxjs/toolkit'


const inRoom = localStorage.getItem("roomIn") == "true"


type iniRoomState  = {
    inRoom:any;
    roomId?:any
}

let initialState: iniRoomState = {
  inRoom: inRoom || false,
  roomId: localStorage.getItem("roomId") || "" 
}
const RoomCheck = createSlice({
  name: "roomCheck",
  initialState,
  reducers: {
    roomIn: (state, action) => {
      state.inRoom = true;
      state.roomId = action.payload;
      localStorage.setItem("roomIn", "true");     
      localStorage.setItem("roomId", action.payload);
    },
    roomOut: (state) => {
      state.inRoom = false;
      state.roomId = "";
      localStorage.removeItem("roomIn");          
      localStorage.removeItem("roomId");
    }
  }
});

export const {roomIn,roomOut} = RoomCheck.actions
export default RoomCheck.reducer