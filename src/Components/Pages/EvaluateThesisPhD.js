import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import thesisService from "../../API/thesis";
import {
  Autocomplete,
  CircularProgress,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BackdropModal from "../UI/BackdropModal";

export default function EvaluateThesisMS() {
  const { currentRole } = useSelector((state) => state.userRoles);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [schedules, setSchedules] = useState([]);

  const [hasEvaluatedThesis, setHasEvaluatedThesis] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedThesis, setSelectedThesis] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [submittedThesis, setSubmittedThesis] = useState({});
  const [data, setData] = useState({});

  const [scheduleLabels, setScheduleLabels] = useState([]);

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

  useEffect(() => {
    async function fetchData() {
      const schd = await thesisService.getThesisSchedules();
      const alreadyevaluatedThesis = await thesisService.getThesisEvaluations();
      const alreadysubmittedThesis = await thesisService.getSubmittedThesis();

      let filteredPhdSchedules = schd.filter((phdSchedule) =>
        phdSchedule.program_id.programShortName.toLowerCase().includes("phd")
      );
      setSchedules(filteredPhdSchedules);
      uniqueScheduleLabels(filteredPhdSchedules);
      setEvaluations(alreadyevaluatedThesis);
      setSubmittedThesis(alreadysubmittedThesis);

      setLoading(false);
    }
    fetchData();
  }, []);

  console.log(schedules);
  console.log(evaluations);
  console.log(submittedThesis);

  const handleRegistrationNo = (reg) => {
    setHasEvaluatedThesis(false);

    schedules.forEach((oneSchedule) => {
      if (reg === oneSchedule?.student_id?.registrationNo) {
        evaluations.forEach((evaluatedThesis) => {
          if (evaluatedThesis.schedule_id) {
            if (evaluatedThesis.schedule_id._id === oneSchedule._id) {
              if (evaluatedThesis.evaluator_id._id === user.user._id) {
                console.log(true);
                setHasEvaluatedThesis(true);
              }
            }
          }
        });

        setSelectedSchedule(oneSchedule);

        console.log("Selected Schedule", selectedSchedule);
        setData({ ...data, schedule_id: oneSchedule._id });

        submittedThesis.forEach((oneThesis) => {
          if (
            selectedSchedule.student_id?._id === submittedThesis.student_id?._id
          ) {
            console.log("Selected Thesis", oneThesis);
            setSelectedThesis(oneThesis);
          }
        });
      }
    });
  };

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    console.log(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (currentRole !== "GO") {
      try {
        const res = await thesisService.addEvaluation(data);

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
        const res = await thesisService.updateGoEvaluation(data);

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
  };

  const defaultProps = {
    options: scheduleLabels,
    getOptionLabel: (schedule) => schedule || "",
  };

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
      <Box sx={{ mb: 4 }}>
        <Autocomplete
          {...defaultProps}
          id="controlled-demo"
          value={autocompleteValue}
          onChange={(value, newValue) => {
            let registrationNo = newValue;
            setAutocompleteValue(newValue);

            handleRegistrationNo(registrationNo);
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
      </Box>
      {hasEvaluatedThesis ? (
        <p>You have already evaluated this student</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-12 mt-3">
              <div className="border">
                <table
                  className="small-12 medium-12 large-12 columns table table-sm"
                  cellSpacing={0}
                  cellPadding={4}
                  id="ContentPlaceHolder1_DetailsView1"
                  style={{ color: "#333333", borderCollapse: "collapse" }}
                >
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
                          width: "20%",
                        }}
                      >
                        Registration No
                      </td>
                      <td>{selectedSchedule?.student_id?.registrationNo}</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
                        }}
                      >
                        Name
                      </td>
                      <td>{selectedSchedule?.student_id?.username}</td>
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
                          width: "20%",
                        }}
                      >
                        Email
                      </td>
                      <td>{selectedSchedule?.student_id?.email}</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
                        }}
                      >
                        Program
                      </td>
                      <td>{selectedSchedule?.program_id?.programShortName}</td>
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
                          width: "20%",
                        }}
                      >
                        Course work completion
                      </td>
                      <td>N/A</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
                        }}
                      >
                        Comprehensive Exam
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
                          width: "20%",
                        }}
                      >
                        Thesis Status
                      </td>
                      <td>{selectedThesis.thesisStatus}</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
                        }}
                      >
                        Thesis Title
                      </td>
                      <td>{selectedSchedule.thesisTitle}</td>
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
                          width: "20%",
                        }}
                      >
                        Area of Specialization
                      </td>
                      <td>{selectedThesis?.specializationTrack}</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
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
                          width: "20%",
                        }}
                      >
                        GAT Subject
                      </td>
                      <td>N/A</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
                        }}
                      >
                        Status
                      </td>
                      <td>&nbsp;</td>
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
                          width: "20%",
                        }}
                      >
                        Supervisor
                      </td>
                      <td>{selectedThesis?.supervisor_id?.fullName}</td>
                    </tr>
                    <tr style={{ backgroundColor: "White" }}>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                          width: "20%",
                        }}
                      >
                        Co-Supervisor
                      </td>
                      <td>{selectedThesis?.coSupervisor_id?.fullName}</td>
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
                          width: "20%",
                        }}
                      >
                        Thesis File
                      </td>
                      <td>
                        <a
                          target="_blank"
                          href={`${process.env.REACT_APP_URL}/${selectedThesis?.thesisFileName}`}
                          rel="noopener noreferrer"
                        >
                          {selectedThesis?.thesisFileName}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 p-4">
              <table style={{ width: "100%" }} className="table table-sm">
                {currentRole === "GO" ? (
                  <>
                    <Box
                      sx={{
                        minWidth: 120,
                        marginTop: "1rem",
                      }}
                    >
                      <>
                        <FormControl sx={{ mt: 4 }} fullWidth color="secondary">
                          <InputLabel>Final Recommendation</InputLabel>
                          <Select
                            variant="outlined"
                            //value={Program}
                            label="Final Recommendation"
                            //onChange={handleChange}
                          >
                            <MenuItem value="minor">Minor Changings</MenuItem>
                            <MenuItem value="major">Major Changings</MenuItem>
                            <MenuItem value="not">Not Allowed</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ mt: 4 }}>
                          <FormLabel color="secondary">
                            Presentation Required Again?
                          </FormLabel>
                          <RadioGroup
                            row
                            name="presentationRequired"
                            /* value={studentType}
                              onChange={(e) => setStudentType(e.target.value)} */
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio color="secondary" />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio color="secondary" />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </>
                    </Box>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <th colSpan={4}>
                        <b>
                          After in depth examination of the manuscript following
                          are the recommendations of GAC member
                        </b>
                      </th>
                    </tr>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                      >
                        <tr>
                          <td>1</td>
                          <td>
                            The candidate is recommended to do <b>minor</b>{" "}
                            changings.
                          </td>
                          <td>
                            A Candidate has to submit a manuscript within 1
                            week.
                          </td>
                          <td>
                            <FormControlLabel
                              value="Minor Changings."
                              control={<Radio color="secondary" />}
                              label=""
                              name="evaluationStatus"
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            The candidate is recommended to do <b>major</b>{" "}
                            changings.
                          </td>
                          <td>Candidate has to re-appear in next semester. </td>
                          <td>
                            <FormControlLabel
                              value="Major Changings."
                              control={<Radio color="secondary" />}
                              label=""
                              name="evaluationStatus"
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                      </RadioGroup>
                    </FormControl>
                  </tbody>
                )}
              </table>
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
            </div>
          </div>
        </>
      )}
    </Box>
  );
}
