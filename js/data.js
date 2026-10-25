// Apex University Student Information System (SIS) - Canonical Data Store
// Realistic enterprise university datasets

export const UNIVERSITY_CONFIG = {
  name: "Apex University",
  systemName: "Student Information & Academic Management Portal",
  currentAcademicYear: "2026-2027",
  currentTerm: "Fall Semester",
  campus: "Main University Campus",
  registrarOffice: "Office of the University Registrar & Academic Records"
};

export const INITIAL_STUDENTS = [
  {
    studentId: "U2024-CS-101",
    nationalId: "REG-94812",
    fullName: "Marcus Vance",
    department: "Computer Science",
    program: "B.S. Computer Science",
    yearLevel: "Junior (Year 3)",
    semester: 5,
    gpa: 3.88,
    email: "m.vance@apex.edu",
    status: "Active",
    creditsCompleted: 78,
    advisor: "Dr. Catherine Hayes",
    enrolledCourses: ["CS-301", "CS-302", "CS-303"]
  },
  {
    studentId: "U2024-DS-102",
    nationalId: "REG-94813",
    fullName: "Elena Rostova",
    department: "Data Science",
    program: "B.S. Data Science & Analytics",
    yearLevel: "Junior (Year 3)",
    semester: 5,
    gpa: 3.94,
    email: "e.rostova@apex.edu",
    status: "Active",
    creditsCompleted: 82,
    advisor: "Dr. Alan Turing",
    enrolledCourses: ["CS-301", "CS-303"]
  },
  {
    studentId: "U2024-SE-103",
    nationalId: "REG-94814",
    fullName: "Tariq Al-Mansoor",
    department: "Software Engineering",
    program: "B.S. Software Engineering",
    yearLevel: "Sophomore (Year 2)",
    semester: 3,
    gpa: 3.45,
    email: "t.mansoor@apex.edu",
    status: "Active",
    creditsCompleted: 46,
    advisor: "Prof. Michael Chang",
    enrolledCourses: ["CS-201", "CS-202"]
  },
  {
    studentId: "U2024-CY-104",
    nationalId: "REG-94815",
    fullName: "Chloe Bennett",
    department: "Cybersecurity",
    program: "B.S. Cybersecurity Defense",
    yearLevel: "Senior (Year 4)",
    semester: 7,
    gpa: 3.75,
    email: "c.bennett@apex.edu",
    status: "Active",
    creditsCompleted: 104,
    advisor: "Dr. Richard Falk",
    enrolledCourses: ["CS-401", "CS-302"]
  },
  {
    studentId: "U2024-IS-105",
    nationalId: "REG-94816",
    fullName: "Liam O'Connor",
    department: "Information Systems",
    program: "B.S. Information Systems",
    yearLevel: "Sophomore (Year 2)",
    semester: 3,
    gpa: 3.60,
    email: "l.oconnor@apex.edu",
    status: "Active",
    creditsCompleted: 48,
    advisor: "Prof. Sarah Jenkins",
    enrolledCourses: ["CS-201", "MATH-102"]
  },
  {
    studentId: "U2024-AI-106",
    nationalId: "REG-94817",
    fullName: "Priya Patel",
    department: "Artificial Intelligence",
    program: "B.S. Artificial Intelligence",
    yearLevel: "Senior (Year 4)",
    semester: 7,
    gpa: 3.98,
    email: "p.patel@apex.edu",
    status: "Active",
    creditsCompleted: 112,
    advisor: "Dr. Catherine Hayes",
    enrolledCourses: ["CS-401", "CS-403"]
  },
  {
    studentId: "U2024-CS-107",
    nationalId: "REG-94818",
    fullName: "David Kim",
    department: "Computer Science",
    program: "B.S. Computer Science",
    yearLevel: "Junior (Year 3)",
    semester: 5,
    gpa: 3.25,
    email: "d.kim@apex.edu",
    status: "Active",
    creditsCompleted: 70,
    advisor: "Prof. Michael Chang",
    enrolledCourses: ["CS-302", "CS-303"]
  },
  {
    studentId: "U2024-CC-108",
    nationalId: "REG-94819",
    fullName: "Sofia Ramirez",
    department: "Cloud Computing",
    program: "B.S. Cloud Infrastructure",
    yearLevel: "Freshman (Year 1)",
    semester: 1,
    gpa: 3.70,
    email: "s.ramirez@apex.edu",
    status: "Active",
    creditsCompleted: 16,
    advisor: "Dr. Alan Turing",
    enrolledCourses: ["CS-101", "MATH-102"]
  },
  {
    studentId: "U2024-CS-109",
    nationalId: "REG-94820",
    fullName: "Alexander Wright",
    department: "Computer Science",
    program: "B.S. Computer Science",
    yearLevel: "Alumnus (Graduated)",
    semester: 8,
    gpa: 3.85,
    email: "a.wright@alumni.apex.edu",
    status: "Graduated",
    creditsCompleted: 128,
    advisor: "Dr. Catherine Hayes",
    enrolledCourses: []
  },
  {
    studentId: "U2024-SE-110",
    nationalId: "REG-94821",
    fullName: "Nathan Brooks",
    department: "Software Engineering",
    program: "B.S. Software Engineering",
    yearLevel: "Junior (Year 3)",
    semester: 5,
    gpa: 2.78,
    email: "n.brooks@apex.edu",
    status: "Academic Probation",
    creditsCompleted: 64,
    advisor: "Prof. Sarah Jenkins",
    enrolledCourses: ["CS-201"]
  },
  {
    studentId: "U2024-DS-111",
    nationalId: "REG-94822",
    fullName: "Zoe Chen",
    department: "Data Science",
    program: "B.S. Data Science & Analytics",
    yearLevel: "Sophomore (Year 2)",
    semester: 3,
    gpa: 3.55,
    email: "z.chen@apex.edu",
    status: "Active",
    creditsCompleted: 50,
    advisor: "Dr. Alan Turing",
    enrolledCourses: ["CS-201", "MATH-102"]
  },
  {
    studentId: "U2024-CS-112",
    nationalId: "REG-94823",
    fullName: "Fatima Zahra",
    department: "Computer Science",
    program: "B.S. Computer Science",
    yearLevel: "Freshman (Year 1)",
    semester: 1,
    gpa: 3.65,
    email: "f.zahra@apex.edu",
    status: "Active",
    creditsCompleted: 16,
    advisor: "Dr. Catherine Hayes",
    enrolledCourses: ["CS-101", "MATH-102"]
  }
];

