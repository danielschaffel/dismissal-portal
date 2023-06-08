export interface StudentData {
  id: string;
  name: string;
  route: string;
  grade: string;
  method: string;
  school_attendance: string;
  boarded: boolean;
  presentCount: number;
  totalCount: number;
}

interface StudentRowProps {
  student: StudentData;
  markPresent: () => void;
  markAbsent: () => void;
}

const StudentRow: React.FC<StudentRowProps> = ({
  student,
  markPresent,
  markAbsent,
}) => {
  let buttonAction;
  if (student.boarded) {
    buttonAction = markAbsent;
  } else {
    buttonAction = markPresent;
  }
  return (
    <li className={`student-row ${student.boarded ? "present" : ""}`}>
      {student.name} - {student.boarded ? "Present" : "Absent"}
      <button className="present-button" onClick={buttonAction}>
        {student.boarded ? "Mark Absent" : "Mark Present"}
      </button>
    </li>
  );
};

export default StudentRow;
