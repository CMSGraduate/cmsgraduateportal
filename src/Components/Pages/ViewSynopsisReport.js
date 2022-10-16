import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import comsatsLogo from "../../../src/cui.png";
import pdfReportsService from "../../API/pdfReports";
import synopsisService from "../../API/synopsis";
import "../../Components/UI/ActiveTab.css";
import { useLocation } from "react-router-dom";
import programsService from "../../API/programs";
import axios from "axios";
import BackdropModal from "../UI/BackdropModal";

const ViewSynopsisReport = () => {
  const location = useLocation();
  const { currentRole } = useSelector((state) => state.userRoles);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationLabels, setEvaluationLabels] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [filteredSynopsis, setFilteredSynopsis] = useState([]);
  const [submittedSynopsis, setSubmittedSynopsis] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  // console.log(location.state.data);

  // const uniqueEvaluatedLabels = async (array) => {
  //   const labels = [
  //     ...new Set(
  //       await array.map((a) => {
  //         return a?.schedule_id?.student_id?.registrationNo;
  //       })
  //     ),
  //   ];
  //   setEvaluationLabels(labels);
  // };

  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await synopsisService.getSynopsisEvaluations();
  //     const syn = await synopsisService.getSubmittedSynopsis();
  //     console.log(res);
  //     console.log(syn);

  //     let filteredsubmittedEvaluation = [];
  //     let filteredSynopsisEvaluation = [];
  //     if (currentRole.toLowerCase().includes("ms")) {
  //       filteredSynopsisEvaluation = res.filter((item) =>
  //         item.schedule_id.student_id.program_id.programShortName
  //           .toLowerCase()
  //           .includes("ms")
  //       );
  //       filteredsubmittedEvaluation = syn.filter((item) =>
  //         item.student_id.program_id.programShortName
  //           .toLowerCase()
  //           .includes("ms")
  //       );
  //     } else if (currentRole.toLowerCase().includes("phd")) {
  //       filteredSynopsisEvaluation = res.filter((item) =>
  //         item.schedule_id?.student_id?.program_id?.programShortName
  //           .toLowerCase()
  //           .includes("phd")
  //       );
  //       filteredsubmittedEvaluation = syn.filter((item) =>
  //         item.student_id.program_id.programShortName
  //           .toLowerCase()
  //           .includes("phd")
  //       );
  //     } else {
  //       filteredSynopsisEvaluation = res;
  //       filteredsubmittedEvaluation = syn;
  //     }

  //     setEvaluations(filteredSynopsisEvaluation);
  //     setSubmittedSynopsis(filteredsubmittedEvaluation);
  //     uniqueEvaluatedLabels(filteredSynopsisEvaluation);
  //   }

  //   fetchData();
  //   console.log("Labels", evaluationLabels);
  // }, []);

  // const handleRegistrationNo = (reg) => {
  //   let evals = evaluations.filter(
  //     (evaluation) =>
  //       evaluation?.schedule_id?.student_id?.registrationNo === reg
  //   );
  //   let subSyn = submittedSynopsis.filter(
  //     (submittedSynopsis) => submittedSynopsis.student_id.registrationNo === reg
  //   );
  //   console.log(subSyn);

  //   setFilteredEvaluations(evals);
  //   setFilteredSynopsis(subSyn);
  //   console.log(filteredSynopsis);
  //   console.log(filteredEvaluations);
  // };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const defaultProps = {
  //   options: evaluationLabels,
  //   getOptionLabel: (evaluation) => evaluation || "",
  // };

  console.log(filteredEvaluations);
  console.log(filteredSynopsis);

  const handleSubmit = async () => {
    try{
    const res=await pdfReportsService.generateSynopsisReport({
      evaluations: filteredEvaluations,
      synopsis: filteredSynopsis,
    });
    const ress=await pdfReportsService.downlaodSynopsisReport(
      filteredSynopsis[0].student_id.registrationNo
    );
    console.log("res",res)
    if (res.status === 200) {
      setShowNotificationModal(true);
    }
  }catch (error) {
    if (error.response.status === 500) {
      setShowErrorModal(true);
    }
  }
  };

  const handleSend = async () => {
    try{
    const res=await pdfReportsService.generateAndSendSynopsis(
      {
        evaluations: filteredEvaluations,
        synopsis: filteredSynopsis,
      },
      filteredSynopsis[0]?.student_id?.email,
      filteredSynopsis[0]?.supervisor_id?.email
    )
    const ress=await pdfReportsService.downlaodSynopsisReport(
      filteredSynopsis[0].student_id.registrationNo
    );
    console.log("res",res)
    if (res.status === 200) {
      setShowNotificationModal(true);
    }
  }catch (error) {
    if (error.response.status === 500) {
      setShowErrorModal(true);
    }
  }

  };

  useEffect(() => {
    async function fetchData() {
      const evaluationss = await synopsisService.getSynopsisEvaluations();
      const syn = await synopsisService.getSubmittedSynopsis();
      let reg = location.state.data;
      let evals = evaluationss.filter(
        (evaluation) =>
          evaluation?.schedule_id?.student_id?.registrationNo === reg
      );
      let subSyn = syn.filter(
        (submittedSynopsis) =>
          submittedSynopsis.student_id.registrationNo === reg
      );
      console.log(subSyn);

      setFilteredEvaluations(evals);
      setFilteredSynopsis(subSyn);
    }

    fetchData();
  }, []);

  return (
    <>
      {/* <Box sx={{ mb: 4 }}>
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
              label="Search"
              variant="outlined"
              color="secondary"
            />
          )}
        />
      </Box> */}

      <div ref={componentRef} className="pdf">
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={comsatsLogo}
            alt=""
            style={{ objectFit: "contain", height: "6rem" }}
          />
          <h2
            style={{
              textAlign: "center",
              color: "#6B57A2",
            }}
          >
            Synopsis Evaluation
          </h2>
        </div>
        {/* First Row */}
        <div
          style={{
            marginLeft: "0.5rem",
            display: "flex",
            alignItems: "center",
            marginTop: "2rem",
            marginBottom: "0",
          }}
        >
          <div
            style={{
              width: "21rem",
              marginTop: "0",
              marginBottom: "0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                marginRight: "1rem",
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              Candidate:{" "}
            </h3>
            <p style={{ marginTop: "0", marginBottom: "0" }}>
              {filteredSynopsis[0]?.student_id?.username}
            </p>
          </div>
          <h3
            style={{
              marginRight: "1rem",
              marginTop: "0",
              marginBottom: "0",
            }}
          >
            Registration Number:
          </h3>
          <p style={{ marginTop: "0", marginBottom: "0" }}>
            {filteredSynopsis[0]?.student_id?.registrationNo}
          </p>
        </div>
        {/* Second Row */}
        <div
          style={{
            marginLeft: "0.5rem",
            display: "flex",
            alignItems: "center",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          <div
            style={{
              width: "21rem",
              marginTop: "0",
              marginBottom: "0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                marginRight: "1rem",
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              Supervisor:{" "}
            </h3>
            <p style={{ marginTop: "0", marginBottom: "0" }}>
              {filteredSynopsis[0]?.supervisor_id?.fullName}
            </p>
          </div>
          <h3
            style={{
              marginRight: "1rem",
              marginTop: "0",
              marginBottom: "0",
            }}
          >
            Dated:
          </h3>
          <p>{"23 March 2022"}</p>
        </div>
        {/* Third Row */}
        <div
          style={{
            marginLeft: "0.5rem",
            display: "flex",
            alignItems: "center",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          <h3
            style={{
              marginRight: "1rem",
              marginTop: "0",
              marginBottom: "0",
            }}
          >
            Synopsis Title:
          </h3>
          <p style={{ marginTop: "0", marginBottom: "0" }}>
            {filteredSynopsis[0]?.student_id?.synopsisTitle}
          </p>
        </div>
        {/* 4th Row */}
        <div
          style={{
            marginLeft: "0.5rem",
            display: "flex",
            alignItems: "center",
            marginTop: "1rem",
            marginBottom: "0",
          }}
        >
          <h3
            style={{
              marginRight: "1rem",
              marginTop: "0rem",
              marginBottom: "0rem",
            }}
          >
            After in depth examination of the manuscript following are the
            recommendations of the GAC member(s)
          </h3>
        </div>
        {/* 5th Row */}
        {filteredEvaluations.map((item) => (
          <div>
            <div
              style={{
                marginLeft: "0.5rem",
                display: "flex",
                alignItems: "center",
                marginTop: "2rem",
                marginBottom: "0rem",
              }}
            >
              <div
                style={{
                  width: "14rem",
                  marginTop: "0",
                  marginBottom: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    marginTop: "0",
                    marginBottom: "0",
                    fontWeight: "bold",
                  }}
                >
                  {item?.evaluator_id?.username}
                </p>
              </div>
              <div
                style={{
                  width: "23rem",
                  marginTop: "0",
                  marginBottom: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    marginRight: "1rem",
                    marginTop: "0",
                    marginBottom: "0",
                    fontSize: "1.1rem",
                  }}
                >
                  Recommendation:
                </h3>
                <p
                  style={{
                    marginTop: "0",
                    marginBottom: "0",
                  }}
                >
                  {item?.evaluationStatus?.evaluationStatus}
                </p>
              </div>
              <div
                style={{
                  width: "19rem",
                  marginTop: "0",
                  marginBottom: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    marginRight: "1rem",
                    marginTop: "0",
                    marginBottom: "0",
                    fontSize: "1.1rem",
                  }}
                >
                  Is Required Again:
                </h3>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
              {item?.goEvaluation?.goIsRequiredAgain}     
              </p>
              </div>
            </div>
            <h3
              style={{
                marginRight: "1rem",
                marginTop: "0",
                marginBottom: ".5rem",
                fontSize: "1.1rem",
                marginLeft: "0.5rem",
              }}
            >
              Comment:
            </h3>
            <div
              style={{
                marginLeft: "0.5rem",
                display: "flex",
                alignItems: "center",
                marginBottom: "0",
                textAlign: "justify",
              }}
            >
              {item?.comments}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", placeContent: "center" }}>
        {/*  <Button
          type="button"
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={handlePrint}
        >
          Print PDF
        </Button> */}
        <Button
          type="downlaod"
          variant="contained"
          color="secondary"
          sx={{ mb: 2, mr: 2 }}
          onClick={handleSubmit}
        >
          Download PDF
        </Button>
        <Button
          type="downlaod"
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={handleSend}
        >
          Generate & send PDF
        </Button>
      </div>

      <BackdropModal
        showModal={showNotificationModal}
        setShowModal={setShowNotificationModal}
        title={"Notification!"}
      >
        Report has been Sent.
      </BackdropModal>
      <BackdropModal
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
        title={"Error!"}
      >
        Something went wrong.
      </BackdropModal>
    </>
  );
};

export default ViewSynopsisReport;
