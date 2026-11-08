// ================= COMMON FUNCTIONS =================

async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return response.json();
}

function showError(error) {
    alert('Error: ' + error.message);
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

function formatDate(value) {
    if (!value) return '';
    return String(value).substring(0, 10);
}

// ================= STUDENTS CRUD =================

let studentsData = [];

async function loadStudents() {
    try {
        studentsData = await apiRequest('/api/students');

        const table = document.getElementById('studentTableBody');
        if (!table) return;

        table.innerHTML = studentsData.map(s => `
            <tr>
                <td>${s.student_id}</td>
                <td>${escapeHTML(s.student_name)}</td>
                <td>${escapeHTML(s.email)}</td>
                <td>${escapeHTML(s.phone)}</td>
                <td>${escapeHTML(s.department)}</td>
                <td>${s.graduation_year}</td>
                <td>${s.cgpa}</td>
                <td>
                    <button class="edit-btn" onclick="editStudent(${s.student_id})">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${s.student_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showError(error);
    }
}

const studentForm = document.getElementById('studentForm');

if (studentForm) {
    studentForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const id = document.getElementById('student_id').value;

        const data = {
            student_name: document.getElementById('student_name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            department: document.getElementById('department').value,
            graduation_year: document.getElementById('graduation_year').value,
            cgpa: document.getElementById('cgpa').value
        };

        try {
            await apiRequest(
                id ? `/api/students/${id}` : '/api/students',
                id ? 'PUT' : 'POST',
                data
            );

            alert(id ? 'Student updated successfully!' : 'Student added successfully!');
            resetStudentForm();
            loadStudents();
        } catch (error) {
            showError(error);
        }
    });

    loadStudents();
}

function editStudent(id) {
    const s = studentsData.find(item => item.student_id === id);
    if (!s) return;

    document.getElementById('student_id').value = s.student_id;
    document.getElementById('student_name').value = s.student_name;
    document.getElementById('email').value = s.email;
    document.getElementById('phone').value = s.phone || '';
    document.getElementById('department').value = s.department;
    document.getElementById('graduation_year').value = s.graduation_year;
    document.getElementById('cgpa').value = s.cgpa;

    document.getElementById('studentSubmitBtn').textContent = 'Update Student';
    window.scrollTo(0, 0);
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        await apiRequest(`/api/students/${id}`, 'DELETE');
        alert('Student deleted successfully!');
        loadStudents();
    } catch (error) {
        showError(error);
    }
}

function resetStudentForm() {
    if (!studentForm) return;
    studentForm.reset();
    document.getElementById('student_id').value = '';
    document.getElementById('studentSubmitBtn').textContent = 'Save Student';
}

// ================= COMPANIES CRUD =================

let companiesData = [];

async function loadCompanies() {
    try {
        companiesData = await apiRequest('/api/companies');

        const table = document.getElementById('companyTableBody');
        if (table) {
            table.innerHTML = companiesData.map(c => `
                <tr>
                    <td>${c.company_id}</td>
                    <td>${escapeHTML(c.company_name)}</td>
                    <td>${escapeHTML(c.industry)}</td>
                    <td>${escapeHTML(c.location)}</td>
                    <td>${escapeHTML(c.website)}</td>
                    <td>
                        <button class="edit-btn" onclick="editCompany(${c.company_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteCompany(${c.company_id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        const dropdown = document.getElementById('company_id');

        if (dropdown) {
            const selected = dropdown.value;
            dropdown.innerHTML = '<option value="">Select Company</option>';

            companiesData.forEach(c => {
                dropdown.innerHTML += `
                    <option value="${c.company_id}">${escapeHTML(c.company_name)}</option>
                `;
            });

            dropdown.value = selected;
        }

    } catch (error) {
        showError(error);
    }
}

const companyForm = document.getElementById('companyForm');

if (companyForm) {
    companyForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const id = document.getElementById('company_id').value;

        const data = {
            company_name: document.getElementById('company_name').value,
            industry: document.getElementById('industry').value,
            location: document.getElementById('location').value,
            website: document.getElementById('website').value
        };

        try {
            await apiRequest(
                id ? `/api/companies/${id}` : '/api/companies',
                id ? 'PUT' : 'POST',
                data
            );

            alert(id ? 'Company updated successfully!' : 'Company added successfully!');
            resetCompanyForm();
            loadCompanies();
        } catch (error) {
            showError(error);
        }
    });

    loadCompanies();
}

