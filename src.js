// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Define the port
const PORT = 8000;

// Array to store student data (temporary storage)
const students = [];

// POST API to add a new student
app.post('/students', (req, res) => {
  try {
    const { name, dept, year } = req.body;

    // Validate incoming data
    if (!name || !dept || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, dept, and year',
      });
    }

    // Check if student with same name already exists
    const existingStudent = students.find((s) => s.name === name);
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this name already exists',
      });
    }

    // Create a new student object
    const newStudent = {
      id: students.length + 1,
      name,
      dept,
      year,
    };

    // Add student to array
    students.push(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding student',
    });
  }
});

// GET API to fetch student by name and store data in a JSON file
app.get('/students/:name', (req, res) => {
  try {
    const studentName = req.params.name;

    // Find student by name (case-sensitive)
    const student = students.find((s) => s.name === studentName);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Prepare JSON data for writing to file
    const studentData = {
      name: student.name,
      dept: student.dept,
      year: student.year,
    };

    // Create a JSON file with student data
    const fileName = `./data/${student.name.replace(/\s+/g, '_')}.json`;

    // Ensure 'data' directory exists
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }

    // Write data to a JSON file
    fs.writeFileSync(fileName, JSON.stringify(studentData, null, 2));

    res.status(200).json({
      success: true,
      message: `Student data stored in ${fileName}`,
      data: studentData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student data',
    });
  }
});

// Default route to handle invalid URLs
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found!',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
