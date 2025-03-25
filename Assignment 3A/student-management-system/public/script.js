document.addEventListener('DOMContentLoaded', function() {
  fetchStudentList();
});

// Fetch and display all students
function fetchStudentList() {
  fetch('/students')
    .then(response => response.json())
    .then(data => {
      displayStudents(data, 'studentList');
    })
    .catch(error => console.error('Error fetching student data:', error));
}

// Generic function to display students in a given container
function displayStudents(students, containerId) {
  const container = document.getElementById(containerId);
  if (students.length == 0) {
    container.innerHTML = '<p>No students found.</p>';
    return;
  }
  
  let html = '<table>';
  html += '<thead><tr><th>Name</th><th>Age</th><th>Class</th><th>Roll Number</th></tr></thead><tbody>';
  students.forEach(student => {
    html += `<tr>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.studentClass}</td>
      <td>${student.rollNumber}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Search functionality: fetch student info by roll number
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('searchInput').value;
  fetch(`/search?rollNumber=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(results => {
      displayStudents(results, 'searchResults');
    })
    .catch(error => console.error('Error fetching search results:', error));
});
