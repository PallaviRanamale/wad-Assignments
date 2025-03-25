const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'students.json');

// Middleware to parse form data and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper function: Read student data from JSON file
function readStudents() {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  try {
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    return [];
  }
}

// Helper function: Write student data to JSON file
function writeStudents(students) {
  fs.writeFileSync(dataFile, JSON.stringify(students, null, 2));
}

// Route to add a new student
app.post('/add-student', (req, res) => {
  const { name, age, studentClass, rollNumber } = req.body;
  const students = readStudents();
  students.push({ name, age, studentClass, rollNumber });
  writeStudents(students);
  res.redirect('/');
});

// API route to return all students as JSON
app.get('/students', (req, res) => {
  const students = readStudents();
  res.json(students);
});

// API route to search for a student by roll number
// app.get('/search', (req, res) => {
//   const query = req.query.rollNumber;
//   if (!query) {
//     return res.json([]);
//   }
//   const students = readStudents();
//   // Filter for an exact match on rollNumber (comparison as string)
//   const results = students.filter(student => student.rollNumber === query);
//   res.json(results);
// });

// API route to search for a student by roll number
app.get('/search', (req, res) => {
    const query = req.query.rollNumber;
    if (!query) {
      return res.json([]);
    }
    const students = readStudents();
    // Convert both stored rollNumber and query to strings and trim any extra spaces
    const results = students.filter(student => 
      String(student.rollNumber).trim() === query.trim()
    );
    res.json(results);
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
