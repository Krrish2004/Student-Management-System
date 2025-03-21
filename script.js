// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentsTableBody = document.getElementById('studentsTableBody');
const loadingIndicator = document.getElementById('loadingIndicator');
const noStudentsMessage = document.getElementById('noStudentsMessage');
const searchInput = document.getElementById('searchInput');
const sortBySelect = document.getElementById('sortBy');
const cancelBtn = document.getElementById('cancelBtn');
const editIndexInput = document.getElementById('editIndex');

// Student data array
let students = [];
let filteredStudents = [];
let isEditing = false;

// Check if data exists in local storage
const initializeStudentData = async () => {
    showLoadingIndicator();
    
    try {
        // Simulating API call with delay
        const storedStudents = await new Promise((resolve) => {
            setTimeout(() => {
                const data = localStorage.getItem('students');
                resolve(data ? JSON.parse(data) : []);
            }, 1500); // 1.5 second delay to simulate API fetch
        });
        
        students = storedStudents;
        filteredStudents = [...students];
        renderStudentsTable();
    } catch (error) {
        console.error('Error loading student data:', error);
        alert('Failed to load student data!');
    } finally {
        hideLoadingIndicator();
    }
};

// Loading indicator functions
const showLoadingIndicator = () => {
    loadingIndicator.style.display = 'flex';
};

const hideLoadingIndicator = () => {
    loadingIndicator.style.display = 'none';
};

// Format phone number: (XXX) XXX-XXXX
const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
};

// Save data to local storage
const saveToLocalStorage = () => {
    localStorage.setItem('students', JSON.stringify(students));
};

// Add new student
const addStudent = async (studentData) => {
    showLoadingIndicator();
    
    try {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        students.push(studentData);
        filteredStudents = [...students];
        saveToLocalStorage();
        renderStudentsTable();
        
        return true;
    } catch (error) {
        console.error('Error adding student:', error);
        return false;
    } finally {
        hideLoadingIndicator();
    }
};

// Update existing student
const updateStudent = async (index, updatedData) => {
    showLoadingIndicator();
    
    try {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        students[index] = updatedData;
        filteredStudents = [...students];
        saveToLocalStorage();
        renderStudentsTable();
        
        return true;
    } catch (error) {
        console.error('Error updating student:', error);
        return false;
    } finally {
        hideLoadingIndicator();
    }
};

// Delete student
const deleteStudent = async (index) => {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    
    showLoadingIndicator();
    
    try {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        students.splice(index, 1);
        filteredStudents = [...students];
        saveToLocalStorage();
        renderStudentsTable();
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student!');
    } finally {
        hideLoadingIndicator();
    }
};

// Render students table
const renderStudentsTable = () => {
    studentsTableBody.innerHTML = '';
    
    if (filteredStudents.length === 0) {
        noStudentsMessage.style.display = 'block';
        return;
    }
    
    noStudentsMessage.style.display = 'none';
    
    filteredStudents.forEach((student, index) => {
        const tr = document.createElement('tr');
        
        // Create skills list as bullet points
        const skillsList = document.createElement('ul');
        skillsList.className = 'skills-list';
        student.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });
        
        // Create contact info
        const contactInfo = document.createElement('div');
        contactInfo.className = 'contact-info';
        contactInfo.innerHTML = `
            <span>Email: ${student.email}</span>
            <span>Phone: ${student.phone}</span>
        `;
        
        // Create action buttons
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.dataset.index = students.indexOf(student);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.index = students.indexOf(student);
        
        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(deleteBtn);
        
        // Populate the row
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.fullName}</td>
            <td>${student.rollNumber}</td>
            <td>${student.courseName}</td>
            <td></td>
            <td></td>
            <td></td>
        `;
        
        tr.children[4].appendChild(skillsList);
        tr.children[5].appendChild(contactInfo);
        tr.children[6].appendChild(actionButtons);
        
        studentsTableBody.appendChild(tr);
    });
};

// Filter students based on search input
const filterStudents = (searchTerm) => {
    if (!searchTerm) {
        filteredStudents = [...students];
    } else {
        searchTerm = searchTerm.toLowerCase();
        filteredStudents = students.filter(student => 
            student.fullName.toLowerCase().includes(searchTerm) || 
            student.rollNumber.toString().includes(searchTerm)
        );
    }
    renderStudentsTable();
};

// Sort students
const sortStudents = (sortBy) => {
    switch(sortBy) {
        case 'name':
            filteredStudents.sort((a, b) => a.fullName.localeCompare(b.fullName));
            break;
        case 'roll':
            filteredStudents.sort((a, b) => parseInt(a.rollNumber) - parseInt(b.rollNumber));
            break;
        case 'course':
            filteredStudents.sort((a, b) => a.courseName.localeCompare(b.courseName));
            break;
        default:
            break;
    }
    renderStudentsTable();
};

// Edit student form
const editStudentForm = (index) => {
    const student = students[index];
    
    document.getElementById('fullName').value = student.fullName;
    document.getElementById('rollNumber').value = student.rollNumber;
    document.getElementById('courseName').value = student.courseName;
    document.getElementById('skills').value = student.skills.join(', ');
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    
    editIndexInput.value = index;
    cancelBtn.style.display = 'block';
    isEditing = true;
    
    document.querySelector('.form-section h2').textContent = 'Edit Student';
    document.getElementById('submitBtn').textContent = 'Update';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
};

// Reset form
const resetForm = () => {
    studentForm.reset();
    editIndexInput.value = '';
    cancelBtn.style.display = 'none';
    isEditing = false;
    
    document.querySelector('.form-section h2').textContent = 'Add Student';
    document.getElementById('submitBtn').textContent = 'Submit';
};

// Validate the form
const validateForm = () => {
    const fullName = document.getElementById('fullName').value.trim();
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Basic validation
    if (!fullName || !rollNumber || !email || !phone) {
        alert('Please fill all required fields!');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return false;
    }
    
    // Phone validation - allow different formats but must have 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
        alert('Please enter a valid 10-digit phone number!');
        return false;
    }
    
    // Roll number validation - check if it's unique
    const editIndex = editIndexInput.value;
    const existingRoll = students.findIndex(student => 
        student.rollNumber === rollNumber && 
        students.indexOf(student).toString() !== editIndex
    );
    
    if (existingRoll !== -1) {
        alert('A student with this Roll Number already exists!');
        return false;
    }
    
    return true;
};

// Event Listeners using Event Delegation
document.addEventListener('DOMContentLoaded', () => {
    initializeStudentData();
    
    // Form submission
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const fullName = document.getElementById('fullName').value.trim();
        const rollNumber = document.getElementById('rollNumber').value.trim();
        const courseName = document.getElementById('courseName').value.trim();
        const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim()).filter(skill => skill);
        const email = document.getElementById('email').value.trim();
        const phone = formatPhoneNumber(document.getElementById('phone').value.trim());
        
        const studentData = {
            fullName,
            rollNumber,
            courseName,
            skills,
            email,
            phone
        };
        
        let success;
        
        if (isEditing) {
            const editIndex = parseInt(editIndexInput.value);
            success = await updateStudent(editIndex, studentData);
        } else {
            success = await addStudent(studentData);
        }
        
        if (success) {
            resetForm();
        }
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', resetForm);
    
    // Table actions using event delegation
    studentsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            editStudentForm(index);
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteStudent(index);
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        filterStudents(e.target.value);
    });
    
    // Sort functionality
    sortBySelect.addEventListener('change', (e) => {
        sortStudents(e.target.value);
    });
}); 