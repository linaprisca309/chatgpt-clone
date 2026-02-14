// Admin Dashboard Script
let currentadminUser = null;
let currentApplicationId = null;

document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('adminLoggedIn');
    if (savedUser) {
        currentadminUser = savedUser;
        showDashboard();
    } else {
        showLoginScreen();
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    loadDashboardData();
});

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'admin' && password === 'admin123') {
        currentadminUser = username;
        localStorage.setItem('adminLoggedIn', username);
        showDashboard();
        alert('Login successful!');
    } else {
        alert('Invalid credentials. Demo: admin / admin123');
        document.getElementById('login-form').reset();
    }
}

function showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const adminDash = document.getElementById('admin-dashboard');
    if (loginScreen) loginScreen.classList.add('active');
    if (adminDash) adminDash.classList.remove('active');
}

function showDashboard() {
    const loginScreen = document.getElementById('login-screen');
    const adminDash = document.getElementById('admin-dashboard');
    if (loginScreen) loginScreen.classList.remove('active');
    if (adminDash) adminDash.classList.add('active');
    
    const usernameSpan = document.getElementById('admin-username');
    if (usernameSpan) usernameSpan.textContent = currentadminUser;
    
    loadDashboardData();
    showTab('dashboard');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentadminUser = null;
        localStorage.removeItem('adminLoggedIn');
        showLoginScreen();
        const form = document.getElementById('login-form');
        if (form) form.reset();
    }
}

function showTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));

    const tab = document.getElementById(tabName + '-tab');
    if (tab) tab.classList.add('active');

    if (event && event.target) {
        const link = event.target.closest('.sidebar-link');
        if (link) link.classList.add('active');
    }

    if (tabName === 'admissions') loadApplications();
    else if (tabName === 'messages') loadMessages();
    else if (tabName === 'courses') loadCourses();
    else if (tabName === 'statistics') loadStatistics();
}

function loadDashboardData() {
    const admissions = JSON.parse(localStorage.getItem('admissions')) || [];
    const appEl = document.getElementById('total-applications');
    if (appEl) appEl.textContent = admissions.length;

    const messages = JSON.parse(localStorage.getItem('contact-messages')) || [];
    const msgEl = document.getElementById('total-messages');
    if (msgEl) msgEl.textContent = messages.length;

    const recentApps = document.getElementById('recent-apps');
    if (recentApps) {
        recentApps.innerHTML = '';
        if (admissions.length === 0) {
            recentApps.innerHTML = '<p class="empty-state">No applications yet</p>';
        } else {
            admissions.slice(0, 5).forEach(app => {
                const status = app.status || 'pending';
                const statusColor = status === 'approved' ? '#27ae60' : status === 'rejected' ? '#e74c3c' : '#f39c12';
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = '<div class="activity-info"><p>' + app.firstName + ' ' + app.lastName + '</p><p>' + app.course + '</p><p><small>' + new Date(app.date).toLocaleString() + '</small></p></div><span class="app-status" style="background-color:' + statusColor + ';">' + status.toUpperCase() + '</span>';
                recentApps.appendChild(item);
            });
        }
    }
}

function loadApplications() {
    const admissions = JSON.parse(localStorage.getItem('admissions')) || [];
    const appsList = document.getElementById('applications-list');
    if (!appsList) return;

    if (admissions.length === 0) {
        appsList.innerHTML = '<p class="empty-state">No applications received yet</p>';
        return;
    }

    appsList.innerHTML = '';
    admissions.forEach(app => {
        const status = app.status || 'pending';
        const statusClass = status === 'approved' ? 'status-approved' : status === 'rejected' ? 'status-rejected' : 'status-pending';
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        
        const item = document.createElement('div');
        item.className = 'app-item';
        item.style.cursor = 'pointer';
        item.onclick = () => openApplicationModal(app);
        item.innerHTML = '<div class="app-item-header"><h3>' + app.firstName + ' ' + app.lastName + '</h3><span class="app-status ' + statusClass + '">' + statusText + '</span></div><div class="app-item-content"><p><strong>Email:</strong> ' + app.email + '</p><p><strong>Phone:</strong> ' + app.phone + '</p><p><strong>School:</strong> ' + app.course + '</p><p><strong>Date:</strong> ' + new Date(app.date).toLocaleDateString() + '</p></div>';
        appsList.appendChild(item);
    });
}

