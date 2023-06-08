import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import StudentRow, { StudentData } from "./StudentRow";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const BusComponent: React.FC = () => {
  const { routeName } = useParams();
  let encodedRouteName = encodeURIComponent(routeName || "");
  const socket = io(`http://localhost:5000/ws/route/${encodedRouteName}`);
  const [studentData, setStudentData] = useState<StudentData[]>([]);

  const sendUpdate = async (id: string, boarded: boolean) => {
    socket.emit("boarded", JSON.stringify({ id, boarded }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/route/${routeName}`
        );
        const jsonData = await response.json();
        setStudentData(
          jsonData.map((student: StudentData) => ({
            id: student.id,
            name: student.name,
            route: student.route,
            grade: student.grade,
            method: student.method,
            school_attendance: student.school_attendance,
            boarded: student.boarded,
            presentCount: 0,
            totalCount: jsonData.length,
          }))
        );
      } catch (error) {
        console.error("Error:", error);
      }

      socket.on("boarded", (data: string) => {
        let parsedData = JSON.parse(data);
        console.log("data", parsedData);
        console.log("data id ", parsedData.id);
        setStudentData((prevStudentData: StudentData[]) => {
          const updatedStudentData = [...prevStudentData];
          // get the index of the student with the matching id
          //
          let index = updatedStudentData.findIndex(
            (student) => student.id === parsedData.id
          );
          console.log("index", index);
          const [markedStudent] = updatedStudentData.splice(index, 1);
          markedStudent.boarded = parsedData.boarded;
          console.log("student", markedStudent);
          updatedStudentData.push(markedStudent);
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
    };

    fetchData();
  }, []);

  const markStudentPresent = (index: number) => {
    const markedStudent = studentData[index];
    sendUpdate(markedStudent.id, true);
    return true;
  };

  const markStudentAbsent = (index: number) => {
    const markedStudent = studentData[index];
    sendUpdate(markedStudent.id, false);
    return true;
  };

  if (studentData[0]) {
    studentData[0].presentCount = studentData.filter(
      (student) => student.boarded
    ).length;
  }

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
      {
        <>
          <h3>Students:</h3>
          <ul>
            {studentData.map((student, index) => (
              <StudentRow
                key={index}
                student={student}
                markPresent={() => markStudentPresent(index)}
                markAbsent={() => markStudentAbsent(index)}
              />
            ))}
          </ul>
        </>
      }
    </div>
  );
};

export default BusComponent;
