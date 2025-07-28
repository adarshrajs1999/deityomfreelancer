// Admin Dashboard Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        window.location.href = 'freelancer-dashboard.html';
        return;
    }
    
    // Load freelancers data
    loadFreelancers();
    
    // Load projects data
    loadProjects();
    
    // Load payments data
    loadPayments();
    
    // Initialize charts
    initCharts();
});

// Load Freelancers Data
function loadFreelancers() {
    const freelancers = JSON.parse(localStorage.getItem('freelancers')) || [];
    
    // Update freelancers count in stats
    const freelancersCount = freelancers.filter(f => f.status === 'active').length;
    document.querySelectorAll('.stats-card h2')[1].textContent = freelancersCount;
    
    // Update freelancers table if exists
    const freelancersTable = document.getElementById('freelancersTable');
    if (freelancersTable) {
        const tbody = freelancersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        freelancers.forEach(freelancer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${freelancer.fullName}</td>
                <td>${freelancer.email}</td>
                <td>${freelancer.skills.join(', ')}</td>
                <td>${new Date(freelancer.joinedDate).toLocaleDateString()}</td>
                <td><span class="status ${freelancer.status}">${freelancer.status.charAt(0).toUpperCase() + freelancer.status.slice(1)}</span></td>
                <td>
                    <button class="btn-action"><i class="fas fa-eye"></i></button>
                    <button class="btn-action"><i class="fas fa-edit"></i></button>
                    <button class="btn-action danger"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Load Projects Data
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
    // Update projects count in stats
    const activeProjectsCount = projects.filter(p => p.status === 'in-progress').length;
    document.querySelectorAll('.stats-card h2')[0].textContent = activeProjectsCount;
    
    // Update completed tasks count
    const completedTasksCount = projects.filter(p => p.status === 'completed').length;
    document.querySelectorAll('.stats-card h2')[3].textContent = completedTasksCount;
    
    // Update projects table if exists
    const projectsTable = document.querySelector('.projects-table');
    if (projectsTable) {
        const tbody = projectsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${project.name}</td>
                    <td>${project.client}</td>
                    <td>${project.freelancer}</td>
                    <td>${project.startDate}</td>
                    <td>${project.deadline}</td>
                    <td><span class="status ${project.status}">${project.status.replace('-', ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span></td>
                    <td>₹${project.budget}</td>
                    <td>
                        <button class="btn-action"><i class="fas fa-eye"></i></button>
                        <button class="btn-action"><i class="fas fa-edit"></i></button>
                        <button class="btn-action danger"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}

// Load Payments Data
function loadPayments() {
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    
    // Update payments summary
    const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    const overduePayments = pendingPayments.filter(p => new Date(p.dueDate) < new Date());
    const overdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0);
    
    document.querySelectorAll('.summary-card h3')[0].textContent = `₹${totalPaid.toLocaleString()}`;
    document.querySelectorAll('.summary-card h3')[1].textContent = `₹${pendingAmount.toLocaleString()}`;
    document.querySelectorAll('.summary-card p')[1].textContent = `${pendingPayments.length} projects`;
    document.querySelectorAll('.summary-card h3')[2].textContent = `₹${overdueAmount.toLocaleString()}`;
    document.querySelectorAll('.summary-card p')[2].textContent = `${overduePayments.length} project${overduePayments.length !== 1 ? 's' : ''}`;
    
    // Update pending payments count in stats
    document.querySelectorAll('.stats-card h2')[2].textContent = `₹${pendingAmount.toLocaleString()}`;
    document.querySelectorAll('.stats-card p')[2].innerHTML = `<span class="danger">${overduePayments.length}</span> overdue`;
    
    // Update payments table if exists
    const paymentsTable = document.querySelector('.payments-table');
    if (paymentsTable) {
        const tbody = paymentsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            payments.forEach(payment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${payment.id}</td>
                    <td>${payment.freelancer}</td>
                    <td>${payment.project}</td>
                    <td>₹${payment.amount}</td>
                    <td>${payment.dueDate}</td>
                    <td>${payment.paidDate || '-'}</td>
                    <td><span class="status ${payment.status}">${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span></td>
                    <td>
                        <button class="btn-action"><i class="fas fa-eye"></i></button>
                        <button class="btn-action"><i class="fas fa-receipt"></i></button>
                        ${payment.status === 'pending' ? '<button class="btn-action primary"><i class="fas fa-rupee-sign"></i></button>' : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}

// Initialize Charts
function initCharts() {
    // This is a placeholder for actual chart implementation
    // In a real app, you would use a library like Chart.js
    
    // Sample data for projects by status
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const statusCounts = {
        'not-started': 0,
        'pending': 0,
        'in-progress': 0,
        'completed': 0
    };
    
    projects.forEach(project => {
        statusCounts[project.status]++;
    });
    
    console.log('Projects by status:', statusCounts);
    
    // Sample data for payments by month
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    const monthlyPayments = {};
    
    payments.forEach(payment => {
        if (payment.status === 'completed') {
            const monthYear = new Date(payment.paidDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            monthlyPayments[monthYear] = (monthlyPayments[monthYear] || 0) + payment.amount;
        }
    });
    
    console.log('Monthly payments:', monthlyPayments);
}

// Add sample data if none exists
function initializeSampleData() {
    if (!localStorage.getItem('projects')) {
        const sampleProjects = [
            {
                id: 'proj-1',
                name: 'SEO for Kerala Tourism',
                client: 'Kerala Tourism Dept',
                freelancer: 'Rahul Kumar',
                description: 'Optimize website for Kerala tourism keywords and improve ranking',
                startDate: '01 Sep 2023',
                deadline: '15 Oct 2023',
                status: 'in-progress',
                budget: 12000
            },
            {
                id: 'proj-2',
                name: 'Social Media Campaign',
                client: 'Malabar Spices',
                freelancer: 'Priya Nair',
                description: 'Create monthly content calendar and posts for Facebook/Instagram',
                startDate: '10 Sep 2023',
                deadline: '20 Oct 2023',
                status: 'pending',
                budget: 8500
            },
            {
                id: 'proj-3',
                name: 'Website Redesign',
                client: 'Calicut Times',
                freelancer: 'Arun Menon',
                description: 'Redesign website with modern UI/UX and responsive design',
                startDate: '15 Aug 2023',
                deadline: '05 Oct 2023',
                status: 'completed',
                budget: 25000
            },
            {
                id: 'proj-4',
                name: 'Content Writing',
                client: 'Kozhikode Food Blog',
                freelancer: 'Deepa Raj',
                description: 'Write 20 blog posts about traditional Malabar cuisine',
                startDate: '20 Sep 2023',
                deadline: '12 Oct 2023',
                status: 'in-progress',
                budget: 6500
            },
            {
                id: 'proj-5',
                name: 'PPC Campaign',
                client: 'Mappila Cuisine',
                freelancer: 'Vishnu Prasad',
                description: 'Setup and manage Google Ads campaign for restaurant',
                startDate: '05 Oct 2023',
                deadline: '25 Oct 2023',
                status: 'not-started',
                budget: 15000
            }
        ];
        
        localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }
    
    if (!localStorage.getItem('payments')) {
        const samplePayments = [
            {
                id: 'PAY-2023-001',
                project: 'SEO Services',
                freelancer: 'Rahul Kumar',
                amount: 12000,
                dueDate: '05 Sep 2023',
                paidDate: '05 Sep 2023',
                method: 'bank',
                reference: 'TRX123456',
                status: 'completed'
            },
            {
                id: 'PAY-2023-002',
                project: 'Social Media',
                freelancer: 'Priya Nair',
                amount: 8500,
                dueDate: '10 Sep 2023',
                paidDate: '10 Sep 2023',
                method: 'upi',
                reference: 'UPI789012',
                status: 'completed'
            },
            {
                id: 'PAY-2023-003',
                project: 'Content Writing',
                freelancer: 'Deepa Raj',
                amount: 6500,
                dueDate: '15 Sep 2023',
                paidDate: '15 Sep 2023',
                method: 'bank',
                reference: 'TRX345678',
                status: 'completed'
            },
            {
                id: 'PAY-2023-004',
                project: 'Website Development',
                freelancer: 'Arun Menon',
                amount: 25000,
                dueDate: '05 Oct 2023',
                paidDate: null,
                method: null,
                reference: null,
                status: 'pending'
            },
            {
                id: 'PAY-2023-005',
                project: 'PPC Campaign',
                freelancer: 'Vishnu Prasad',
                amount: 15000,
                dueDate: '25 Oct 2023',
                paidDate: null,
                method: null,
                reference: null,
                status: 'pending'
            }
        ];
        
        localStorage.setItem('payments', JSON.stringify(samplePayments));
    }
    
    if (!localStorage.getItem('freelancers')) {
        const sampleFreelancers = [
            {
                id: 'fl-1',
                fullName: 'Rahul Kumar',
                email: 'rahul@example.com',
                password: 'password123',
                skills: ['seo', 'content_writing'],
                portfolio: 'https://rahulkumar.com',
                joinedDate: '2023-01-15',
                status: 'active'
            },
            {
                id: 'fl-2',
                fullName: 'Priya Nair',
                email: 'priya@example.com',
                password: 'password123',
                skills: ['social_media', 'content_writing'],
                portfolio: 'https://priyanair.com',
                joinedDate: '2023-02-20',
                status: 'active'
            },
            {
                id: 'fl-3',
                fullName: 'Arun Menon',
                email: 'arun@example.com',
                password: 'password123',
                skills: ['web_development'],
                portfolio: 'https://arunmenon.dev',
                joinedDate: '2023-03-10',
                status: 'active'
            },
            {
                id: 'fl-4',
                fullName: 'Deepa Raj',
                email: 'deepa@example.com',
                password: 'password123',
                skills: ['content_writing'],
                portfolio: 'https://deeparaj.com',
                joinedDate: '2023-04-05',
                status: 'active'
            },
            {
                id: 'fl-5',
                fullName: 'Vishnu Prasad',
                email: 'vishnu@example.com',
                password: 'password123',
                skills: ['ppc', 'seo'],
                portfolio: 'https://vishnuprasad.com',
                joinedDate: '2023-05-12',
                status: 'active'
            }
        ];
        
        localStorage.setItem('freelancers', JSON.stringify(sampleFreelancers));
    }
}

// Initialize sample data on first load
if (!localStorage.getItem('dataInitialized')) {
    initializeSampleData();
    localStorage.setItem('dataInitialized', 'true');
}