function editCompany(id) {
    const c = companiesData.find(item => item.company_id === id);
    if (!c) return;

    document.getElementById('company_id').value = c.company_id;
    document.getElementById('company_name').value = c.company_name;
    document.getElementById('industry').value = c.industry;
    document.getElementById('location').value = c.location || '';
    document.getElementById('website').value = c.website || '';

    document.getElementById('companySubmitBtn').textContent = 'Update Company';
    window.scrollTo(0, 0);
}

async function deleteCompany(id) {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
        await apiRequest(`/api/companies/${id}`, 'DELETE');
        alert('Company deleted successfully!');
        loadCompanies();
    } catch (error) {
        showError(error);
    }
}

function resetCompanyForm() {
    if (!companyForm) return;
    companyForm.reset();
    document.getElementById('company_id').value = '';
    document.getElementById('companySubmitBtn').textContent = 'Save Company';
}

// ================= PLACEMENT DRIVES CRUD =================

let drivesData = [];

async function loadDrives() {
    try {
        const [drives, companies] = await Promise.all([
            apiRequest('/api/drives'),
            apiRequest('/api/companies')
        ]);

        drivesData = drives;

        const companyDropdown = document.getElementById('company_id');

        if (companyDropdown) {
            const selected = companyDropdown.value;

            companyDropdown.innerHTML = '<option value="">Select Company</option>';

            companies.forEach(c => {
                companyDropdown.innerHTML += `
                    <option value="${c.company_id}">${escapeHTML(c.company_name)}</option>
                `;
            });

            companyDropdown.value = selected;
        }

        const table = document.getElementById('driveTableBody');

        if (table) {
            table.innerHTML = drivesData.map(d => `
                <tr>
                    <td>${d.drive_id}</td>
                    <td>${escapeHTML(d.company_name)}</td>
                    <td>${escapeHTML(d.job_role)}</td>
                    <td>${d.package_lpa}</td>
                    <td>${d.eligibility_cgpa}</td>
                    <td>${formatDate(d.drive_date)}</td>
                    <td>${escapeHTML(d.location)}</td>
                    <td>
                        <button class="edit-btn" onclick="editDrive(${d.drive_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteDrive(${d.drive_id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

    } catch (error) {
        showError(error);
    }
}

const driveForm = document.getElementById('driveForm');

if (driveForm) {
    driveForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const id = document.getElementById('drive_id').value;

        const data = {
            company_id: document.getElementById('company_id').value,
            job_role: document.getElementById('job_role').value,
            package_lpa: document.getElementById('package_lpa').value,
            eligibility_cgpa: document.getElementById('eligibility_cgpa').value,
            drive_date: document.getElementById('drive_date').value,
            location: document.getElementById('drive_location').value
        };

        try {
            await apiRequest(
                id ? `/api/drives/${id}` : '/api/drives',
                id ? 'PUT' : 'POST',
                data
            );

            alert(id ? 'Placement drive updated successfully!' : 'Placement drive added successfully!');
            resetDriveForm();
            loadDrives();
        } catch (error) {
            showError(error);
        }
    });

    loadDrives();
}

function editDrive(id) {
    const d = drivesData.find(item => item.drive_id === id);
    if (!d) return;

    document.getElementById('drive_id').value = d.drive_id;
    document.getElementById('company_id').value = d.company_id;
    document.getElementById('job_role').value = d.job_role;
    document.getElementById('package_lpa').value = d.package_lpa;
    document.getElementById('eligibility_cgpa').value = d.eligibility_cgpa;
    document.getElementById('drive_date').value = formatDate(d.drive_date);
    document.getElementById('drive_location').value = d.location || '';

    document.getElementById('driveSubmitBtn').textContent = 'Update Drive';
    window.scrollTo(0, 0);
}

async function deleteDrive(id) {
    if (!confirm('Are you sure you want to delete this placement drive?')) return;

    try {
        await apiRequest(`/api/drives/${id}`, 'DELETE');
        alert('Placement drive deleted successfully!');
        loadDrives();
    } catch (error) {
        showError(error);
    }
}

function resetDriveForm() {
    if (!driveForm) return;
    driveForm.reset();
    document.getElementById('drive_id').value = '';
    document.getElementById('driveSubmitBtn').textContent = 'Save Drive';
}

// ================= APPLICATIONS CRUD =================

let applicationsData = [];

async function loadApplications() {
    try {
        const [applications, students, drives] = await Promise.all([
            apiRequest('/api/applications'),
            apiRequest('/api/students'),
            apiRequest('/api/drives')
        ]);

        applicationsData = applications;

        const studentDropdown = document.getElementById('student_id');
        const driveDropdown = document.getElementById('application_drive_id');

        if (studentDropdown) {
            const selected = studentDropdown.value;
            studentDropdown.innerHTML = '<option value="">Select Student</option>';

            students.forEach(s => {
                studentDropdown.innerHTML += `
                    <option value="${s.student_id}">${escapeHTML(s.student_name)}</option>
                `;
            });

            studentDropdown.value = selected;
        }

        if (driveDropdown) {
            const selected = driveDropdown.value;
            driveDropdown.innerHTML = '<option value="">Select Placement Drive</option>';

            drives.forEach(d => {
                driveDropdown.innerHTML += `
                    <option value="${d.drive_id}">${escapeHTML(d.company_name)} - ${escapeHTML(d.job_role)}</option>
                `;
            });

            driveDropdown.value = selected;
        }

        const table = document.getElementById('applicationTableBody');

        if (table) {
            table.innerHTML = applicationsData.map(a => `
                <tr>
                    <td>${a.application_id}</td>
                    <td>${escapeHTML(a.student_name)}</td>
                    <td>${escapeHTML(a.company_name)}</td>
                    <td>${escapeHTML(a.job_role)}</td>
                    <td>${formatDate(a.application_date)}</td>
                    <td>${escapeHTML(a.status)}</td>
                    <td>
                        <button class="edit-btn" onclick="editApplication(${a.application_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteApplication(${a.application_id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

    } catch (error) {
        showError(error);
    }
}

const applicationForm = document.getElementById('applicationForm');

if (applicationForm) {
    applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const id = document.getElementById('application_id').value;

        const data = {
            student_id: document.getElementById('student_id').value,
            drive_id: document.getElementById('application_drive_id').value,
            application_date: document.getElementById('application_date').value,
            status: document.getElementById('status').value
        };

        try {
            await apiRequest(
                id ? `/api/applications/${id}` : '/api/applications',
                id ? 'PUT' : 'POST',
                data
            );

            alert(id ? 'Application updated successfully!' : 'Application added successfully!');
            resetApplicationForm();
            loadApplications();
        } catch (error) {
            showError(error);
        }
    });

    loadApplications();
}

function editApplication(id) {
    const a = applicationsData.find(item => item.application_id === id);
    if (!a) return;

    document.getElementById('application_id').value = a.application_id;
    document.getElementById('student_id').value = a.student_id;
    document.getElementById('application_drive_id').value = a.drive_id;
    document.getElementById('application_date').value = formatDate(a.application_date);
    document.getElementById('status').value = a.status;

    document.getElementById('applicationSubmitBtn').textContent = 'Update Application';
    window.scrollTo(0, 0);
}

async function deleteApplication(id) {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
        await apiRequest(`/api/applications/${id}`, 'DELETE');
        alert('Application deleted successfully!');
        loadApplications();
    } catch (error) {
        showError(error);
    }
}

function resetApplicationForm() {
    if (!applicationForm) return;
    applicationForm.reset();
    document.getElementById('application_id').value = '';
    document.getElementById('applicationSubmitBtn').textContent = 'Save Application';
}