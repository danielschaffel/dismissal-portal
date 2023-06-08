interface StudentRowProps {
  student: any;
  markPresent: () => void;
  markAbsent: () => void;
  isPresent: boolean;
}

const StudentRow: React.FC<StudentRowProps> = ({
  student,
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
  console.log("StudentRow", student.name);
  return (
    <li className={`student-row ${isPresent ? "present" : ""}`}>
      {student.name} - {isPresent ? "Present" : "Absent"}
      <button className="present-button" onClick={buttonAction}>
        {isPresent ? "Mark Absent" : "Mark Present"}
      </button>
    </li>
  );
};

export default StudentRow;
