import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import announcementService from "../../API/announcements";
import { viewAnnouncementHeader } from "../DummyData/DummyData";
import DataTable from "../UI/TableUI";

export default function ViewAnnouncement() {
  const [viewAnnouncementeData, setViewAnnouncementeData] = useState([]);

  const getData = async () => {
    const res = await announcementService.getAnnouncements();
    const data = res.data.map((announcement) => {
      const d = new Date(announcement.creationDate);
      return {
        id: announcement._id,
        announcement: announcement.announcement,
        date: d.toLocaleString(),
      };
    });

    setViewAnnouncementeData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const viewAnnouncementHeader = [
    {
      field: "announcement",
      headerName: "Announcement",
      width: 400,
    },
    { field: "date", headerName: "Date", width: 400 },
  ];
  return (
    <>
      <DataTable header={viewAnnouncementHeader} data={viewAnnouncementeData} />
    </>
  );
}
