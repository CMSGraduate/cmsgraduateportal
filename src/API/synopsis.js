import axios from "axios";
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    var { token } = user;
    console.log(token);
    return token;
  }
};

export const API_SYNOPSIS = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

const submitSynopsis = async (data) => {
  let token = getToken();
  try {
    console.log(data + "apisubmit");
    const res = await API_SYNOPSIS.post("synopsis/submit-synopsis", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

const submitRebuttal = async (data) => {
  let token = getToken();
  try {
    console.log(data + "apisubmitrebuttal");
    const res = await API_SYNOPSIS.post("synopsis/submit-rebuttal", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("resbdiu",res);
    return res;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};
const submitThesis = async (data) => {
  let token = getToken();
  try {
    console.log(data + "thesisApiSubmit");
    const res = await API_SYNOPSIS.post("synopsis/submit-thesis", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

const createSchedule = async (data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.post("synopsis/add-synopsisSchedule", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const updateSchedule = async (id, data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.patch(
      `synopsis/update-synopsisSchedule/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

const deleteSchedule = async (id) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.delete(
      `synopsis/delete-synopsisSchedule/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

const addEvaluation = async (data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.post("synopsis/add-evaluation", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const updateGoEvaluation = async (data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.patch("synopsis/add-evaluation-go", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};
const updateSynopsisStatus = async (data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.put(
      "synopsis/update-synopsis-status",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

const getSubmittedSynopsis = async () => {
  let token = getToken();
  try {
    const { data } = await API_SYNOPSIS.get("synopsis/submitted-synopsis", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getSynopsisSchedules = async () => {
  let token = getToken();
  try {
    const { data } = await API_SYNOPSIS.get("synopsis/synopsis-schedule", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getSynopsisEvaluations = async () => {
  let token = getToken();
  try {
    const { data } = await API_SYNOPSIS.get("synopsis/synopsis-evaluation", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getSingleSynopsisEvaluations = async (id) => {
  let token = getToken();
  try {
    const { data } = await API_SYNOPSIS.get("synopsis/student-evaluation/"+id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const createDeadline = async (data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.post("synopsis/add-deadline", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const getDeadlines = async () => {
  let token = getToken();
  try {
    const { data } = await API_SYNOPSIS.get("synopsis/get-deadlines", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateDeadline = async (id, data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.patch(
      `synopsis/update-deadline/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

const deleteDeadline = async (id) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.delete(`synopsis/delete-deadline/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const checkSubmission = async (id) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.get(`synopsis/student-synopsis-submission/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("inchecksubmission",res)
    return res;
  } catch (error) {
    return error.response;
  }
};

const getRebuttal = async () => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.get(`synopsis/student-rebuttals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("inchecksubmission",res)
    return res;
  } catch (error) {
    return error.response;
  }
};
const verifyRebuttal = async (id,data) => {
  let token = getToken();
  try {
    const res = await API_SYNOPSIS.put(`synopsis/student-verify-rebuttals/`+id,{"data":data}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("inchecksubmission",res)
    return res;
  } catch (error) {
    return error.response;
  }
};


const synopsisService = {
  verifyRebuttal,
  checkSubmission,
  submitThesis,
  submitSynopsis,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSubmittedSynopsis,
  getSynopsisSchedules,
  addEvaluation,
  updateGoEvaluation,
  getSynopsisEvaluations,  
  getSingleSynopsisEvaluations,
  updateSynopsisStatus,
  createDeadline,
  getDeadlines,
  updateDeadline,
  deleteDeadline,
  submitRebuttal, 
  getRebuttal
};

export default synopsisService;
