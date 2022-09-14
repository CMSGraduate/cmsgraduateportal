import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ReportTemplate = ({ report, reportType }) => {
  const navigate=useNavigate();
  console.log("student",report)
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
    
      <table
        cellSpacing={4}
        cellPadding={6}
        style={{
          color: "#333333",
          borderCollapse: "separate",
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
                  process.env.REACT_APP_URL +
                    "/" +
                    report?.student_id?.profilePicture || ""
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
            </>
          )}
        </tbody>
      </table>
    </Paper>
  );
};

export default ReportTemplate;
