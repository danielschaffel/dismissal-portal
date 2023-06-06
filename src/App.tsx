import React, { useState, useEffect, FC } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

interface StudentRowProps {
  name: string;
  markPresent: () => void;
  markAbsent: () => void;
  isPresent: boolean;
}

const StudentRow: React.FC<StudentRowProps> = ({
  name,
  markPresent,
  markAbsent,
  isPresent,
}) => {
  let buttonAction;
  if (isPresent) {
    buttonAction = markAbsent;
  } else {
    buttonAction = markPresent;
  }
  return (
    <li className={`student-row ${isPresent ? "present" : ""}`}>
      {name} - {isPresent ? "Present" : "Absent"}
      <button className="present-button" onClick={buttonAction}>
        {isPresent ? "Mark Absent" : "Mark Present"}
      </button>
    </li>
  );
};
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
function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000"); // Replace '/api/data' with your backend API endpoint
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  if (!data) {
    return <div>Loading...</div>;
  }

  // return <div>{JSON.stringify(data)}</div>;
  return (
    <div>
      <h1>Bus Information</h1>
      {Object.entries(data).map(([routeName, students]) => (
        <BusComponent
          key={routeName}
          routeName={routeName}
          students={students as string[]}
        />
      ))}
    </div>
  );
}

export default App;
