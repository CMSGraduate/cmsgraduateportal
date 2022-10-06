import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import DataTable from "../UI/TableUI";
import axios from "axios";

import Modal from "@mui/material/Modal";
import { Autocomplete } from "@mui/material";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import BackdropModal from "../UI/BackdropModal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,

  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ViewFaculty() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [gettoken, settoken] = useState("");
  const [facultylist, setfacultylist] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setname] = useState("");
  const [type, settype] = useState("");
  const [level, setlevel] = useState("");
  const [credits, setcredits] = useState("");
  const [faculty, setfaculty] = useState([]);
  const [users,setusers]=useState([])
  const credithours=[1,2,3,4,5,6,7,8,9]
  const typee=["RM","Core","Minor"]
  const [selectedobj, setselectedobj] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    var { token } = user;
    console.log(token);
    settoken(token);

    axios
      .get(`${process.env.REACT_APP_URL}/courses/getCourses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("testing new get data");
        console.log(response.data.courses);
        var newarr = response.data.courses.map((obj) => ({
          ...obj,
          id: obj._id,
        }));
        console.log(newarr);
        setfacultylist(newarr);
      })
      .catch((err) => console.log(err));

      axios
      .get(`${process.env.REACT_APP_URL}/admin/faculty`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("testing new get data");
        console.log(response.data.facultylist);
        var newarr = response.data.facultylist.map((obj) => ({
          ...obj,
          id: obj._id,
        }));
        console.log(newarr);
        setusers(newarr);
      })
      .catch((err) => console.log(err));
  }, []);

  function getData() {
    const user = JSON.parse(localStorage.getItem("user"));

    var { token } = user;
    console.log(token);
    settoken(token);

    axios
      .get(`${process.env.REACT_APP_URL}/courses/getCourses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("testing another get data");
        console.log(response.data.courses);
        var newarr = response.data.courses.map((obj) => ({
          ...obj,
          id: obj._id,
        }));
        console.log(newarr);
        setfacultylist(newarr);
      })
      .catch((err) => console.log(err));
  }

  const updateProgram = () => {
    var obj = {};
    if (name !== "") {
      obj.name = name;
      setname("");
    }
    else{
      obj.name=selectedobj.name
    }

    if (type !== "") {
      obj.type = type;
      settype("");
    }
    else{
      obj.type = selectedobj.type;
    }


    if (level!== "") {
      obj.level = level;
      setlevel("");
    }
    else{
      obj.level=selectedobj.level
    }
    if (faculty !== "") {
      obj.faculty = faculty;
      setfaculty("");
    }
    else{
      obj.faculty=selectedobj.Faculty
    }
    if (credits !== "") {
      obj.credits = credits;
      setcredits("");
    }
    else{
      obj.credits=selectedobj.credits
    }

   

    console.log("objss",obj);
    // alert(JSON.stringify(obj));

    axios
      .patch(
        `${process.env.REACT_APP_URL}/courses/updatecourse/` + selectedobj._id,
        obj,
        {
          headers: {
            Authorization: `Bearer ${gettoken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.msg);

        getData();
        if (response.status === 200) {
          setShowUpdateModal(true);
        }
        // alert("Faculty Updated");
      })
      .catch((err) => console.log(err));
  };

  const facultyHeader = [
    {
      field: "name",
      headerName: "Course Name",
      width: 200,
    },
    { field: "type", headerName: "CourseType", width: 200 },
    { field: "level", headerName: "Level", width: 250 },
    { field: "credits", headerName: "CreditHours", width: 120 },
    {
      field: "actions",
      headerName: "Action",
      width: 200,
      renderCell: (props) => (
        <>
          <Button
            onClick={() => {
              axios
                .delete(
                  `${process.env.REACT_APP_URL}/courses/deletecourse/` + props.row.id,
                  {
                    headers: {
                      Authorization: `Bearer ${gettoken}`,
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data.msg);

                  getData();
                  if (response.status === 200) {
                    setShowDeleteModal(true);
                  }
                  // alert("Faculty deleted");
                })
                .catch((err) => console.log(err));
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 0 }}
          >
            Delete
          </Button>

          <Button
            onClick={() => {
              setselectedobj(props.row);
              handleOpen();
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Course Name"
            variant="standard"
            color="secondary"
            focused
            style={{ width: "100%" }}
            placeholder={selectedobj.name}
            value={name}
            onChange={(event) => {
              setname(event.target.value);
            }}
          />

          
              <Autocomplete
                  className="mt-4"
                  id="tags-standard"
                  options={typee}
                  getOptionLabel={(option) => option}
                  onChange={(value, newValue) => {
                    
                    settype(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Course Type"
                      placeholder={selectedobj.type}
                      
                      size="small"
                    />
                  )}
                />
          
          <Autocomplete
                  className="mt-4"
                  single
                  id="tags-standard"
                  options={credithours}
                  getOptionLabel={(option) => option}
                  onChange={(value, newValue) => {
                    
                    setcredits(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Credit Hours"
                      placeholder={selectedobj.credits}
                      
                      size="small"
                    />
                  )}
                />

          
          <Autocomplete
                  className="mt-4"
                  multiple
                  id="tags-standard"
                  options={users}
                  getOptionLabel={(option) => option.fullName}
                  onChange={(value, newValue) => {
                    
                    setfaculty((existingValues) => ({
                      ...existingValues,
                    name:newValue.fullName}))
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Faculty Members"
                      placeholder={selectedobj.Faculty}
                      
                      size="small"
                    />
                  )}
                />

         

          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 1 }}
            onClick={(event) => {
             updateProgram();
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>

      <div style={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataTable header={facultyHeader} data={facultylist} />
      </div>
      <BackdropModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        title={"Delete!"}
      >
        Course has been Deleted.
      </BackdropModal>
      <BackdropModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        title={"Update!"}
      >
        Course has been Updated.
      </BackdropModal>
    </div>
  );
}
