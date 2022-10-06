import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import studentService from "../../API/students";
import synopsisService from "../../API/synopsis";
import thesisService from "../../API/thesis";
import { useNavigate } from "react-router-dom";

import { programWiseData } from "../DummyData/DummyData";
import BackdropModal from "../UI/BackdropModal";
import DataTable from "../UI/TableUI";
import programsService from "../../API/programs";

export default function SendThesisReport() {
  let navigate = useNavigate();
  const { currentRole } = useSelector((state) => state.userRoles);
  const { user } = useSelector((state) => state.auth);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [dataGridData, setDataGridData] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState();

  useEffect(() => {
    async function fetchData() {
      console.log(user.user._id);
      const prog = await programsService.getPrograms();
      setPrograms(prog);
      const schd = await synopsisService.getSynopsisSchedules();
      console.log(schd[0].program_id.programShortName);
      const alreadyEvaluated = await synopsisService.getSynopsisEvaluations();
      // console.log(res);
      console.log("already evaluated",alreadyEvaluated);
      // let filteredMsSchedules = schd.filter((msSchedule) =>
      //   msSchedule.program_id.programShortName.toLowerCase().includes("ms")
      // );
      let filteredMsSchedules;
      if (currentRole === "PHD_COR") {
        console.log("PHDDD");
        filteredMsSchedules = schd.filter((msSchedule) =>
          msSchedule.program_id.programShortName.toLowerCase().includes("phd")
        );
        console.log(filteredMsSchedules);
      } else if (currentRole === "MS_COR") {
        filteredMsSchedules = schd.filter((msSchedule) =>
          msSchedule.program_id.programShortName.toLowerCase().includes("ms")
        );
        console.log("MSCORR",filteredMsSchedules);

      } else {
        console.log("GOOOO");
        console.log(schd);
        filteredMsSchedules = schd;
      }
      // ager isme id perhi hai oar wo logged in user ke equal nahi hai tou display kero wo student
      // let result;
      // filteredMsSchedules = filteredMsSchedules.map((oneSchedule) => {
      //   res.forEach((evaluatedSynopsis) => {
      //     if (evaluatedSynopsis.schedule_id) {
      //       if (
      //         evaluatedSynopsis.schedule_id.student_id._id ===
      //         oneSchedule.student_id._id
      //       ) {
      //         if (!evaluatedSynopsis.evaluator_id._id === user.user._id) {
      //           result = oneSchedule;
      //         }
      //       }
      //     }
      //   });
      //   return result;
      // });

      // const result = alreadyEvaluated.filter((element) =>
      //   schd.includes(element.schedule_id.student_id._id)
      // );
      // let result = alreadyEvaluated.filter((o1) =>
      //   schd.some((o2) => o1.schedule_id.student_id._id === o2.student_id._id)
      // );
      // // console.log(result);
      // result = result.filter((x) => x.evaluator_id._id !== user.user._id);
      // // console.log(result);
      // // console.log(filteredMsSchedules);

      // result = schd.filter((o1) =>
      //   result.some((o2) => o2.schedule_id.student_id._id === o1.student_id._id)
      // );
      // console.log(result);
      console.log("filteredschedules",filteredMsSchedules);

      setFilteredSchedules(filteredMsSchedules);

      // result.student_id.supervisor_id
      const { supervisors } = await studentService.getSupervisors();
      console.log(supervisors);
      const dataa = filteredMsSchedules.map((res) => {
        const s = supervisors.filter(
          (mys) => mys._id === res.student_id.supervisor_id
        );
        console.log("sss",res);
        if(s.length!=0){
        return {
          name: res?.student_id?.username,
          registrationNo: res?.student_id?.registrationNo,
          email: res?.student_id?.email,
          supervisor: s[0].username,
          id: res?._id,
          _id:res?.student_id?._id
        };
      }
      });
      console.log("dataaaa",dataa);

      const data =dataa.filter(item=>item!=undefined)

      setDataGridData(data);
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
          <Button
            onClick={() => {
              navigate("/Dashboard/EvaluateSynopsis(MS)", {
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
        </>
      ),
    },
  ];

  const sendReportHandler = () => {
    setShowReportModal(true);
  };

  return (
    <>
      {/* <FormControl color="secondary" fullWidth>
        <InputLabel>Student</InputLabel>
        <Select
          sx={{ marginBottom: "15px" }}
          label="Student"
          name="student_id"
          onChange={(e) => {
            setDataGridData(
              filteredSchedules.filter(
                (oneSchedule) =>oneSchedule.program_id.programShortName.includes(e.target.value)
              )
            );
          }}
        >
          {programs.map((oneProgram) => (
            <MenuItem value={oneProgram.programShortName}>
              {oneProgram.programShortName}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
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
