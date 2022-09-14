import axios from "axios";
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    var { token } = user;
    console.log(token);
    return token;
  }
};

export const API_THESIS = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

/* const submitThesis = async (data) => {
  let token = getToken();
  try {
    console.log(data + "thesisApiSubmit");
    const res = await API_THESIS.post("thesis/submit-thesis", data, {
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
}; */

const createSchedule = async (data) => {
  let token = getToken();
  try {
    const res = await API_THESIS.post("thesis/add-thesisSchedule", data, {
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
    const res = await API_THESIS.patch(
      `thesis/update-thesisSchedule/${id}`,
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
    const res = await API_THESIS.delete(`thesis/delete-thesisSchedule/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const addEvaluation = async (data) => {
  let token = getToken();
  try {
    const res = await API_THESIS.post("thesis/add-evaluation", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const updateEvaluation = async (data) => {
  let token = getToken();
  try {
    const res = await API_THESIS.patch("thesis/update-evaluation", data, {
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
    const res = await API_THESIS.patch("thesis/add-evaluation-go", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};
const updateThesisStatus = async (data) => {
  let token = getToken();
  try {
    const res = await API_THESIS.put("thesis/update-thesis-status", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const getSubmittedThesis = async () => {
  let token = getToken();
  try {
    const { data } = await API_THESIS.get("thesis/submitted-thesis", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getThesisSchedules = async () => {
  let token = getToken();
  try {
    const { data } = await API_THESIS.get("thesis/thesis-schedule", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getThesisEvaluations = async () => {
  let token = getToken();
  try {
    const { data } = await API_THESIS.get("thesis/thesis-evaluation", {
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
    const res = await API_THESIS.post("thesis/add-deadline", data, {
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
    const { data } = await API_THESIS.get("thesis/get-deadlines", {
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
    const res = await API_THESIS.patch(`thesis/update-deadline/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const deleteDeadline = async (id) => {
  let token = getToken();
  try {
    const res = await API_THESIS.delete(`thesis/delete-deadline/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const thesisService = {
  // submitThesis,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getThesisSchedules,
  getSubmittedThesis,
  addEvaluation,
  updateGoEvaluation,
  updateEvaluation,
  getThesisEvaluations,
  updateThesisStatus,
  createDeadline,
  getDeadlines,
  updateDeadline,
  deleteDeadline,
};

export default thesisService;
