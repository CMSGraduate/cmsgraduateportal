import React, { useEffect, useState } from "react";
import "./ActiveTab.css";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Notverified from '../Pages/Notverified'
import studentService from "../../API/students";
import {
  MsStudentListitems,
  PhdStudentListitems,
  verifiedlist
} from "../SidebarListItems/studentList";
import { adminListitems } from "../SidebarListItems/adminList";
import { gacListitems } from "../SidebarListItems/gacList";
import { goListitems } from "../SidebarListItems/goList";
import { msListitems } from "../SidebarListItems/msList";
import { phdListitems } from "../SidebarListItems/phdList";
import { SupervisorListitems } from "../SidebarListItems/supervisorList";

export const Sidebar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isverified,setverified]=useState();
  const [list, setList] = useState([]);
  const { currentRole } = useSelector((state) => state.userRoles);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const userRole = user.user.userRole;
  console.log("userRolee",userRole);

  //var a=checkverify();
  //console.log("afteruserRolee",a);

  let userProgram;

  console.log(isLoggedIn);
  const [open, setOpen] = useState(false);

  
  let roles = [];
  userRole.forEach((item) => {
    if (item.enable) {
      roles.push(item.role);
    }
  });
  const checkUser = (item) => {
    return (
      <>
        {!item.subMenu ? (
          <>
            <div
              className={location.pathname === item.path ? "tab" : "tabhover"}
            >
              <ListItem
                key={item.text}
                button
                onClick={() => {
                  navigate(item.path);
                }}
              >
                <ListItemIcon
                  className={location.pathname === item.path && "icon"}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{ fontSize: "6px" }} primary={item.text} />
              </ListItem>
            </div>
          </>
        ) : (
          <>
            <ListItem
              key={item.text}
              className="tabhover"
              onClick={() => {
                item.active = !item.active;
                setOpen(!open);
                // console.log(item.active);
              }}
            >
              <ListItemIcon>
                {item.active ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            <Collapse in={item.active} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item?.subMenu.map((subItem) => {
                  return (
                    <div
                      className={
                        location.pathname === subItem.path ? "tab" : "tabhover"
                      }
                    >
                      <ListItem
                        key={subItem.text}
                        button
                        onClick={() => {
                          navigate(subItem.path);
                        }}
                      >
                        <ListItemIcon
                          className={
                            location.pathname === subItem.path && "icon"
                          }
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    </div>
                  );
                })}
              </List>
            </Collapse>
          </>
        )}
      </>
    );
  };

  const checkverify=async()=>{
    await studentService.verifiedData(user.user.student._id,user.user).then(res=>{
     console.log("resss",res)
     setverified(res)
     if(isverified==undefined){
     checkrole(roles[0],res);}

     return res
    }).catch(err=>{
     console.log("ererwe",err)
    })
 }
  
  

  const checkrole = async(role,isverified) => {
    console.log("function casll");
    console.log("rolesss==isverified" + isverified);

    console.log("rolesss==" + roles[0]);
    if(roles[0]=="STUDENT"){

      console.log("helooo111")
    }
    switch (role) {
      case "ADMIN":
        setList(adminListitems);
        navigate("/Dashboard/HomeAdmin");
        break;

      case "GAC":
        setList(gacListitems);
        navigate("/Dashboard/HomeGac");
        break;

      case "GO":
        setList(goListitems);
        navigate("/Dashboard/HomeGo");
        break;

      case "MS_COR":
        setList(msListitems);
        navigate("/Dashboard/HomeMsCor");
        break;
      case "PHD_COR":
        setList(phdListitems);
        navigate("/Dashboard/HomePhDCor");
        break;
      case "SUPERVISOR":
        setList(SupervisorListitems);
        navigate("/Dashboard/HomeSupervisor");
        break;
      case "STUDENT":
        console.log("gekkis",props.isverified)
        if (userProgram?.toLowerCase().includes("ms") && isverified==true ) {
          console.log("isverifie",isverified)

          
          console.log("in syudent veridyf plsu sidelist")
          setList(MsStudentListitems);
          navigate("/Dashboard/HomeMs");
        } else if (userProgram?.toLowerCase().includes("phd") && isverified==true) {
          console.log("isverifie",isverified)
          
          setList(PhdStudentListitems);
          navigate("/Dashboard/HomePhd");
        }else if(userProgram?.toLowerCase().includes("ms") && isverified==false){
          console.log("helllo in syudent veridyf plsu sidelist")

          setList(verifiedlist);
          navigate("/Dashboard/HomeMSS");
        }
        else if(userProgram?.toLowerCase().includes("phd") && isverified==false){
          console.log("helllo in syudent veridyf plsu sidelist")

          setList(verifiedlist);
          navigate("/Dashboard/HomeePHD");
        }
        break;
      default:
        
          console.log("in defaullsdb syudent veridyf plsu sidelist")

        
    }
  };

  if (roles[0] === "STUDENT") {
    userProgram = user?.user?.student?.program_id?.programShortName;
    checkverify()
  }
  useEffect(async() => {
    
    checkrole(currentRole);
  }, [currentRole]);

  useEffect(async() => {
     
    checkrole(roles[0]);
  },[]);

  return <>{isLoggedIn && list.map(checkUser)}</>;
};
