import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import synopsisService from "../../API/synopsis";
import studentService from "../../API/students";
import progressReportService from "../../API/progressReports";
import thesisService from "../../API/thesis";
import "../../Components/UI/ActiveTab.css";
import ReportTemplate from "../UI/ReportTemplate";
import ReportTemplateVerify from "../UI/ReportTemplateVerify"
import { useSelector, useDispatch } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";


;
export default function ViewMSStudentDetails() {
  const [loading, setLoading] = useState(true);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [filter,setfilter]=useState('Registeration Number');
  const [fil,setfil]=useState('');

  useEffect(() => {
    async function fetchData() {
      const students = await studentService.getStudents();
      const submittedSynopsis = await synopsisService.getSubmittedSynopsis();
      const submittedThesis = await thesisService.getSubmittedThesis();
      const evaluatedSynopsis=await synopsisService.getSynopsisEvaluations();
      const evaluatedThesis=await thesisService.getThesisEvaluations();

      const { data: progressReport } = await progressReportService.getReports();

      console.log(students);
      console.log(progressReport);
      console.log(submittedSynopsis);
      console.log(submittedThesis);
      console.log(evaluatedThesis);
      console.log(evaluatedSynopsis);

      let selectedStudents = [];

      students.forEach((student) => {
        if (student.program_id.programShortName.toLowerCase().includes("ms")) {
          let filteredSynopsis = submittedSynopsis.filter(
            (synopsis) => synopsis.student_id._id === student._id
          );
          let filteredThesis = submittedThesis.filter(
            (thesis) => thesis.student_id._id === student._id
          );
          let filteredProgress = progressReport.filter(
            (report) => report.student_id._id === student._id
          );

            let filteredSynopsisEvaluation=evaluatedSynopsis.filter(
              (synopsise) => synopsise.schedule_id.student_id._id === student._id
            );
            let filteredThesisEvaluation=evaluatedThesis.filter(
              (thesise) => thesise.schedule_id.student_id._id === student._id
            );
          console.log(filteredSynopsis);
          console.log(filteredThesis);

          selectedStudents.push({
            student_id: student,
            ...(filteredProgress.length > 0 && {
              progressReport: filteredProgress[0],
            }),
            ...(filteredSynopsis.length > 0 && {
              synopsisStatus: filteredSynopsis[0].synopsisStatus,
              synopsisTitle: filteredSynopsis[0].synopsisTitle,
            }),
            ...(filteredThesis.length > 0 && {
              thesisStatus: filteredThesis[0].thesisStatus,
              thesisTitle: filteredThesis[0].thesisTitle,
            }),
            
            ...(filteredSynopsisEvaluation.length > 0 && {
              SynopsisEvaluation: filteredSynopsisEvaluation[0].goEvaluation.
              finalRecommendation,
              
            }),
            ...(filteredThesisEvaluation.length > 0 && {
              ThesisEvaluation: filteredThesisEvaluation[0].goEvaluation.
              finalRecommendation,
              
            }),
          });
        }
      });
      console.log(selectedStudents);

      const stds = students.filter((student) =>
        student.program_id.programShortName.toLowerCase().includes("ms")
      );
      setStudents(stds);
      setSelectedReport(selectedStudents);
      setFilteredReport(selectedStudents);
      setLoading(false);
    }
    fetchData();
  }, []);
  useEffect(() => {
    setFilteredReport(filterbySearch(selectedReport, fil,filter));
    
  },[fil
  ]);
  const filterbySearch=(data,fil,filt)=>{
    console.log("data",data)
    if(fil==''){
      return data;
    }
    if(filt=="Name"){
    var a = data.filter(item =>
           item.student_id.username.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
   )
    }
    if(filt=="Supervisor"){
      var a = data.filter(item =>
             item.student_id.supervisor_id?.username.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
     )
      }
      if(filt=="Synopsis Title"){
        var a = data.filter(item =>
               item.synopsisTitle?.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
       )
        }
        if(filt=="Thesis Title"){
          var a = data.filter(item =>
                 item.thesisTitle?.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
         )
          }
          if(filt=="Synopsis Evaluation"){
            var a = data.filter(item =>
                   item.SynopsisEvaluation?.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
           )
            }
            if(filt=="Thesis Evaluation"){
              var a = data.filter(item =>
                     item.ThesisEvaluation?.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
             )
              }
              
   return a;
   }
  const handleRegistrationNo = (selectedStudent) => {

    console.log(selectedStudent);

    if (selectedStudent) {
      let report = selectedReport.filter(
        (report) => report.student_id.registrationNo === selectedStudent
      );
      setFilteredReport(report);
    } else {
      setFilteredReport(selectedReport);
    }
  };

  const defaultProps = {

    options: students,
    getOptionLabel: (student) => student.registrationNo || "",
  };
  const { currentRole } = useSelector((state) => state.userRoles);
    
  const searchtext = (event) =>{
    setfil(event.target.value);
}
  return (
    <>
    <Box sx={{ marginBottom: "10px",width:120,marginLeft:'89%'}}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Type"
            name="type"
            value={filter}
            onChange={(e)=>setfilter(e.target.value)}
            style={{marginTop:0}}
          >
            
              <MenuItem value={"Name"}>
              Name
              </MenuItem>
              <MenuItem value={"Supervisor"}>
              Supervisor
              </MenuItem><MenuItem value={"Synopsis Title"}>
              Synopsis Title
              </MenuItem><MenuItem value={"Thesis Title"}>
              Thesis Title
              </MenuItem><MenuItem value={"Synopsis Evaluation"}>
              Synopsis Evaluation
              </MenuItem>
              <MenuItem value={"Thesis Evaluation"}>
              Thesis Evaluation
              </MenuItem>
              <MenuItem value={"Registeration Number"}>
              Registeration Number
              </MenuItem>
          </Select>
        </FormControl>
      </Box> 
    {filter=="Registeration Number"?
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultProps}
            id="controlled-demo"
            value={autocompleteValue}
            onChange={(value, newValue) => {
              let registrationNo = newValue?.registrationNo;
              setAutocompleteValue(newValue);
              handleRegistrationNo(registrationNo);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Registration No."
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box>
      :
      <Box sx={{ minWidth: "100%", marginBottom: "16px",marginRight:1 }}               
>
        <FormControl fullWidth color="secondary" >
          <input id="demo-simple-select-label"  placeholder="filter"  value={fil}
              onChange={searchtext.bind(this)}   style={{borderRadius:3,padding:13.5,color:'grey',fontFamily:'calibri',fontSize:16}}></input>
          
        </FormControl>
      </Box> 
      
}
      <div>
        {loading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "4rem",
            }}
          >
            
            <CircularProgress size={60} thickness={4.5} color="secondary" />
            
          </Box>
        ) : (
          <>
            {filteredReport.map((report) => {
              return (
                <div className="supervisorWiseReport">
                  {(currentRole=="ADMIN" || currentRole=="MS_COR")?
                  <ReportTemplateVerify report={report}/>
                  :
                  <ReportTemplate report={report} />
              }
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
