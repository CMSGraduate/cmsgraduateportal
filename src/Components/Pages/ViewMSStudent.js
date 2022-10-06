import React, { useEffect, useState } from "react";
import ReactToPrint from 'react-to-print';
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import synopsisService from "../../API/synopsis";
import studentService from "../../API/students";
import progressReportService from "../../API/progressReports";
import thesisService from "../../API/thesis";
import programsService from "../../API/programs";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../../Components/UI/ActiveTab.css";
import ReportTemplate from "../UI/ReportTemplate";
import ReportTemplateVerify from "../UI/ReportTemplateVerify"
import { useSelector, useDispatch } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import { Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auto } from "@popperjs/core";
const columns = [
  {
    field: "Regno",
    headerName: "Registration No",
    flex: 1,
  },
  {
    field: "Name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "Program",
    headerName: "Program",
    flex: 1,
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
  },

  {
    
      field: "Action",
      headerName: "Action",
      flex: 3,
      editable: false,
      renderCell: Handlebutton,
    
  },
];
function Handlebutton(row) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
    
      <div>
          <Button
        variant="contained"
        style={{backgroundColor:"#000", color:"#fff", marginLeft: 16}}
        size="small"
        onClick={handleOpen}
         
      >
        View Data
      </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

         <div className="supervisorWiseReport" style={{overflow:'auto',maxHeight:"80%",maxWidth:"80%",marginLeft:"10%",marginTop:'5%'}}>
                  {(row.row.role=="ADMIN" || row.row.role=="MS_COR")?
                  <>
                 <Button variant="white"  onClick={handleClose} value={'X'} style={{marginLeft:'95%',color:'white'}} >X</Button>

                  <ReportTemplateVerify report={row.row.report}
                  
                  />
                  </>
                  :
                  <>
                 <Button variant="white"  onClick={handleClose} value={'X'} style={{marginLeft:'95%',color:'white'}} >X</Button>

                  <ReportTemplate report={row.row.report} />
                  </>
              }
        </div>
      </Modal>

    </>
  );
}



