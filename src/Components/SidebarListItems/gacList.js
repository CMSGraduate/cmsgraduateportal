import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import PieChartIcon from "@mui/icons-material/PieChart";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import PageviewIcon from "@mui/icons-material/Pageview";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MapIcon from "@mui/icons-material/Map";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";

import PeopleIcon from "@mui/icons-material/People";

import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";

export const gacListitems = [
  {
    text: "Home",
    icon: <HomeIcon />,
    path: "/Dashboard/HomeGac",
  },

  {
    text: "Evaluate Synopsis",
    icon: <ListIcon />,
    active: false,
    path: "/Dashboard/SendSynopsisReport",
    // subMenu: [
    //   {
    //     text: "Synopsis MS",
    //     icon: <AnalyticsIcon />,
    //     path: "/Dashboard/SendSynopsisReport",
    //   },

    //   {
    //     text: " Synopsis PhD",
    //     icon: <MapIcon />,
    //     path: "/Dashboard/SendSynopsisReport",
    //   },
    // ],
  },

  {
    text: "Evaluate Thesis",
    icon: <EditNotificationsIcon />,
    active: false,
    path: "/Dashboard/SendThesisReport",
    // subMenu: [
    //    {
    //     text: "Pending Thesis",
    //     icon: <EditNotificationsIcon />,
    //     path: "/Dashboard/PendingThesis",
    //   },

    //   {
    //     text: "Thesis MS",
    //     icon: <AnalyticsIcon />,
    //     path: "/Dashboard/EvaluateThesis(MS)",
    //   },

    //   {
    //     text: "Thesis PhD",
    //     icon: <MapIcon />,
    //     path: "/Dashboard/EvaluateThesis(PhD)",
    //   },
    // ],
  },
  {
    text: "Update Thesis/Synopsis Status",
    icon: <PersonAddIcon />,
    path: "/Dashboard/UpdateStatus",
  },

  {
    text: "Student Details",
    icon: <ListIcon />,
    active: false,
    subMenu: [
      {
        text: "MS Students",
        icon: <PageviewIcon />,
        path: "/Dashboard/ViewMSStudentDetails",
      },

      {
        text: "PhD Students",
        icon: <ContentPasteSearchIcon />,
        path: "/Dashboard/ViewPhDStudentDetails",
      },
    ],
  },

  {
    text: "Reports",
    icon: <ListIcon />,
    active: false,
    subMenu: [
      {
        text: "Processed Report",
        icon: <ScreenSearchDesktopIcon />,
        path: "/Dashboard/ProcessedReports",
      },
      {
        text: "In Process Report",
        icon: <PageviewIcon />,
        path: "/Dashboard/InprocessReports",
      },
      {
        text: "Program-Wise Report",
        icon: <LeaderboardIcon />,
        path: "/Dashboard/ProgramWiseReport",
      },

      {
        text: "Session-Wise Report",
        icon: <ScreenSearchDesktopIcon />,
        path: "/Dashboard/SessionWiseReport",
      },
      {
        text: "Supervisor Wise Report",
        icon: <PieChartIcon />,
        path: "/Dashboard/SupervisorWiseReport",
      },
      {
        text: "Summary Report",
        icon: <PieChartIcon />,
        path: "/Dashboard/summary-report",
      },
    ],
  },

  {
    text: "Change Password",
    icon: <ChangeCircleIcon />,
    path: "/Dashboard/ChangePassword",
  },
];
