import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from 'axios'
import synopsisService from "../../API/synopsis";
import Modal from "@mui/material/Modal";


import {
  Autocomplete,
  CircularProgress,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BackdropModal from "../UI/BackdropModal";
import { SignalWifiStatusbarConnectedNoInternet4Sharp } from "@mui/icons-material";
const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  borderRadius: "6px",
  boxShadow: 24,
  p: 3,
};
export default function EvaluateSynopsisMS({}) {
  let navigate = useNavigate();
  const { currentRole } = useSelector((state) => state.userRoles);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [notification,setnotification]=useState()
  const [hasEvaluatedSynopsis, setHasEvaluatedSynopsis] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedSynopsis, setSelectedSynopsis] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [submittedSynopsis, setSubmittedSynopsis] = useState({});
  const [data, setData] = useState({});
  const [scheduleLabels, setScheduleLabels] = useState([]);
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);


  const uniqueScheduleLabels = async (array) => {
    const labels = [
      ...new Set(
        await array.map((item) => {
          return item?.student_id?.registrationNo;
        })
      ),
    ];
    setScheduleLabels(labels);
  };

  // useEffect(() => {
  //   console.log(location.state.data.registrationNo);
  //   async function fetchData() {
  //     const schd = await synopsisService.getSynopsisSchedules();
  //     // isme se student ka data chaiye humein
  //     const alreadysubmittedSynopsis =
  //       await synopsisService.getSubmittedSynopsis();
  //     // us student ke synosses se related chezain

  //     let filteredMsSchedules = schd.filter((msSchedule) =>
  //       msSchedule.program_id.programShortName.toLowerCase().includes("ms")
  //     );

  //     // console.log(filteredMsSchedules);
  //     setSchedules(filteredMsSchedules);
  //     uniqueScheduleLabels(filteredMsSchedules);

  //     // setEvaluations(alreadyevaluatedSynopsis);
  //     setSubmittedSynopsis(alreadysubmittedSynopsis);

  //     setLoading(false);
  //   }
  //   fetchData();
  // }, []);

  // console.log(schedules);
  // console.log(evaluations);
  // console.log(submittedSynopsis);

  // const handleRegistrationNo = (reg) => {
  //   setHasEvaluatedSynopsis(false);

  //   schedules.forEach((oneSchedule) => {
  //     if (reg === oneSchedule?.student_id?.registrationNo) {
  //       evaluations.forEach((evaluatedSynopsis) => {
  //         if (evaluatedSynopsis.schedule_id) {
  //           if (evaluatedSynopsis.schedule_id._id === oneSchedule._id) {
  //             if (evaluatedSynopsis.evaluator_id._id === user.user._id) {
  //               console.log(true);
  //               setHasEvaluatedSynopsis(true);
  //             }
  //           }
  //         }
  //       });

  //       setSelectedSchedule(oneSchedule);

  //       console.log("Selected Schedule", selectedSchedule);
  //       setData({ ...data, schedule_id: oneSchedule._id });

  //       submittedSynopsis.forEach((oneSynopsis) => {
  //         if (
  //           selectedSchedule.student_id?._id ===
  //           submittedSynopsis.student_id?._id
  //         ) {
  //           console.log("Selected Synopsis", oneSynopsis);
  //           setSelectedSynopsis(oneSynopsis);
  //         }
  //       });
  //     }
  //   });
  // };
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };
  const handleSubmit2 = async () => {
    let token = getToken();
    // alert("Submitted");
    try {
      console.log("location",location.state.data._id)
      const res = await axios.post(
        `http://localhost:3000/Notification/send-to-/${location.state.data._id}`,
        {
          notification,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      if (res.status === 201) {
        
          setShowEvaluateModal(true);
          navigate("/Dashboard/viewSynopsisReport", {
            state: { data: location.state.data.registrationNo },
          });
        
      }
    } catch (error) {
      if (error.response.status === 500) {
        setShowErrorModal(true);
      }
    }
  };
  const handleChange = (event) => {
   
    setData({ ...data, [event.target.name]: event.target.value });
    console.log(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (currentRole !== "GO") {
      try {
        const res = await synopsisService.addEvaluation(data);

        console.log(res);

        if (res.status === 200) {
          setShowEvaluateModal(true);
        }
      } catch (error) {
        if (error.response.status === 500) {
          setShowErrorModal(true);
        }
      }
    }
    if (currentRole === "GO") {
      try {
        
        console.log(data);
        const res = await synopsisService.updateGoEvaluation(data);

        console.log(res);
        if(data.goIsRequiredAgain=="Yes"){
          setShowNotificationModal(true)
          
        }
        else{
          if (res.status === 200) {
            setShowEvaluateModal(true);
            navigate("/Dashboard/viewSynopsisReport", {
              state: { data: location.state.data.registrationNo },
            });
          }
        }
        
      } catch (error) {
        if (error.response.status === 500) {
          setShowErrorModal(true);
        }
      }
    }
  };

  const defaultProps = {
    options: scheduleLabels,
    getOptionLabel: (schedule) => schedule || "",
  };

  useEffect(() => {
    async function fetchData() {
      // location.state.data.registrationNo
      const schd = await synopsisService.getSynopsisSchedules();
      // isme se student ka data chaiye humein
      console.log("schd",schd)

      const alreadysubmittedSynopsis =
        await synopsisService.getSubmittedSynopsis();
        console.log("already submitted synopsis",alreadysubmittedSynopsis)

      const schedularData = schd.filter(
        (s) =>
          s.student_id.registrationNo === location.state.data.registrationNo
      );
      console.log("schedulerdata",schedularData)
      const synopsisData = alreadysubmittedSynopsis.filter(
        (s) =>
          s.student_id.registrationNo === location.state.data.registrationNo
      );
      setSelectedSchedule(schedularData);
      console.log(schedularData);
      setSelectedSynopsis(synopsisData);
      setLoading(false);
      setData({ ...data, schedule_id: schedularData[0]._id });
    }

    fetchData();
  }, []);

  return loading ? (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "4rem",
      }}
    >
      <CircularProgress size={60} thickness={4.5} color="secondary" />
    </Box>
  ) : (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {/* <Box sx={{ mb: 4 }}>
        <Autocomplete
          {...defaultProps}
          id="controlled-demo"
          value={autocompleteValue}
          onChange={(value, newValue) => {
            let registrationNo = newValue;
            setAutocompleteValue(newValue);

            // handleRegistrationNo(registrationNo);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter Registration Number"
              variant="outlined"
              color="secondary"
            />
          )}
        />
      </Box> */}
      {hasEvaluatedSynopsis ? (
        <p>You have already evaluated this student</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-12 mt-2">
              <div className="border">
                <Typography
                  sx={{ mb: 2, color: "#572E74", fontWeight: "500" }}
                  textAlign={"center"}
                  variant="h4"
                >
                  Thesis Evaluation
                </Typography>
                <table
                  cellSpacing={0}
                  cellPadding={4}
                  id="ContentPlaceHolder1_DetailsView1"
                  style={{
                    width: "100%",
                    color: "#333333",
                    borderCollapse: "collapse",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "35%" }} />
                  </colgroup>
                  <tbody>
                    <tr
                      style={{
                        color: "#333333",
                        backgroundColor: "#F7F6F3",
                      }}
                    >
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Registration No
                      </td>
                      <td>{selectedSchedule[0]?.student_id?.registrationNo}</td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Area of Specialization
                      </td>
                      <td>{selectedSynopsis[0]?.specializationTrack}</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Name
                      </td>
                      <td>{selectedSchedule[0]?.student_id?.username}</td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Foreign Submission
                      </td>
                      <td>N/A</td>
                    </tr>
                    <tr
                      style={{
                        color: "#333333",
                        backgroundColor: "#F7F6F3",
                      }}
                    >
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Email
                      </td>
                      <td>{selectedSchedule[0]?.student_id?.email}</td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        GAT Subject
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Program
                      </td>
                      <td>
                        {selectedSchedule[0]?.program_id?.programShortName}
                      </td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Course work completion
                      </td>
                      <td>N/A</td>
                    </tr>
                    <tr
                      style={{
                        color: "#333333",
                        backgroundColor: "#F7F6F3",
                      }}
                    >
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Supervisor
                      </td>
                      <td>{selectedSynopsis[0]?.supervisor_id?.fullName}</td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Comprehensive Exam
                      </td>
                      <td>N/A</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Co-Supervisor
                      </td>
                      <td>{selectedSynopsis[0]?.coSupervisor_id?.fullName}</td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Synopsis Status
                      </td>
                      <td>{selectedSynopsis[0]?.synopsisStatus}</td>
                    </tr>
                    {/* <tr
                        style={{
                          color: "#333333",
                          backgroundColor: "#F7F6F3",
                        }}
                      >
                        <td
                          valign="top"
                          style={{
                            backgroundColor: "#E9ECF1",
                            fontWeight: "bold",
                          }}
                        >
                          Synopsis Status
                        </td>
                        <td>{submittedSynopsis?.synopsisStatus}</td>
                        <td
                          valign="top"
                          style={{
                            backgroundColor: "#E9ECF1",
                            fontWeight: "bold",
                          }}
                        >
                          Status
                        </td>
                        <td>&nbsp;</td>
                      </tr> */}
                    <tr>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Synopsis File
                      </td>
                      <td colspan="3">
                        <a
                          target="_blank"
                          href={`${process.env.REACT_APP_URL}/${selectedSynopsis[0]?.synopsisFileName}`}
                          rel="noopener noreferrer"
                        >
                          {selectedSynopsis[0]?.synopsisFileName}
                        </a>
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Synopsis Title
                      </td>
                      <td colspan="3">
                        {selectedSchedule[0]?.student_id?.synopsisTitle}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 p-4">
              <table style={{ width: "100%", marginTop: "1rem" }}>
                {currentRole === "GO" ? (
                  <>
                    <Box
                      sx={{
                        minWidth: 120,
                        marginTop: "0.2rem",
                      }}
                    >
                      <>
                        <FormControl sx={{ mt: 4 }} fullWidth color="secondary">
                          <InputLabel>Final Recommendation</InputLabel>
                          <Select
                            variant="outlined"
                            name="finalRecommendation"
                            label="Final Recommendation"
                            onChange={handleChange}
                          >
                            <MenuItem value="Minor Changings">
                              Minor Changings
                            </MenuItem>
                            <MenuItem value="Major Changings">
                              Major Changings
                            </MenuItem>
                            <MenuItem value="Not Allowed">Not Allowed</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ mt: 4 }}>
                          <FormLabel color="secondary">
                            Presentation Required Again?
                          </FormLabel>
                          <RadioGroup
                            row
                            name="goIsRequiredAgain"
                            onChange={handleChange}
                            //onClick={(e)=>setagain(e.target.value)}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio color="secondary" />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio color="secondary" />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </>
                    </Box>
                    <TextField
                      fullWidth
                      sx={{ my: 2 }}
                      multiline
                      rows={6}
                      label="GO's Decision and Recommendations"
                      color="secondary"
                      name="goComment"
                      variant="outlined"
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <tbody>
                    {/* <tr>
                        <th>
                          After in depth examination of the manuscript following
                          are the recommendations of GAC member
                        </th>
                      </tr> */}
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                      >
                        <tr>
                          <td>
                            <FormControlLabel
                              value="Minor Changings."
                              control={<Radio color="secondary" />}
                              label=""
                              name="evaluationStatus"
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            The candidate is recommended to do <b>minor</b>
                            changings.
                          </td>
                          <td>
                            A Candidate has to submit a manuscript within 1
                            week.
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormControlLabel
                              value="Major Changings."
                              control={<Radio color="secondary" />}
                              label=""
                              name="evaluationStatus"
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            The candidate is recommended to do <b>major</b>{" "}
                            changings.
                          </td>
                          <td>Candidate has to re-appear in next semester. </td>
                        </tr>
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      fullWidth
                      sx={{ my: 2 }}
                      multiline
                      rows={6}
                      label="Decision and Recommendations"
                      color="secondary"
                      name="comments"
                      variant="outlined"
                      onChange={handleChange}
                    />
                  </tbody>
                )}
              </table>

              <Button
                type="submit"
                variant="contained"
                size="large"
                color="secondary"
                onClick={handleSubmit}
              >
                Submit
              </Button>

              <BackdropModal
                showModal={showEvaluateModal}
                setShowModal={setShowEvaluateModal}
                title={"Evaluate!"}
              >
                Synopsis has been Evaluated.
              </BackdropModal>
              <BackdropModal
                showModal={showErrorModal}
                setShowModal={setShowErrorModal}
                title={"Error!"}
              >
                Something went wrong.
              </BackdropModal>
              <Modal
        open={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            color={"#9C27B0"}
          >
            Send Rebuttle Notification
          </Typography>
          
          <TextField value={notification} placeholder="Enter Custom Notification" onChange={(e)=>setnotification(e.target.value)}>{notification}</TextField>

          <Button
            style={{
              alignSelf: "flex-end",
              marginTop: ".5rem",
            }}
            variant="contained"
            color="secondary"
            onClick={() =>{ setShowNotificationModal(false)
            handleSubmit2()}}
          >
            OK
          </Button>
        </Box>
      </Modal>
    
            </div>
          </div>
        </>
      )}
    </Box>
  );
}
