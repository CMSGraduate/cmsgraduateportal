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

export const API_ANNOUNCE = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

const getAnnouncements = async () => {
  let token = getToken();
  try {
    const res = await API_ANNOUNCE.get("/announcements", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    return error.response;
  }
};
const sendAnnouncements = async (data) => {
  let token = getToken();
  try {
    const res = await API_ANNOUNCE.post("/announcements/send", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};
const updateAnnouncements = async (id, data) => {
  let token = getToken();
  try {
    const res = await API_ANNOUNCE.patch(`/announcements/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const deleteAnnouncements = async (id) => {
  let token = getToken();
  try {
    const res = await API_ANNOUNCE.delete(`announcements/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const announcementService = {
  getAnnouncements,
  deleteAnnouncements,
  sendAnnouncements,
  updateAnnouncements,
};

export default announcementService;
