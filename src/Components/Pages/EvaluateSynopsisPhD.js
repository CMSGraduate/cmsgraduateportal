import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import synopsisService from "../../API/synopsis";
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

export default function EvaluateSynopsisPhD() {
  const { currentRole } = useSelector((state) => state.userRoles);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [schedules, setSchedules] = useState([]);

  const [hasEvaluatedSynopsis, setHasEvaluatedSynopsis] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedSynopsis, setSelectedSynopsis] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [submittedSynopsis, setSubmittedSynopsis] = useState({});
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
      const schd = await synopsisService.getSynopsisSchedules();
      const alreadyevaluatedSynopsis =
        await synopsisService.getSynopsisEvaluations();
      const alreadysubmittedSynopsis =
        await synopsisService.getSubmittedSynopsis();

      let filteredPhdSchedules = schd.filter((phdSchedule) =>
        phdSchedule.program_id.programShortName.toLowerCase().includes("phd")
      );

      setSchedules(filteredPhdSchedules);
      uniqueScheduleLabels(filteredPhdSchedules);
      setEvaluations(alreadyevaluatedSynopsis);
      setSubmittedSynopsis(alreadysubmittedSynopsis);

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleRegistrationNo = (reg) => {
    setHasEvaluatedSynopsis(false);

    schedules.forEach((oneSchedule) => {
      if (reg === oneSchedule?.student_id?.registrationNo) {
        evaluations.forEach((evaluatedSynopsis) => {
          if (evaluatedSynopsis.schedule_id) {
            if (evaluatedSynopsis.schedule_id._id === oneSchedule._id) {
              if (evaluatedSynopsis.evaluator_id._id === user.user._id) {
                console.log(true);
                setHasEvaluatedSynopsis(true);
              }
            }
          }
        });

        setSelectedSchedule(oneSchedule);

        console.log("Selected Schedule", selectedSchedule);
        setData({ ...data, schedule_id: oneSchedule._id });

        submittedSynopsis.forEach((oneSynopsis) => {
          if (
            selectedSchedule.student_id?._id ===
            submittedSynopsis.student_id?._id
          ) {
            console.log("Selected Synopsis", oneSynopsis);
            setSelectedSynopsis(oneSynopsis);
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
        const res = await synopsisService.updateGoEvaluation(data);

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
      {hasEvaluatedSynopsis ? (
        <p>You have already evaluated this student</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-12 mt-3">
              <div className="border">
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
                      <td>{selectedSchedule?.student_id?.registrationNo}</td>
                      <td
                        valign="top"
                        style={{
                          backgroundColor: "#E9ECF1",
                          fontWeight: "bold",
                        }}
                      >
                        Area of Specialization
                      </td>
                      <td>{selectedSynopsis?.specializationTrack}</td>
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
                      <td>{selectedSchedule?.student_id?.username}</td>
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
                      <td>{selectedSchedule?.student_id?.email}</td>
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
                      <td>{selectedSchedule?.program_id?.programShortName}</td>
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
                      <td>{selectedSynopsis?.supervisor_id?.fullName}</td>
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
                      <td>{selectedSynopsis?.coSupervisor_id?.fullName}</td>
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
                          href={`${process.env.REACT_APP_URL}/${selectedSynopsis?.synopsisFileName}`}
                          rel="noopener noreferrer"
                        >
                          {selectedSynopsis?.synopsisFileName}
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
                        {selectedSchedule?.student_id?.synopsisTitle}
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
                        marginTop: "1rem",
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
            </div>
          </div>
        </>
      )}
    </Box>
  );
}
