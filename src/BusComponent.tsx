import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import StudentRow from "./StudentRow";

interface BusComponentProps {
  routeName: string;
  students: string[];
}

const BusComponent: React.FC<BusComponentProps> = ({ routeName, students }) => {
  const [expanded, setExpanded] = useState(false);

  const [studentData, setStudentData] = useState(
    students.map((student) => ({
      name: student,
      isPresent: false,
      presentCount: 0,
      totalCount: students.length,
    }))
  );

  const markStudentPresent = (index: number) => {
    setStudentData((prevStudentData) => {
      const updatedStudentData = [...prevStudentData];
      const [markedStudent] = updatedStudentData.splice(index, 1);
      markedStudent.isPresent = true;
      updatedStudentData.push(markedStudent);
      const presentCount = updatedStudentData.filter(
        (student) => student.isPresent
      ).length;
      const totalCount = updatedStudentData.length;
      return updatedStudentData.map((student) => ({
        ...student,
        presentCount,
        totalCount,
      }));
    });
  };

  const markStudentAbsent = (index: number) => {
    setStudentData((prevStudentData) => {
      const updatedStudentData = [...prevStudentData];
      const [markedStudent] = updatedStudentData.splice(index, 1);
      markedStudent.isPresent = false;
      updatedStudentData.push(markedStudent);
      const presentCount = updatedStudentData.filter(
        (student) => student.isPresent
      ).length;
      const totalCount = updatedStudentData.length;
      return updatedStudentData.map((student) => ({
        ...student,
        presentCount,
        totalCount,
      }));
    });
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [
          studentData[0].presentCount,
          studentData[0].totalCount - studentData[0].presentCount,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div>
      <h2 onClick={toggleExpand}>
        Bus Route: {routeName} ({studentData[0].presentCount} /{" "}
        {studentData[0].totalCount})
        <div style={{ maxWidth: "100px", margin: "0 auto" }}>
          <Pie data={data} />
        </div>
      </h2>
      {expanded && (
        <>
          <h3>Students:</h3>
          <ul>
            {studentData.map((student, index) => (
              <StudentRow
                key={index}
                name={student.name}
                markPresent={() => markStudentPresent(index)}
                markAbsent={() => markStudentAbsent(index)}
                isPresent={student.isPresent}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default BusComponent;