const DataTable =React.forwardRef(() =>{
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [autocompleteValue1, setAutocompleteValue1] = useState(null);
  const [autocompleteValue2, setAutocompleteValue2] = useState(null);
  const [autocompleteValue3, setAutocompleteValue3] = useState(null);
  const [autocompleteValue4, setAutocompleteValue4] = useState(null);
  const [autocompleteValue5, setAutocompleteValue5] = useState(null);
  const [selectedreg,setreg]=useState(null)
  const [selectedsem,setsem]=useState(null)
  const [selectedpro,setpro]=useState(null)
  const [selectedsyn,setsyn]=useState(null)
  const [selectedthe,setthe]=useState(null)
  const [selectedver,setver]=useState(null)
  const [students, setStudents] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [filter,setfilter]=useState('Registeration Number');
  const [fil,setfil]=useState('');
  const [Rows, setRows] = useState([]);
  const [Posts, setPosts] = useState([]);
  const [program,setprogram]=useState([]);
  const [select, setSelection] = useState([]);

  //const {state}=useLocation();
  const { currentRole } = useSelector((state) => state.userRoles);
  const { user } = useSelector((state) => state.auth);
  console.log("userr",user)
  useEffect(() => {
    async function fetchData() {
      const students = await studentService.getStudents();
      const submittedSynopsis = await synopsisService.getSubmittedSynopsis();
      const submittedThesis = await thesisService.getSubmittedThesis();
      const evaluatedSynopsis=await synopsisService.getSynopsisEvaluations();
      const evaluatedThesis=await thesisService.getThesisEvaluations();
      const programs=await programsService.getPrograms();
      const { data: progressReport } = await progressReportService.getReports();
      var pro=[]
      programs.map((item,index)=>{
        if(item.programShortName.includes("MS")){
          pro[index]=item.programShortName
        }
      })
      setprogram(pro)
   
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
              (synopsise) => synopsise.schedule_id?.student_id?._id === student._id
            );
            let filteredThesisEvaluation=evaluatedThesis.filter(
              (thesise) => thesise.schedule_id?.student_id?._id === student._id
            );
         

          selectedStudents.push({
            student_id: student,
            ...(filteredProgress.length > 0 && {
              progressReport: filteredProgress[0],
            }),
            ...(filteredSynopsis.length > 0 && {
              synopsisStatus: filteredSynopsis[0].synopsisStatus,
              synopsisTitle: filteredSynopsis[0].synopsisTitle,
              creationDate:filteredSynopsis[0].creationDate
            }),
            ...(filteredThesis.length > 0 && {
              thesisStatus: filteredThesis[0].thesisStatus,
              thesisTitle: filteredThesis[0].thesisTitle,
              creationDate:filteredThesis[0].creationDate

            }),
            
            ...(filteredSynopsisEvaluation.length > 0 && {
              SynopsisEvaluation: filteredSynopsisEvaluation[0].goEvaluation?.
              finalRecommendation,
              SynopsisEvaluatedAt:filteredSynopsisEvaluation[0].creationDate

              
            }),
            ...(filteredThesisEvaluation.length > 0 && {
              ThesisEvaluation: filteredThesisEvaluation[0].goEvaluation?.
              finalRecommendation,
              ThesisEvaluatedAt:filteredThesisEvaluation[0].creationDate

            }),
          });
        }
      });

      const stds = students.filter((student) =>
        student.program_id.programShortName.toLowerCase().includes("ms")
      );
      var row=[];

      
      setStudents(stds);
      setSelectedReport(selectedStudents);
      setFilteredReport(selectedStudents);


      selectedStudents.map((val, id) => {
        
        row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}
        
      })
      const b=row.filter((item)=>item.report.student_id?.supervisor_id?._id==user.user._id)
      setRows(b);
      

    }
    fetchData();
  }, []);
  
  const handleRegistrationNo = (selectedStudent) => {


    if (selectedStudent) {
      let report = filteredReport.filter(
        (report) => report.student_id.registrationNo === selectedStudent
      );
      setFilteredReport(report);
      var row=[]
      report.map((val, id) => {
                
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}
                
              })
              setRows(row);
      setreg(selectedStudent)
    } else {
      setFilteredReport(selectedReport);
      setAutocompleteValue(null)
      setAutocompleteValue1(null)
      setAutocompleteValue2(null)
      setAutocompleteValue3(null)
      setAutocompleteValue4(null)
      setAutocompleteValue5(null)

      var row=[]
      selectedReport.map((val, id) => {
                
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}
                
              })
              setRows(row);
    }
  };

  const handleVerified = (selectedStudent) => {

    var a;
    if(selectedStudent=="Yes"){
      a=true
    }
    else{
      a=false

    }
    if (selectedStudent=="Yes") {
      let report = filteredReport.filter(
        (report) => report.student_id.verified==true
      );
      if(report.length!=0){
        setFilteredReport(report);

      }
      var row=[]
              report.map((val, id) => {
                
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}
                
              })
              setRows(row);
              setver(true)

    } else if(selectedStudent=="No") {
      let report = filteredReport.filter(
        (report) => report.student_id.verified!=true
      );
      if(report.length!=0){
        setFilteredReport(report);

      }
            var row=[]
      report.map((val, id) => {
                
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}
                
              })
              setRows(row);
              setver(false)

    } else {
      let report = filteredReport.filter(
        (report) => report.student_id.verified!=null
      );
      setFilteredReport(report);
      var row=[]
      report.map((val, id) => {
                
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}
                
              })
              setRows(row);
              setAutocompleteValue(null)

      setAutocompleteValue1(null)
     
    }
  };

  const handleSynopsis = (selectedStudent) => {
    if (selectedStudent) {
      let report = filteredReport.filter(
        (report) => report.SynopsisEvaluation==selectedStudent+""
      );
      if(report.length!=0){
        setFilteredReport(report);

      }
      var row=[]
              report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
    } else {
      let report = filteredReport.filter(
        (report) => report.SynopsisEvaluation!=""
      );
      setFilteredReport(report);
      var row=[]
      report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
              setAutocompleteValue(null)

      setAutocompleteValue2(null)
     
    }
  };
  const handleThesis = (selectedStudent) => {
    if (selectedStudent) {
      let report = filteredReport.filter(
        (report) => report.ThesisEvaluation== selectedStudent
      );
      if(report.length!=0){
        setFilteredReport(report);

      }
      var row=[]
              report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
    } else {

      let report = filteredReport.filter(
        (report) => report.ThesisEvaluation!=null
      );
      console.log("filteredreport",filteredReport)
      console.log("report",report)
      setFilteredReport(report);
      var row=[]
      report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
              setAutocompleteValue(null)

      setAutocompleteValue3(null)
    
    }
  };
  const handleSemester = (selectedStudent) => {
    if (selectedStudent) {
      let report = filteredReport.filter(
        (report) => report.student_id.Semester==selectedStudent
      );
      if(report.length!=0){
        setFilteredReport(report);

      }
      var row=[]
              report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
    } else {

      let report = filteredReport.filter(
        (report) => report.student_id.Semester!=""
      );
      setFilteredReport(report);
      var row=[]
      report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
              setAutocompleteValue(null)

      setAutocompleteValue4(null)
    }
  };

  const handleProgram = (selectedStudent) => {
    if (selectedStudent) {
      let report = filteredReport.filter(
        (report) => report.student_id.program_id.programShortName==selectedStudent
      );
      if(report.length!=0){
        setFilteredReport(report);

      }
      var row=[]
              report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
    } else {
      let report = filteredReport.filter(
        (report) => report.student_id.program_id.programShortName!=""
      );
      setFilteredReport(report);
      var row=[]
      report.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);

              setAutocompleteValue(null)

      setAutocompleteValue5(null)
    }
  };
  
  const defaultProps = {

    options: students,
    getOptionLabel: (student) => student.registrationNo || "",
  };
    const defaultverification={
      
      options:["Yes","No"]

   // getOptionLabel:,
    }
    const defaultsemester={
      
      options:[1,2,3,4,5,6]

   // getOptionLabel:,
    }
    const defaultProgram={
      
      options:program

   // getOptionLabel:,
    }
    const defaultsynopsisStatus={
      
      options:["Major Changings","Minor Changings","Not Allowed"]

   // getOptionLabel:,
    }
    

  const searchtext = (event) =>{
    setfil(event.target.value);
}
  
