// import { API } from "./auth";
import axios from "axios";
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  if (user) {
    var { token } = user;
    console.log(token);
    return token;
  }
};

export const API_COURSE = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

const getMSCourses = async (level) => {
  let token = getToken();
  console.log("in MS APIS")
  try {
    const res = await API_COURSE.get("/courses/getMScourses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("courses",res);
    return res;
  } catch (error) {
    return error.response;
  }
};

const getPHDCourses = async (level) => {
    console.log("in PHD APIS")

    let token = getToken();
    try {
        const res = await API_COURSE.get("/courses/getPHDcourses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("courses",res);
        return res;
      } catch (error) {
        return error.response;
      }
  };

const courseService = {
    getMSCourses,
    getPHDCourses
};
export default courseService;
