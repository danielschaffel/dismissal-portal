import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import io from "socket.io-client";
import { StudentData } from "./StudentRow";

interface AdminRouteDisplayProps {
    routeName: string;
}
const AdminRouteDisplay: React.FC<AdminRouteDisplayProps> = ({ routeName }) => {
  let encodedRouteName = encodeURIComponent(routeName || "");
  const socket = io(`http://localhost:5000/ws/route/${encodedRouteName}`);

  const [studentData, setStudentData] = useState<StudentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/route/${routeName}`
        );
        const jsonData = await response.json() as StudentData[];
          const presentCount = jsonData.filter(
            (student) => student.boarded
          ).length;
        setStudentData(
          jsonData.map((student: StudentData) => ({
            id: student.id,
            name: student.name,
            route: student.route,
            grade: student.grade,
            method: student.method,
            school_attendance: student.school_attendance,
            boarded: student.boarded,
            presentCount: presentCount,
            totalCount: jsonData.length,
          }))
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }


    fetchData();
  }, []
  );

  socket.on("boarded", (data: string) => {
    let parsedData = JSON.parse(data);
    setStudentData((prevStudentData: StudentData[]) => {
      const updatedStudentData = [...prevStudentData];
      // get the index of the student with the matching id
      //
      let index = updatedStudentData.findIndex(
        (student) => student.id === parsedData.id
      );
      const markedStudent = updatedStudentData[index];
      markedStudent.boarded = parsedData.boarded;
      const presentCount = updatedStudentData.filter(
        (student) => student.boarded
      ).length;
      const totalCount = updatedStudentData.length;
      return updatedStudentData.map((student) => ({
        ...student,
        presentCount,
        totalCount,
      }));
    });
  });

  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [
          studentData[0]?.presentCount,
          studentData[0]?.totalCount - studentData[0]?.presentCount,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  if (!studentData[0]) {
    return <div>"loading..."</div>;
  }
  return (
    <div>
      <h2>
        Bus Route: {routeName} ({studentData[0]?.presentCount} /{" "}
        {studentData[0]?.totalCount})
        <div style={{ maxWidth: "100px", margin: "0 auto" }}>
          <Pie data={data} />
        </div>
      </h2>
      </div>
      )
};

const AdminDisplay: React.FC = () => {
    // get all of the routes
    // create the chart for each chart
    // display the charts with the name of the routes
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/routes"); // Replace '/api/data' with your backend API endpoint
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    };


    fetchData();
  }, []);


    if (!data) {
      return <div>"loading..."</div>;
    }

    return (
    <>
    {data.map((route: string) => (
        <AdminRouteDisplay routeName={route} />
    ))}
    </>
    )
}

export default AdminDisplay;
