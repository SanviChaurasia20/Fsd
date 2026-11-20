
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Initial enrollment records
let enrollments = [
    {
        id: 601,
        studentName: "Aarav Gupta",
        courseCode: "CS301",
        courseName: "Data Structures",
        semester: 3,
        attendance: 82
    },
    {
        id: 602,
        studentName: "Meera Joshi",
        courseCode: "CS305",
        courseName: "Database Systems",
        semester: 3,
        attendance: 74
    },
    {
        id: 603,
        studentName: "Kabir Khan",
        courseCode: "CS310",
        courseName: "Computer Networks",
        semester: 3,
        attendance: 91
    }
];

// Validate enrollment data
function validateEnrollment(data) {
    const { studentName, courseCode, courseName, semester, attendance } = data;

    return (
        typeof studentName === 'string' && studentName.trim() !== '' &&
        typeof courseCode === 'string' && courseCode.trim() !== '' &&
        typeof courseName === 'string' && courseName.trim() !== '' &&
        Number.isInteger(semester) && semester > 0 &&
        typeof attendance === 'number' &&
        attendance >= 0 && attendance <= 100
    );
}

// Home route
app.get('/', (req, res) => {
    res.send('Student Course Enrollment API is running!');
});

// GET all enrollments
app.get('/api/enrollments', (req, res) => {
    res.status(200).json(enrollments);
});

// POST new enrollment
app.post('/api/enrollments', (req, res) => {
    if (!validateEnrollment(req.body)) {
        return res.status(400).json({
            message: 'Invalid input data'
        });
    }

    const newEnrollment = {
        id: Math.max(...enrollments.map(e => e.id), 600) + 1,
        ...req.body
    };

    enrollments.push(newEnrollment);

    res.status(201).json(newEnrollment);
});

// GET low attendance enrollments
app.get('/api/enrollments/low-attendance', (req, res) => {
    const lowAttendance = enrollments.filter(
        enrollment => enrollment.attendance < 75
    );

    res.status(200).json(lowAttendance);
});

// GET enrollments by semester
app.get('/api/enrollments/filter', (req, res) => {
    const semester = req.query.semester;

    const filtered = enrollments.filter(
        enrollment => enrollment.semester === Number(semester)
    );

    res.status(200).json(filtered);
});

// GET enrollment by ID
app.get('/api/enrollments/:id', (req, res) => {
    const id = Number(req.params.id);

    const enrollment = enrollments.find(e => e.id === id);

    if (!enrollment) {
        return res.status(404).json({
            message: 'Enrollment not found'
        });
    }

    res.status(200).json(enrollment);
});

// PUT update enrollment
app.put('/api/enrollments/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Enrollment not found'
        });
    }

    if (!validateEnrollment(req.body)) {
        return res.status(400).json({
            message: 'Invalid input data'
        });
    }

    enrollments[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json(enrollments[index]);
});

// DELETE enrollment
app.delete('/api/enrollments/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Enrollment not found'
        });
    }

    enrollments.splice(index, 1);

    res.status(200).json({
        message: 'Enrollment deleted successfully'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
