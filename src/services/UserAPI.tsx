import API from "../config/AxiosConfig"


export  const phoneVerify=async(form:any):Promise<any>=>{


    const response=await API.post('/verify',form)
}



// ---------------------------------------email varify
export  const emailVerify=async(form:any):Promise<any>=>{
    const response=await API.post('/emailverify',form)
    return response.data
}

//-----------------------------------------check user otp
export const checkOtp=async(email:any,otp:any):Promise<any>=>{
     const values={email,otp}    
        const response=await API.post('/checkOtp',values)
        return response.data
}

//---------------------------------------------------- register user
export const saveUser=async(values:any,email:any):Promise<any>=>{
    const datas={...values,email}
    const response=await API.post('/registerUser',datas)
   return response.data
    
}

//------------------------------------------- login 
export const loginUser=async(values:object):Promise<any>=>{
 
    const response=await API.post('/loginUser',values)
    return response.data
}







/////--------------------------------------------------- create a room
export const createRoom=async(values:object,headers:any):Promise<any>=>{
        const response=await API.post('/createRoom',values,headers)
        return response
}

//------------------------------------------------------ check room exitst
export const roomExist= async (roomId:any):Promise<any>=>{
    const response=await API.get(`checkRoom/${roomId}`)
    return response
}


// async function checkRoomExist() {
//     try {
//       const response = await roomExist(roomId);
//       console.log(response?.data?.check);
      
//       if(response?.data?.check!==true){
//         navigate('/home')
//       }else{
//         handleJoinRoom ()
//       }
      
//     } catch (error: any) {
//       console.log("error section");
//       console.log(error.message);
//     }
//   }