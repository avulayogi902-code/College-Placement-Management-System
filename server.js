const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'college_placement_db'
});

db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed:', err.message);
    } else {
        console.log('MySQL Database Connected Successfully!');
    }
});

// HOME PAGE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ================= STUDENTS CRUD =================

// Get Students
app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM students ORDER BY student_id DESC', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Add Student
app.post('/api/students', (req, res) => {
    const { student_name, email, phone, department, graduation_year, cgpa } = req.body;

    db.query(
        'INSERT INTO students (student_name, email, phone, department, graduation_year, cgpa) VALUES (?, ?, ?, ?, ?, ?)',
        [student_name, email, phone, department, graduation_year, cgpa],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Student added successfully!' });
        }
    );
});

// Update Student
app.put('/api/students/:id', (req, res) => {
    const { student_name, email, phone, department, graduation_year, cgpa } = req.body;

    db.query(
        'UPDATE students SET student_name=?, email=?, phone=?, department=?, graduation_year=?, cgpa=? WHERE student_id=?',
        [student_name, email, phone, department, graduation_year, cgpa, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Student updated successfully!' });
        }
    );
});

// Delete Student
app.delete('/api/students/:id', (req, res) => {
    db.query('DELETE FROM students WHERE student_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Student deleted successfully!' });
    });
});

// ================= COMPANIES CRUD =================

// Get Companies
app.get('/api/companies', (req, res) => {
    db.query('SELECT * FROM companies ORDER BY company_id DESC', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Add Company
app.post('/api/companies', (req, res) => {
    const { company_name, industry, location, website } = req.body;

    db.query(
        'INSERT INTO companies (company_name, industry, location, website) VALUES (?, ?, ?, ?)',
        [company_name, industry, location, website],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Company added successfully!' });
        }
    );
});

// Update Company
app.put('/api/companies/:id', (req, res) => {
    const { company_name, industry, location, website } = req.body;

    db.query(
        'UPDATE companies SET company_name=?, industry=?, location=?, website=? WHERE company_id=?',
        [company_name, industry, location, website, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Company updated successfully!' });
        }
    );
});

// Delete Company
app.delete('/api/companies/:id', (req, res) => {
    db.query('DELETE FROM companies WHERE company_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Company deleted successfully!' });
    });
});

// ================= PLACEMENT DRIVES CRUD =================

// Get Drives
app.get('/api/drives', (req, res) => {
    const sql = `
        SELECT drives.*, companies.company_name
        FROM drives
        JOIN companies ON drives.company_id = companies.company_id
        ORDER BY drives.drive_id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Add Drive
app.post('/api/drives', (req, res) => {
    const { company_id, job_role, package_lpa, eligibility_cgpa, drive_date, location } = req.body;

    db.query(
        'INSERT INTO drives (company_id, job_role, package_lpa, eligibility_cgpa, drive_date, location) VALUES (?, ?, ?, ?, ?, ?)',
        [company_id, job_role, package_lpa, eligibility_cgpa, drive_date, location],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Placement drive added successfully!' });
        }
    );
});

// Update Drive
app.put('/api/drives/:id', (req, res) => {
    const { company_id, job_role, package_lpa, eligibility_cgpa, drive_date, location } = req.body;

    db.query(
        'UPDATE drives SET company_id=?, job_role=?, package_lpa=?, eligibility_cgpa=?, drive_date=?, location=? WHERE drive_id=?',
        [company_id, job_role, package_lpa, eligibility_cgpa, drive_date, location, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Placement drive updated successfully!' });
        }
    );
});

// Delete Drive
app.delete('/api/drives/:id', (req, res) => {
    db.query('DELETE FROM drives WHERE drive_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Placement drive deleted successfully!' });
    });
});

// ================= APPLICATIONS CRUD =================

// Get Applications
app.get('/api/applications', (req, res) => {
    const sql = `
        SELECT applications.*, students.student_name, drives.job_role, companies.company_name
        FROM applications
        JOIN students ON applications.student_id = students.student_id
        JOIN drives ON applications.drive_id = drives.drive_id
        JOIN companies ON drives.company_id = companies.company_id
        ORDER BY applications.application_id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Add Application
app.post('/api/applications', (req, res) => {
    const { student_id, drive_id, application_date, status } = req.body;

    db.query(
        'INSERT INTO applications (student_id, drive_id, application_date, status) VALUES (?, ?, ?, ?)',
        [student_id, drive_id, application_date, status],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Application added successfully!' });
        }
    );
});

// Update Application
app.put('/api/applications/:id', (req, res) => {
    const { student_id, drive_id, application_date, status } = req.body;

    db.query(
        'UPDATE applications SET student_id=?, drive_id=?, application_date=?, status=? WHERE application_id=?',
        [student_id, drive_id, application_date, status, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.json({ message: 'Application updated successfully!' });
        }
    );
});

// Delete Application
app.delete('/api/applications/:id', (req, res) => {
    db.query('DELETE FROM applications WHERE application_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Application deleted successfully!' });
    });
});

// START SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});