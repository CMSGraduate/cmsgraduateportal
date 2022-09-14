import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const ReportTemplate = ({ report, reportType }) => {
  const navigate=useNavigate();
  const { currentRole } = useSelector((state) => state.userRoles);
  const [open,setOpen]=useState(false)
  console.log("student",report)
  const toggle = () => {
    setOpen(!open);
  };
  return (
    <Paper
      variant="outlined"
      elevation={3}
      key={report?.student_id?._id}
      style={{
        display: "grid",
        placeItems: "center",
        // placeContent: "center",
        marginBottom: "2rem",
      }}
    >
      {report.student_id.verified?
      <Button style={{backgroundColor:'darkgreen',borderRadius:6,marginLeft:'82%',marginTop:'2%',color:'white'}} onClick={()=>{
        navigate('/Dashboard/VerifyData',{state:{data:report}})
      }}>verified</Button>:
      currentRole=="ADMIN"?
      <Button style={{backgroundColor:'#333333',borderRadius:6,marginLeft:'82%',marginTop:'2%'}} onClick={()=>{
        navigate('/Dashboard/VerifyData',{state:{data:report}})
      }}>View Student Result</Button>
      :
      <Button style={{backgroundColor:'#333333',borderRadius:6,marginLeft:'82%',marginTop:'2%'}} onClick={()=>{
        navigate('/Dashboard/VerifyData',{state:{data:report}})
      }}>Verify Student</Button>
    }
      <table
        cellSpacing={4}
        cellPadding={6}
        style={{
          color:"#333333",
          borderCollapse:"separate",
          padding: ".5rem",
          /* margin: "1rem", */
          /* border: "2px solid #572E74",
                  borderRadius: "6px", */
        }}
      >
        <colgroup className="cols">
          <col className="col1" />
          <col className="col2" />
          <col className="col3" />
          <col className="col4" />
        </colgroup>
        <tbody>
          <tr>
            <td>
              <img
                src={
                  process.env.REACT_APP_URL + "/" + report?.student_id?.profilePicture || ""
                }
                alt="Student Profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  objectFit: "cover",
                  height: "8rem",
                  width: "8rem",
                  borderRadius: "100%",
                }}
              />
            </td>
          </tr>
          <tr
            style={{
              backgroundColor: "white",
            }}
          >
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Name
            </td>
            <td>{report?.student_id?.username}</td>
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Email
            </td>
            <td>{report?.student_id?.email}</td>
          </tr>
          <tr
            style={{
              backgroundColor: "white",
            }}
          >
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Father Name
            </td>
            <td>{report?.student_id?.fatherName}</td>
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Supervisor
            </td>
            <td>{report?.student_id?.supervisor_id?.username}</td>
          </tr>
          <tr style={{ color: "#333333", backgroundColor: "#F7F6F3" }}>
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Registration No.
            </td>
            <td>{report?.student_id?.registrationNo}</td>
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Mobile No.
            </td>
            <td>{report?.student_id?.mobile}</td>
          </tr>
          <tr
            style={{
              backgroundColor: "white",
            }}
          >
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Registration Date
            </td>
            <td>{report?.student_id?.thesisRegistration}</td>
            <td
              valign="middle"
              style={{
                backgroundColor: "#E9ECF1",
                fontWeight: "bold",
              }}
            >
              Track
            </td>
            <td>{report?.student_id?.thesisTrack}</td>
          </tr>
          {reportType ? (
            <tr
              style={{
                color: "#333333",
                backgroundColor: "#F7F6F3",
              }}
            >
              <td
                valign="middle"
                style={{
                  backgroundColor: "#E9ECF1",
                  fontWeight: "bold",
                }}
              >
                {reportType === "Synopsis" ? (
                  <>Synopsis Status</>
                ) : (
                  <>Thesis Status</>
                )}
              </td>
              <td>
                {reportType === "Synopsis" ? (
                  <> {report?.synopsisStatus}</>
                ) : (
                  <> {report?.thesisStatus}</>
                )}
              </td>
              <td
                valign="middle"
                style={{
                  backgroundColor: "#E9ECF1",
                  fontWeight: "bold",
                }}
              >
                {reportType === "Synopsis" ? (
                  <>Synopsis Title</>
                ) : (
                  <>Thesis Title</>
                )}
              </td>
              <td>
                {reportType === "Synopsis" ? (
                  <> {report?.synopsisTitle}</>
                ) : (
                  <> {report?.thesisTitle}</>
                )}
              </td>
            </tr>
          ) : (
            <>
              <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                }}
              >
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Synopsis Status
                </td>
                <td>{report.synopsisStatus || " - "}</td>
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Synopsis Title
                </td>
                <td>{report.synopsisTitle || " - "}</td>
              </tr>

              <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                }}
              >
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Thesis Status
                </td>
                <td>{report.thesisStatus || " - "}</td>
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Thesis Title
                </td>
                <td>{report.thesisTitle || " - "}</td>
              </tr>

              <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                }}
              >
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Status
                </td>
                <td>{report?.progressReport?.status || " - "}</td>
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Comments
                </td>
                <td>{report?.progressReport?.comment || " - "}</td>
              </tr>
              <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                }}
              >
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Synopsis Evaluation
                </td>
                <td>Successfull</td>
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Thesis Evaluation
                </td>
                <td>Successfull</td>
              </tr>
              <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                }}
              >
                <td
                  valign="middle"
                  onClick={toggle}
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Result
                </td>
                
               
              </tr>
              {open && (
      <div className="toggle">
        {console.log("gehhi",report.student_id.Result)}
        {(report.student_id.Result).map((item,index)=>(
            <div 
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                }}
              >
                <div       
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",
                  display:'flex',flexDirection:'row'
                }}           
>
                <div
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Semester
                </div>
                <div>{item.semester}</div>
                <div
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Freeze
                </div>
                {item.Freeze?
                <div>Semester Freezed</div>
                :
                <div>No</div>
                } 
                </div>

                {(item.Result).map((it,index)=>(
                  <div style={{display:'flex',flexDirection:'column'}}>
                  <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",}}
              >
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Subject
                </td>
                <td>{it.Subject} ({it.Rank})</td>
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Absent
                </td>
                {it.absent?
                <td>Yes</td>:

                <td>No</td>
                
                }
                </tr>

                <tr
                style={{
                  color: "#333333",
                  backgroundColor: "#F7F6F3",}}
              >
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  GPA
                </td>
                <td>{it.GPA}</td>
                <td
                  valign="middle"
                  style={{
                    backgroundColor: "#E9ECF1",
                    fontWeight: "bold",
                  }}
                >
                  Instructor
                </td>
                
                <td>{it.Instructor}</td>
                
              
                </tr>
</div>

              ))}
                
                  
                </div>

                ))}
      </div>
    )}
            </>
          )}
        </tbody>
      </table>
    </Paper>
  );
};

export default ReportTemplate;
