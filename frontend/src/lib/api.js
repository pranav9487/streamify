import { axiosInstance } from "./axios.js";

export const signup = async(signupData)=>{
      const response = await axiosInstance.post("/auth/signup",signupData)
      return response.data;
}
export const login = async(loginData)=>{
      const response = await axiosInstance.post("/auth/login",loginData)
      return response.data;
}
export const logout = async()=>{
      const response = await axiosInstance.post("/auth/logout")
      return response.data;
}

export const getAuthUser = async ()=>{
      try {
           const res = await axiosInstance.get("/auth/me");
       return res.data 
      } catch (error) {
            console.log("Error in getAuthUser frontend:",error.message)
            return null;
      }
      
    }
export const completeOnboarding = async (userData)=>{
      const response = await axiosInstance.post("auth/onboarding",userData)
      return response.data
}
export async function getUserFriends () {
  const response = await axiosInstance.get("/users/friends")
      return response.data;
}
export async function getRecommendedUsers () {
  const response = await axiosInstance.get("/users")
      return response.data;
}
export async function getOutGoingFriendReqs () {
  const response = await axiosInstance.get("/users/outgoing-friend-requests")
      return response.data;
}
export async function sendFriendRequest(params) {
    const response =   await axiosInstance.post(`/users/friend-request/${params}`);
    return response.data;
}
export async function getFriendRequest() {
      const response  = await axiosInstance.get("/users/friend-requests");
      return response.data
}
export async function acceptFriendRequest(requestId) {
      const response  = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
      return response.data
}
export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token");
     return response.data
}

export async function getUserByName(query) {
      const responce = await axiosInstance.get(`/users/searchByName?q=${query}`)
      return responce.data;
}