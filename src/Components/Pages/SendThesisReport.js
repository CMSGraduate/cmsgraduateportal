import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import programsService from "../../API/programs";
import synopsisService from "../../API/synopsis";
import thesisService from "../../API/thesis";
import { useNavigate } from "react-router-dom";
import { programWiseData } from "../DummyData/DummyData";
import BackdropModal from "../UI/BackdropModal";
import DataTable from "../UI/TableUI";
import studentService from "../../API/students";

export default function SendThesisReport() {
  let navigate = useNavigate();
  const { currentRole } = useSelector((state) => state.userRoles);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [dataGridData, setDataGridData] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState();
  const [programs, setPrograms] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // const uniqueEvaluatedLabels = (array) => {
  //   const arrayUniqueByKey = [
  //     ...new Map(
  //       array.map((item) => [
  //         item[item.schedule_id.student_id.registrationNo],
  //         item,
  //       ])
  //     ).values(),
  //   ];

  //   return arrayUniqueByKey;
  // };

  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await thesisService.getThesisEvaluations();

  //     console.log(res);

  //     const goEvaluated = res.filter((item) => item?.goEvaluation?.isEvaluated);

  //     let filteredThesisEvaluation = [];
  //     if (currentRole.toLowerCase().includes("ms")) {
  //       filteredThesisEvaluation = goEvaluated.filter((item) =>
  //         item.schedule_id.student_id.program_id.programShortName
  //           .toLowerCase()
  //           .includes("ms")
  //       );
  //     } else if (currentRole.toLowerCase().includes("phd")) {
  //       filteredThesisEvaluation = goEvaluated.filter((item) =>
  //         item.schedule_id?.student_id?.program_id?.programShortName
  //           .toLowerCase()
  //           .includes("phd")
  //       );
  //     } else {
  //       filteredThesisEvaluation = goEvaluated;
  //     }

  //     console.log(filteredThesisEvaluation);

  //     var values = uniqueEvaluatedLabels(filteredThesisEvaluation);

  //     const data = values.map((res) => ({
  //       name: res?.schedule_id?.student_id?.username,
  //       registrationNo: res?.schedule_id?.student_id?.registrationNo,
  //       email: res?.schedule_id?.student_id?.email,
  //       professor: res?.evaluator_id?.username,
  //       id: res?._id,
  //     }));

  //     setEvaluations(data);
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      console.log(user.user._id);
      const prog = await programsService.getPrograms();
      setPrograms(prog);
      const schd = await thesisService.getThesisSchedules();
      console.log(schd[0].program_id.programShortName);
      const alreadyEvaluated = await thesisService.getThesisEvaluations();
      // console.log(res);
      // let filteredMsSchedules = schd.filter((msSchedule) =>
      //   msSchedule.program_id.programShortName.toLowerCase().includes("ms")
      // );
      console.log(currentRole);
      let filteredMsSchedules;
      if (currentRole === "PHD_COR") {
        console.log("PHDDD");
        filteredMsSchedules = schd.filter((msSchedule) =>
          msSchedule.program_id.programShortName.toLowerCase().includes("phd")
        );
        console.log(filteredMsSchedules);
      } else if (currentRole === "MS_COR") {
        console.log("MSCORR");
        filteredMsSchedules = schd.filter((msSchedule) =>
          msSchedule.program_id.programShortName.toLowerCase().includes("ms")
        );
      } else {
        console.log("GOOOO");
        console.log(schd);
        filteredMsSchedules = schd;
      }

      setFilteredSchedules(filteredMsSchedules);

      // result.student_id.supervisor_id
      const { supervisors } = await studentService.getSupervisors();
      console.log(supervisors);
      const dataa = filteredMsSchedules.map((res) => {
        const s = supervisors.filter(
          (mys) => mys._id === res.student_id.supervisor_id
        );
        console.log(s);
        return {
          name: res?.student_id?.username,
          registrationNo: res?.student_id?.registrationNo,
          email: res?.student_id?.email,
          supervisor: s[0].username,
          id: res?._id,
        };
      });
      console.log(dataa);

      setDataGridData(dataa);
    }

    fetchData();
  }, []);

  console.log(evaluations);

  const programWiseHeader = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    { field: "registrationNo", headerName: "Registration No.", width: 200 },
    { field: "email", headerName: "Email", width: 350 },
    { field: "supervisor", headerName: "Supervisor", width: 200 },
    {
      field: "actions",
      headerName: "Action",
      width: 200,
      renderCell: (props) => (
        <>
           {currentRole=="GO"?
        <Button
        onClick={() => {
          navigate("/Dashboard/EvaluationsTh", {
            state: { data: props.row },
          });
        }}
        variant="contained"
        color="secondary"
        size="small"
        style={{ marginLeft: 10 }}
      >
        Evaluate Report
      </Button>
      :
          <Button
            onClick={() => {
              navigate("/Dashboard/EvaluateThesis(MS)", {
                state: { data: props.row },
              });
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            Evaluate Report
          </Button>
    }
        </>
      ),
    },
  ];

  const sendReportHandler = () => {
    setShowReportModal(true);
  };

  return (
    <>
      <div style={{ height: 500, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          rows={dataGridData}
          columns={programWiseHeader}
          pageSize={6}
          rowsPerPageOptions={[5]}
        />
      </div>
      {/*  <div>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          size="large"
          color="secondary"
          onClick={sendReportHandler}
        >
          Send Report
        </Button>
      </div> */}

      <BackdropModal
        showModal={showReportModal}
        setShowModal={setShowReportModal}
        title={"Report!"}
      >
        Report/Reports has been Sent.
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
}
