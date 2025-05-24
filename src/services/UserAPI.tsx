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
export const createRoom=async(values:object):Promise<any>=>{

}