export const INITIAL_COURSES = [
  {
    code: "CS-101",
    title: "Introduction to Computer Science & Python",
    department: "Computer Science",
    credits: 4,
    semester: 1,
    instructor: "Dr. Evelyn Reed",
    capacity: 120,
    enrolledCount: 114,
    prerequisites: []
  },
  {
    code: "MATH-102",
    title: "Discrete Mathematics & Formal Structures",
    department: "Mathematics",
    credits: 4,
    semester: 1,
    instructor: "Prof. Arthur Miller",
    capacity: 100,
    enrolledCount: 92,
    prerequisites: []
  },
  {
    code: "CS-201",
    title: "Data Structures & Core Algorithms",
    department: "Computer Science",
    credits: 4,
    semester: 2,
    instructor: "Dr. Alan Turing",
    capacity: 90,
    enrolledCount: 86,
    prerequisites: ["CS-101"]
  },
  {
    code: "CS-202",
    title: "Computer Architecture & Hardware Organization",
    department: "Computer Engineering",
    credits: 3,
    semester: 2,
    instructor: "Prof. Michael Chang",
    capacity: 80,
    enrolledCount: 74,
    prerequisites: ["CS-101"]
  },
  {
    code: "CS-301",
    title: "Advanced Algorithm Design & Complexity",
    department: "Computer Science",
    credits: 4,
    semester: 3,
    instructor: "Dr. Catherine Hayes",
    capacity: 75,
    enrolledCount: 71,
    prerequisites: ["CS-201", "MATH-102"]
  },
  {
    code: "CS-302",
    title: "Operating Systems & Concurrency",
    department: "Computer Systems",
    credits: 4,
    semester: 3,
    instructor: "Prof. Sarah Jenkins",
    capacity: 70,
    enrolledCount: 68,
    prerequisites: ["CS-201", "CS-202"]
  },
  {
    code: "CS-303",
    title: "Relational Database Management Systems",
    department: "Data Engineering",
    credits: 4,
    semester: 3,
    instructor: "Dr. Richard Falk",
    capacity: 85,
    enrolledCount: 80,
    prerequisites: ["CS-201"]
  },
  {
    code: "CS-401",
    title: "Distributed Systems & Cloud Computing",
    department: "Cloud Computing",
    credits: 4,
    semester: 4,
    instructor: "Prof. Michael Chang",
    capacity: 60,
    enrolledCount: 57,
    prerequisites: ["CS-302"]
  },
  {
    code: "CS-402",
    title: "Compiler Construction & Formal Languages",
    department: "Computer Science",
    credits: 4,
    semester: 4,
    instructor: "Dr. Alan Turing",
    capacity: 50,
    enrolledCount: 42,
    prerequisites: ["CS-301"]
  },
  {
    code: "CS-403",
    title: "Machine Learning & Neural Architectures",
    department: "Artificial Intelligence",
    credits: 4,
    semester: 4,
    instructor: "Dr. Catherine Hayes",
    capacity: 65,
    enrolledCount: 64,
    prerequisites: ["CS-301", "CS-303"]
  }
];

