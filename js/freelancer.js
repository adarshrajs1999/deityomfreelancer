// Freelancer Dashboard Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is freelancer
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'freelancer') {
        window.location.href = 'admin-dashboard.html';
        return;
    }
    
    const userEmail = localStorage.getItem('userEmail');
    
    // Load freelancer's projects
    loadFreelancerProjects(userEmail);
    
    // Load freelancer's payments
    loadFreelancerPayments(userEmail);
    
    // Initialize freelancer profile
    initFreelancerProfile(userEmail);
});

// Load Freelancer's Projects
function loadFreelancerProjects(email) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const freelancerProjects = projects.filter(p => p.freelancerEmail === email || p.freelancer.includes(localStorage.getItem('userName')));
    
    // Update projects count in stats
    const activeProjectsCount = freelancerProjects.filter(p => p.status === 'in-progress').length;
    document.querySelectorAll('.stats-card h2')[0].textContent = activeProjectsCount;
    
    // Update completed tasks count
    const completedTasksCount = freelancerProjects.filter(p => p.status === 'completed').length;
    document.querySelectorAll('.stats-card h2')[1].textContent = completedTasksCount;
    
    // Update projects list if exists
    const projectsList = document.querySelector('.projects-list');
    if (projectsList) {
        projectsList.innerHTML = '';
        
        freelancerProjects.forEach(project => {
            if (project.status !== 'completed') {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-header">
                        <h5>${project.name}</h5>
                        <span class="status ${project.status}">${project.status.replace('-', ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span>
                    </div>
                    <div class="project-details">
                        <p>${project.description}</p>
                        <div class="project-meta">
                            <span><i class="fas fa-calendar-alt"></i> Deadline: ${project.deadline}</span>
                            <span><i class="fas fa-coins"></i> ₹${project.budget}</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <a href="#" class="btn-secondary">View Details</a>
                        <a href="#" class="btn-primary">Submit Work</a>
                    </div>
                `;
                projectsList.appendChild(projectCard);
            }
        });
    }
}

// Load Freelancer's Payments
function loadFreelancerPayments(email) {
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    const freelancerPayments = payments.filter(p => p.freelancerEmail === email || p.freelancer.includes(localStorage.getItem('userName')));
    const completedPayments = freelancerPayments.filter(p => p.status === 'completed');
    
    // Update earnings this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyEarnings = completedPayments
        .filter(p => {
            const paidDate = new Date(p.paidDate);
            return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + p.amount, 0);
    
    document.querySelectorAll('.stats-card h2')[2].textContent = `₹${monthlyEarnings.toLocaleString()}`;
    
    // Update client rating (random for demo)
    const rating = (4.5 + Math.random() * 0.5).toFixed(1);
    document.querySelectorAll('.stats-card h2')[3].textContent = rating;
    
    // Update payments list if exists
    const paymentsList = document.querySelector('.payments-list');
    if (paymentsList) {
        paymentsList.innerHTML = '';
        
        completedPayments.slice(0, 2).forEach(payment => {
            const paymentItem = document.createElement('div');
            paymentItem.className = 'payment-item';
            paymentItem.innerHTML = `
                <div class="payment-info">
                    <h5>${payment.project}</h5>
                    <p>Completed on ${payment.paidDate}</p>
                </div>
                <div class="payment-amount">
                    <h4>₹${payment.amount}</h4>
                    <span class="status completed">Received</span>
                </div>
            `;
            paymentsList.appendChild(paymentItem);
        });
    }
}

// Initialize Freelancer Profile
function initFreelancerProfile(email) {
    const freelancers = JSON.parse(localStorage.getItem('freelancers')) || [];
    const freelancer = freelancers.find(f => f.email === email);
    
    if (freelancer) {
        // Update profile info
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileRole = document.getElementById('profileRole');
        
        if (profileName) profileName.textContent = freelancer.fullName;
        if (profileEmail) profileEmail.textContent = freelancer.email;
        if (profileRole) profileRole.textContent = freelancer.skills.map(skill => {
            switch(skill) {
                case 'seo': return 'SEO Specialist';
                case 'social_media': return 'Social Media Manager';
                case 'content_writing': return 'Content Writer';
                case 'graphic_design': return 'Graphic Designer';
                case 'web_development': return 'Web Developer';
                case 'ppc': return 'PPC Specialist';
                default: return skill;
            }
        }).join(', ');
        
        // Update skills in profile form
        const skillsInput = document.getElementById('skillsInput');
        if (skillsInput) {
            skillsInput.value = freelancer.skills.join(', ');
        }
        
        // Update portfolio in profile form
        const portfolioInput = document.getElementById('portfolioInput');
        if (portfolioInput && freelancer.portfolio) {
            portfolioInput.value = freelancer.portfolio;
        }
    }
}