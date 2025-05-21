import axiosInstance from "@/lib/axiosInstence";

interface signupPayload {
    name: string,
    email: string,
    password: string
}
interface signINPayload {
    email: string,
    password: string
}
const signupUser = async (data: signupPayload) =>{
    const res = await axiosInstance.post('/signup',data);
    
    return res.data
}

const signinUser = async (data: signINPayload) =>{
    const res = await axiosInstance.post('/signin',data)
    return res.data
}

export { signupUser , signinUser}