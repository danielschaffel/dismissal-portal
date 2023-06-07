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

export default StudentRow;
