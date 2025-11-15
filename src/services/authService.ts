import axiosInstance from "@/lib/axiosInstence";

interface signupPayload {
  name: string;
  email: string;
  password: string;
}
interface signINPayload {
  email: string;
  password: string;
}
const signupUser = async (data: signupPayload) => {
  const res = await axiosInstance.post("/signup", data);
  // console.log(res)
  localStorage.setItem("token", res.data.token);
  return res.data;
};

const signinUser = async (data: signINPayload) => {
  const res = await axiosInstance.post("/signin", data);
  localStorage.setItem("token", res.data.token);
  // console.log(res)
  return res.data;
};

const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user-store");
};

export { signupUser, signinUser, logoutUser };