function filterAdmissions() {
    const searchInput = document.getElementById('admissions-search');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const admissions = JSON.parse(localStorage.getItem('admissions')) || [];
    const appsList = document.getElementById('applications-list');

    const filtered = admissions.filter(app => 
        app.firstName.toLowerCase().includes(searchTerm) ||
        app.lastName.toLowerCase().includes(searchTerm) ||
        app.email.toLowerCase().includes(searchTerm)
    );

    appsList.innerHTML = '';
    if (filtered.length === 0) {
        appsList.innerHTML = '<p class="empty-state">No applications found</p>';
        return;
    }

    filtered.forEach(app => {
        const status = app.status || 'pending';
        const statusClass = status === 'approved' ? 'status-approved' : status === 'rejected' ? 'status-rejected' : 'status-pending';
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        
        const item = document.createElement('div');
        item.className = 'app-item';
        item.style.cursor = 'pointer';
        item.onclick = () => openApplicationModal(app);
        item.innerHTML = '<div class="app-item-header"><h3>' + app.firstName + ' ' + app.lastName + '</h3><span class="app-status ' + statusClass + '">' + statusText + '</span></div><div class="app-item-content"><p><strong>Email:</strong> ' + app.email + '</p><p><strong>School:</strong> ' + app.course + '</p><p><strong>Date:</strong> ' + new Date(app.date).toLocaleDateString() + '</p></div>';
        appsList.appendChild(item);
    });
}

function openApplicationModal(app) {
    currentApplicationId = app.id;
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    const courseNames = {'engineering': 'School of Engineering', 'accounting': 'School of Accounting', 'business': 'School of Business', 'health': 'School of Health Sciences'};
    const qualificationNames = {'high-school': 'High School Diploma', 'bachelor': 'Bachelor\'s Degree', 'diploma': 'Diploma', 'other': 'Other'};

    const status = app.status || 'pending';
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    const statusColor = status === 'approved' ? '#27ae60' : status === 'rejected' ? '#e74c3c' : '#f39c12';

    modalBody.innerHTML = '<p><strong>Current Status:</strong> <span style="color:' + statusColor + '; font-weight: bold;">' + statusText + '</span></p><hr style="margin: 10px 0;"><p><strong>Name:</strong> ' + app.firstName + ' ' + app.lastName + '</p><p><strong>Email:</strong> ' + app.email + '</p><p><strong>Phone:</strong> ' + app.phone + '</p><p><strong>Age:</strong> ' + app.age + '</p><p><strong>Date of Birth:</strong> ' + new Date(app.dob).toLocaleDateString() + '</p><p><strong>Preferred School:</strong> ' + (courseNames[app.course] || app.course) + '</p><p><strong>Previous Qualification:</strong> ' + (qualificationNames[app.qualification] || app.qualification) + '</p><p><strong>Additional Information:</strong> ' + (app.message || 'N/A') + '</p><p><strong>Application Date:</strong> ' + new Date(app.date).toLocaleString() + '</p>' + (app.statusUpdatedDate ? '<p><small><strong>Status Updated:</strong> ' + new Date(app.statusUpdatedDate).toLocaleString() + '</small></p>' : '');

    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.add('active');
}

function approveApp() {
    if (currentApplicationId) {
        let admissions = JSON.parse(localStorage.getItem('admissions')) || [];
        const appIndex = admissions.findIndex(a => a.id === currentApplicationId);
        
        if (appIndex !== -1) {
            admissions[appIndex].status = 'approved';
            admissions[appIndex].statusUpdatedDate = new Date().toISOString();
            localStorage.setItem('admissions', JSON.stringify(admissions));
            
            alert('✓ Application APPROVED!\n\nApplicant: ' + admissions[appIndex].firstName + ' ' + admissions[appIndex].lastName);
            closeModal();
            loadApplications();
            loadDashboardData();
        }
    }
}

function rejectApp() {
    if (currentApplicationId) {
        let admissions = JSON.parse(localStorage.getItem('admissions')) || [];
        const appIndex = admissions.findIndex(a => a.id === currentApplicationId);
        
        if (appIndex !== -1) {
            admissions[appIndex].status = 'rejected';
            admissions[appIndex].statusUpdatedDate = new Date().toISOString();
            localStorage.setItem('admissions', JSON.stringify(admissions));
            
            alert('✗ Application REJECTED!\n\nApplicant: ' + admissions[appIndex].firstName + ' ' + admissions[appIndex].lastName);
            closeModal();
            loadApplications();
            loadDashboardData();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.remove('active');
    currentApplicationId = null;
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('contact-messages')) || [];
    const messagesList = document.getElementById('messages-list');
    if (!messagesList) return;

    if (messages.length === 0) {
        messagesList.innerHTML = '<p class="empty-state">No messages received yet</p>';
        return;
    }

    messagesList.innerHTML = '';
    messages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'message-item';
        item.innerHTML = '<div class="message-item-header"><h4>' + msg.name + '</h4><span class="message-time">' + new Date(msg.date).toLocaleDateString() + '</span></div><p class="message-subject"><strong>' + msg.subject + '</strong></p><p class="message-text">' + msg.message + '</p><p><strong>Email:</strong> ' + msg.email + '</p>';
        messagesList.appendChild(item);
    });
}

function filterMessages() {
    const searchInput = document.getElementById('messages-search');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const messages = JSON.parse(localStorage.getItem('contact-messages')) || [];
    const messagesList = document.getElementById('messages-list');

    const filtered = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm) ||
        msg.subject.toLowerCase().includes(searchTerm) ||
        msg.message.toLowerCase().includes(searchTerm)
    );

    messagesList.innerHTML = '';
    if (filtered.length === 0) {
        messagesList.innerHTML = '<p class="empty-state">No messages found</p>';
        return;
    }

    filtered.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'message-item';
        item.innerHTML = '<div class="message-item-header"><h4>' + msg.name + '</h4><span class="message-time">' + new Date(msg.date).toLocaleDateString() + '</span></div><p class="message-subject"><strong>' + msg.subject + '</strong></p><p class="message-text">' + msg.message + '</p><p><strong>Email:</strong> ' + msg.email + '</p>';
        messagesList.appendChild(item);
    });
}

