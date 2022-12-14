import  React,{useEffect, useState} from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MainListItems } from "../Components/UI/Admin/sidebarList";
import { Outlet } from "react-router-dom";
import SynopsisSubmission from "../Components/Pages/SynopsisSubmission";

import ManageSupervisoryCommittee from "../Components/Pages/ManageSupervisoryCommittee";

import ChangePassword from "../Components/Pages/ChangePassword";
import ManagePrograms from "../Components/Pages/managePrograms";
import AddManageProgram from "../Components/Pages/AddManageProgram";
import AddManageSupervisoryCommittee from "../Components/Pages/AddSupervisoryCommittee";
import AddProgressReport from "../Components/Pages/AddProgressReport";
import AddSession from "../Components/Pages/AddSession";
import AddStudent from "../Components/Pages/AddStudent";

import Home from "../Components/Pages/Home";
import ManageProgressReport from "../Components/Pages/ManageProgressReport";
import ManageSession from "../Components/Pages/ManageSession";
import ManageStudent from "../Components/Pages/ManageStudent";

import ProgramWiseReports from "../Components/Pages/ProgramWiseReports";
import SendNotification from "../Components/Pages/SendNotificationPhD";
import SendNotificationAll from "../Components/Pages/SendNotificationAll";
import SendNotificationMS from "../Components/Pages/SendNotificationMS";
import EvaluateSynopsisMS from "../Components/Pages/EvaluateSynopsisMS";
import EvaluateSynopsisPhD from "../Components/Pages/EvaluateSynopsisPhD";

import SessionWiseReports from "../Components/Pages/SessionWiseReports";
import SupervisorReports from "../Components/Pages/SuperivorReports";
import SupervisorWiseReports from "../Components/Pages/SupervisorWiseReports";

import SynopsisWiseReports from "../Components/Pages/SummaryReport";
import ThesisWiseReports from "../Components/Pages/ThesisWiseReports";
import ViewFaculty from "../Components/Pages/ViewFaculty";
import ViewMSStudentDetail from "../Components/Pages/ViewMSStudentDetail";
import ViewPhDStudentDetail from "../Components/Pages/ViewPhDStudentDetail";

import ManageNotification from "../Components/Pages/managenotification";
import { Sidebar } from "../Components/UI/Sidebar";
import AvatarMenu from "../Components/UI/AvatarMenu";
import ReportsMenu from "../Components/UI/ReportsMenu";
import studentService from "../API/students";