export const INITIAL_EXAMS = [
  {
    id: "EXAM-101",
    courseCode: "CS-101",
    courseTitle: "Intro to Computer Science & Python",
    date: "2026-12-10",
    session: "Morning (09:00 - 12:00)",
    room: "Auditorium Hall A",
    proctor: "Dr. Evelyn Reed",
    candidates: 114,
    status: "Scheduled"
  },
  {
    id: "EXAM-102",
    courseCode: "MATH-102",
    courseTitle: "Discrete Mathematics & Formal Structures",
    date: "2026-12-11",
    session: "Afternoon (14:00 - 17:00)",
    room: "Science Complex Room 204",
    proctor: "Prof. Arthur Miller",
    candidates: 92,
    status: "Scheduled"
  },
  {
    id: "EXAM-201",
    courseCode: "CS-201",
    courseTitle: "Data Structures & Core Algorithms",
    date: "2026-12-12",
    session: "Morning (09:00 - 12:00)",
    room: "Engineering Block Hall B",
    proctor: "Dr. Alan Turing",
    candidates: 86,
    status: "Scheduled"
  },
  {
    id: "EXAM-202",
    courseCode: "CS-202",
    courseTitle: "Computer Architecture & Hardware",
    date: "2026-12-13",
    session: "Afternoon (14:00 - 17:00)",
    room: "Turing Concourse Hall C",
    proctor: "Prof. Michael Chang",
    candidates: 74,
    status: "Scheduled"
  },
  {
    id: "EXAM-301",
    courseCode: "CS-301",
    courseTitle: "Advanced Algorithm Design & Complexity",
    date: "2026-12-14",
    session: "Morning (09:00 - 12:00)",
    room: "Auditorium Hall A",
    proctor: "Dr. Catherine Hayes",
    candidates: 71,
    status: "Scheduled"
  },
  {
    id: "EXAM-302",
    courseCode: "CS-302",
    courseTitle: "Operating Systems & Concurrency",
    date: "2026-12-15",
    session: "Afternoon (14:00 - 17:00)",
    room: "Engineering Block Hall B",
    proctor: "Prof. Sarah Jenkins",
    candidates: 68,
    status: "Scheduled"
  },
  {
    id: "EXAM-303",
    courseCode: "CS-303",
    courseTitle: "Relational Database Management Systems",
    date: "2026-12-16",
    session: "Morning (09:00 - 12:00)",
    room: "Science Complex Room 204",
    proctor: "Dr. Richard Falk",
    candidates: 80,
    status: "Scheduled"
  },
  {
    id: "EXAM-401",
    courseCode: "CS-401",
    courseTitle: "Distributed Systems & Cloud Computing",
    date: "2026-12-17",
    session: "Morning (09:00 - 12:00)",
    room: "Turing Concourse Hall C",
    proctor: "Prof. Michael Chang",
    candidates: 57,
    status: "Scheduled"
  },
  {
    id: "EXAM-402",
    courseCode: "CS-402",
    courseTitle: "Compiler Construction & Formal Languages",
    date: "2026-12-18",
    session: "Afternoon (14:00 - 17:00)",
    room: "Auditorium Hall A",
    proctor: "Dr. Alan Turing",
    candidates: 42,
    status: "Scheduled"
  },
  {
    id: "EXAM-403",
    courseCode: "CS-403",
    courseTitle: "Machine Learning & Neural Architectures",
    date: "2026-12-19",
    session: "Morning (09:00 - 12:00)",
    room: "Engineering Block Hall B",
    proctor: "Dr. Catherine Hayes",
    candidates: 64,
    status: "Scheduled"
  }
];