function toggleAddCourse() {
    const form = document.getElementById('add-course-form');
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addNewCourse(event) {
    event.preventDefault();
    
    const school = document.getElementById('course-school').value;
    const name = document.getElementById('course-name').value;
    const description = document.getElementById('course-description').value;

    if (!school || !name) {
        alert('Please fill in all required fields');
        return;
    }

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.push({id: Date.now(), school: school, name: name, description: description, createdDate: new Date().toISOString()});

    localStorage.setItem('courses', JSON.stringify(courses));
    alert('Course added successfully!');
    event.target.reset();
    toggleAddCourse();
    loadCourses();
}

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;

    if (courses.length === 0) {
        coursesList.innerHTML = '<p class="empty-state">No custom courses added yet</p>';
        return;
    }

    coursesList.innerHTML = '';
    courses.forEach(course => {
        const item = document.createElement('div');
        item.className = 'course-item';
        item.innerHTML = '<h4>' + course.name + '</h4><p><strong>School:</strong> ' + course.school + '</p><p>' + course.description + '</p><p><strong>Added:</strong> ' + new Date(course.createdDate).toLocaleDateString() + '</p><div class="course-item-actions"><button class="btn btn-secondary" onclick="editCourse(' + course.id + ')">Edit</button><button class="btn btn-warning" onclick="deleteCourse(' + course.id + ')">Delete</button></div>';
        coursesList.appendChild(item);
    });
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        let courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses = courses.filter(c => c.id !== courseId);
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
        alert('Course deleted successfully!');
    }
}

function editCourse(courseId) {
    alert('Edit functionality coming soon!');
}

function loadStatistics() {
    const admissions = JSON.parse(localStorage.getItem('admissions')) || [];

    const appsBySchool = {};
    admissions.forEach(app => {
        const schoolMap = {'engineering': 'Engineering', 'accounting': 'Accounting', 'business': 'Business', 'health': 'Health Sciences'};
        const school = schoolMap[app.course] || app.course;
        appsBySchool[school] = (appsBySchool[school] || 0) + 1;
    });

    const schoolChart = document.getElementById('apps-by-school');
    if (schoolChart) {
        schoolChart.innerHTML = '';
        for (const [school, count] of Object.entries(appsBySchool)) {
            const item = document.createElement('div');
            item.className = 'chart-item';
            item.innerHTML = '<div class="chart-label">' + school + '</div><div class="chart-value">' + count + '</div>';
            schoolChart.appendChild(item);
        }
    }

    const appsByQual = {};
    admissions.forEach(app => {
        const qual = app.qualification || 'Unknown';
        appsByQual[qual] = (appsByQual[qual] || 0) + 1;
    });

    const qualChart = document.getElementById('apps-by-qualification');
    if (qualChart) {
        qualChart.innerHTML = '';
        for (const [qual, count] of Object.entries(appsByQual)) {
            const item = document.createElement('div');
            item.className = 'chart-item';
            const qualLabel = {'high-school': 'High School', 'bachelor': 'Bachelor', 'diploma': 'Diploma', 'other': 'Other'};
            item.innerHTML = '<div class="chart-label">' + (qualLabel[qual] || qual) + '</div><div class="chart-value">' + count + '</div>';
            qualChart.appendChild(item);
        }
    }

    const trendData = {};
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        trendData[dateStr] = 0;
    }

    admissions.forEach(app => {
        const appDate = new Date(app.date).toLocaleDateString();
        if (appDate in trendData) trendData[appDate]++;
    });

    const trendChart = document.getElementById('trend-data');
    if (trendChart) {
        trendChart.innerHTML = '';
        for (const [date, count] of Object.entries(trendData)) {
            const item = document.createElement('div');
            item.className = 'chart-item';
            item.innerHTML = '<div class="chart-label">' + date + '</div><div class="chart-value">' + count + '</div>';
            trendChart.appendChild(item);
        }
    }
}

function exportAdmissions() {
    const admissions = JSON.parse(localStorage.getItem('admissions')) || [];
    
    if (admissions.length === 0) {
        alert('No applications to export');
        return;
    }

    let csv = 'First Name,Last Name,Email,Phone,Age,Date of Birth,School,Qualification,Status,Application Date\n';
    
    admissions.forEach(app => {
        const status = app.status || 'pending';
        csv += '"' + app.firstName + '","' + app.lastName + '","' + app.email + '","' + app.phone + '",' + app.age + ',"' + app.dob + '","' + app.course + '","' + app.qualification + '","' + status + '","' + new Date(app.date).toLocaleString() + '"\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    
    alert('Export successful!');
}