const drawerWidth = 335;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    ...(!open && {
      whiteSpace: "noWrap",
    }),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: drawerWidth,

    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(9),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const DashboardContent = (props) => {

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [activeTab, setActiveTab] = React.useState("HOME");
  
  
  // const checkActiveTab = (tab) => {
  //   if (tab === "HOME") {
  //     return <h1 style={{ textAlign: "center" }}>Welcome! Admin</h1>;
  //   }
  //   if (tab === "MANAGE PROGRAM") {
  //     return <ManagePrograms />;
  //   }
  //   if (tab === "ADD PROGRAM") {
  //     return <AddManageProgram />;
  //   }
  //   if (tab === "MANAGE SESSION") {
  //     return <ManageSession />;
  //   }
  //   if (tab === "ADD SESSION") {
  //     return <AddSession />;
  //   }
  //   if (tab === "VIEW FACULTY") {
  //     return <ViewFaculty />;
  //   }
  //   if (tab === "MANAGE STUDENTS") {
  //     return <ManageStudent />;
  //   }
  //   if (tab === "ADD STUDENTS") {
  //     return <AddStudent />;
  //   }
  //   if (tab === "MANAGE PROGRESS REPORT") {
  //     return <ManageProgressReport />;
  //   }
  //   if (tab === "ADD PROGRESS REPORT") {
  //     return <AddProgressReport />;
  //   }
  //   if (tab === "MANAGE SUPERVISORY COMMITTEE") {
  //     return <ManageSupervisoryCommittee />;
  //   }
  //   if (tab === "ADD SUPERVISORY COMMITTEE") {
  //     return <AddManageSupervisoryCommittee />;
  //   }
  //   if (tab === "EVALUATE SYNOPSIS (MS)") {
  //     return <EvaluateSynopsisMS />;
  //   }
  //   if (tab === "EVALUATE SYNOPSIS (PhD)") {
  //     return <EvaluateSynopsisPhD />;
  //   }
  //   if (tab === "MANAGE NOTIFICATION") {
  //     return <ManageNotification />;
  //   }
  //   if (tab === "SEND NOTIFICATION (MS)") {
  //     return <SendNotificationMS />;
  //   }
  //   if (tab === "SEND NOTIFICATION (PhD)") {
  //     return <SendNotification />;
  //   }
  //   if (tab === "SEND NOTIFICATION TO ALL") {
  //     return <SendNotificationAll />;
  //   }
  //   if (tab === "VIEW MS STUDENT DETAILS") {
  //     return <ViewMSStudentDetail />;
  //   }
  //   if (tab === "VIEW PhD STUDENT DETAILS") {
  //     return <ViewPhDStudentDetail />;
  //   }
  //   if (tab === "SUPERVISOR'S REPORT") {
  //     return <SupervisorReports />;
  //   }
  //   if (tab === "PROGRAM-WISE REPORT") {
  //     return <ProgramWiseReports />;
  //   }
  //   if (tab === "SYNOPSIS-WISE REPORT") {
  //     return <SynopsisWiseReports />;
  //   }
  //   if (tab === "THESIS-WISE REPORT") {
  //     return <ThesisWiseReports />;
  //   }
  //   if (tab === "VIEW SUPERVISOR/PROGRAM-WISE REPORT") {
  //     return <SupervisorWiseReports />;
  //   }
  //   if (tab === "SESSION-WISE REPORT") {
  //     return <SessionWiseReports />;
  //   }
  //   if (tab === "CHANGE PASSWORD") {
  //     return <ChangePassword />;
  //   }
  // };
  const { user } = useSelector((state) => state.auth);
  const [isverified,setverified]=useState();
  const currentRole=user.user.userRole[0].role

  const checkverify=async()=>{

    await studentService.verifiedData(user.user.student._id,user.user).then(res=>{
     console.log("resss",res)
     setverified(res)
     
    }).catch(err=>{
     console.log("ererwe",err)
    })
 }
  useEffect(()=>{
    checkverify();
  },[isverified])
  console.log("jdsnk",currentRole)
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" /* p: [3] */ }}>
        <CssBaseline />

        <AppBar
          sx={{
            backgroundColor: "#572E74",
            /* height: "7", */
            /* my: [3],
            mx: [3],
            right: "10px", */
            /* ...(!open && { left: "70px" }), */
          }}
          position="absolute"
          open={open}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
              // height: "72px",
            }}
          >
            {/* <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton> */}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <img
                style={{ width: "250px", marginTop: ".25rem" }}
                alt="Remy Sharp"
                src="../assets/images/cui.png"
              />
              {/* {activeTab} */}
            </Typography>
            <ReportsMenu/>
            
              {console.log("studentrie",isverified)}
              {currentRole=="STUDENT" && isverified==true ?(
                   
                   <label style={{fontWeight:'bold',borderRadius:2,backgroundColor:'darkgreen',color:'white',font:14,padding:7,borderRadius:5,paddingBottom:5}}>Verified</label>
              )
              :
              <div></div>
          }
          <IconButton color="inherit">
                        <AvatarMenu />

            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          {/* <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            overflow: "scroll",
          }}
          open={open}
        > */}
          {/* <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          open={open}
        > */}
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              px: [1],
              py: [3],
            }}
          >
            {/* <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton> */}
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, marginLeft: "20px", color: "#572E74" }}
            >
              Your Options
            </Typography>
          </Toolbar>
          <Divider />
          <Box
            component="div"
            style={{
              height: `calc(100vh - 81px)`,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            <List wrap sx={{ mt: "8px", mx: [3], ...(!open && { mx: [1] }) }}>
              {console.log("ia am in dashboard")}
              <Sidebar/>
            </List>
          </Box>
        </Drawer>
        <Box
          component="div"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            pt: 6,
            pb: 6,
            marginTop: "81px",
            height: `calc(100vh - 91px)`,
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg">
            <Paper
              sx={{
                marginTop: "-80px",
                p: 4,
                display: "flex",
                flexDirection: "column",
                /* height: `calc(100vh - 110px)`,
                overflow: "auto", */
              }}
            >
              <Outlet />
            </Paper>
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default DashboardContent;
/* export default function AdminDashboard() {
  return <DashboardContent />;
} */