export const INITIAL_HELP_DESK_REQUESTS = [
  {
    id: "REQ-4011",
    studentId: "U2024-CS-101",
    studentName: "Marcus Vance",
    category: "Official Degree Transcript",
    department: "Computer Science",
    urgencyScore: 9,
    deadlineDays: 1,
    status: "Pending",
    submissionDate: "2026-10-24",
    notes: "Expedited transcript requested for graduate fellowship application deadline."
  },
  {
    id: "REQ-4012",
    studentId: "U2024-SE-103",
    studentName: "Tariq Al-Mansoor",
    category: "Prerequisite Override Petition",
    department: "Software Engineering",
    urgencyScore: 8,
    deadlineDays: 2,
    status: "Pending",
    submissionDate: "2026-10-24",
    notes: "Petitioning for concurrent enrollment in CS-301 based on external internship credits."
  },
  {
    id: "REQ-4013",
    studentId: "U2024-AI-106",
    studentName: "Priya Patel",
    category: "Credit Overload Authorization",
    department: "Artificial Intelligence",
    urgencyScore: 7,
    deadlineDays: 3,
    status: "Pending",
    submissionDate: "2026-10-23",
    notes: "Requesting 22 credit term limit approval to finish dual thesis project."
  },
  {
    id: "REQ-4014",
    studentId: "U2024-CS-107",
    studentName: "David Kim",
    category: "Grade Dispute Clarification",
    department: "Computer Science",
    urgencyScore: 8,
    deadlineDays: 2,
    status: "Pending",
    submissionDate: "2026-10-23",
    notes: "Formal review request for Midterm Exam question 4 scoring in Operating Systems."
  },
  {
    id: "REQ-4015",
    studentId: "U2024-SE-110",
    studentName: "Nathan Brooks",
    category: "Academic Standing Counseling",
    department: "Software Engineering",
    urgencyScore: 6,
    deadlineDays: 4,
    status: "Pending",
    submissionDate: "2026-10-22",
    notes: "Mandatory advisor consultation regarding academic probation recovery plan."
  },
  {
    id: "REQ-4016",
    studentId: "U2024-DS-102",
    studentName: "Elena Rostova",
    category: "Minor Specialization Declaration",
    department: "Data Science",
    urgencyScore: 4,
    deadlineDays: 6,
    status: "Pending",
    submissionDate: "2026-10-21",
    notes: "Adding minor in Applied Statistics & Computational Mathematics."
  }
];

export const ELECTIVE_OPTIMIZER_ITEMS = [
  { id: "EL-1", name: "Deep Reinforcement Learning & Robotics", credits: 4, careerBenefitScore: 12 },
  { id: "EL-2", name: "Cloud Architecture & DevOps Practicum", credits: 3, careerBenefitScore: 10 },
  { id: "EL-3", name: "Ethical Hacking & Penetration Testing", credits: 3, careerBenefitScore: 9 },
  { id: "EL-4", name: "High-Performance GPU Computing", credits: 2, careerBenefitScore: 6 },
  { id: "EL-5", name: "Full-Stack Web Systems & Microservices", credits: 3, careerBenefitScore: 8 },
  { id: "EL-6", name: "Quantum Information & Cryptography", credits: 2, careerBenefitScore: 5 }
];
