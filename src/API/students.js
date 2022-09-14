// import { API } from "./auth";
import { getListItemSecondaryActionClassesUtilityClass } from "@mui/material";
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

export const API_STUD = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

const getStudents = async () => {
  let token = getToken();
  try {
    const { data } = await API_STUD.get("/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteStudent = async (id) => {
  // console.log(data);
  let token = getToken();
  try {
    const res = await API_STUD.delete(`students/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.message;
  }
};

const getSupervisors = async () => {
  let token = getToken();
  try {
    const { data } = await API_STUD.get("/students/supervisors", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getSpecificSupervisor = async (supervisor_id) => {
  let token = getToken();
  try {
    const { data } = await API_STUD.get(
      `/students/supervisors/${supervisor_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (formData) => {
  let token = getToken();
  try {
    const { data } = await API_STUD.patch(`/students`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const uploadFile = (data) => {
  console.log(data);
  API_STUD.post("/upload", data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const verifiedData= async(id,user) => {
  let token = getToken();
  var a;
  console.log("hekki",id)
   await API_STUD.post("/students/verify/"+id,user,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      console.log("dytgfj",res.data.res);
      a=res.data.res
      return res.data.response;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
    console.log("ayee",a)
    return a;
};


const updateResult= async(id,data) => {
  let token = getToken();
  var a;
  console.log(data)
  console.log("hekki",id)
   await API_STUD.put("/students/Result/"+id,data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      console.log("dytgfj",res.data.response);
      a=res.data.response
      return res.data.response;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
    console.log("ayee",a)
    return a;
};


const studentService = {
  updateResult,
  verifiedData,
  uploadFile,
  getSupervisors,
  updateProfile,
  getStudents,
  deleteStudent,
  getSpecificSupervisor,
};

export default studentService;