useEffect(() => {
  setFilteredReport(filterbySearch(selectedReport, fil));
  
},[fil
]);
const filterbySearch=(data,fil)=>{
  
  
  var a = data.filter(item =>
         item.student_id.username.toString().toLowerCase().startsWith(fil.toString().toLowerCase())     
        )
        var row=[]
              a.map((val, id) => {
                row[id]={_id:val.student_id._id,id: id, Program: val.student_id.program_id.programShortName, Regno: val.student_id.registrationNo, Name:val.student_id.username,MobileNo:val.student_id.mobile,report:val,role:currentRole}})
              setRows(row);
 return a;
 }
  
  return (
    <>
 
            
      <div style={{display:'flex',flexDirection:'row'}}>
      <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
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
                label="Registration No."
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box>
    

      <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultverification}
            id="controlled-demo"
            value={autocompleteValue1}
            onChange={(value, newValue) => {
              let verified = newValue;
              setAutocompleteValue1(newValue);
              handleVerified(verified);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Verification status"
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box> 
      <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultsynopsisStatus}
            id="controlled-demo"
            value={autocompleteValue2}
            onChange={(value, newValue) => {
              let v = newValue;
              setAutocompleteValue2(newValue);
              handleSynopsis(v);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Synopsis status"
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box> 
      <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultsynopsisStatus}
            id="controlled-demo"
            value={autocompleteValue3}
            onChange={(value, newValue) => {
              let v = newValue;
              setAutocompleteValue3(newValue);
              handleThesis(v);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Thesis status"
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box> 
      <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultsemester}
            id="controlled-demo"
            value={autocompleteValue4}
            onChange={(value, newValue) => {
              let s= newValue;
              setAutocompleteValue4(newValue);
              handleSemester(s);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Semester"
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box> 
      <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultProgram}
            id="controlled-demo"
            value={autocompleteValue5}
            onChange={(value, newValue) => {
              let p = newValue;
              setAutocompleteValue5(newValue);
              handleProgram(p);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Program"
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box> 
      </div>
        <FormControl fullWidth color="secondary" >
          <input id="demo-simple-select-label"  placeholder="Enter Name"  value={fil}
              onChange={searchtext.bind(this)}   style={{borderRadius:3,padding:13.5,color:'grey',fontFamily:'calibri',fontSize:16}}></input>
          
</FormControl>
      
      

    <div
      className="container"
      style={{ height: 700, width: "100%", padding: 20 }}
    >
      
      <div>
        <DataGrid
          style={{ height: 400, width: "100%" }}
          columns={columns}
          getRowId={(Rows) => Rows._id}
          rows={Rows}
          pageSize={50}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick

        />
      </div>
      <ReactToPrint
        trigger={() => <Button style={{ marginBottom: "10px",width:60,marginLeft:'89%',marginTop:20,backgroundColor:'darkblue'}} >
        Print
      </Button>}
        content={() => componentRef.current}
      />
      
    </div>
    </>
  );
})

export default DataTable; 