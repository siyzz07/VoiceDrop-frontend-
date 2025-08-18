import { configureStore } from "@reduxjs/toolkit";
import authSlice from './Slice'
import RoomSlice from "./RoomSlice";


const store=configureStore({
    reducer:{
        auth:authSlice,
        roomCheck:RoomSlice
    }
})

export default store