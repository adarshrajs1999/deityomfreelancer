// Projects Management Functions
document.addEventListener('DOMContentLoaded', function() {
    // Add Project Modal
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addProjectModal = document.getElementById('addProjectModal');
    const addProjectForm = document.getElementById('addProjectForm');
    
    if (addProjectBtn && addProjectModal) {
        addProjectBtn.addEventListener('click', function() {
            addProjectModal.style.display = 'flex';
        });
    }
    
    // Close Modal
    const closeModalButtons = document.querySelectorAll('.modal-close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Handle Add Project Form Submission
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectName = document.getElementById('projectName').value;
            const clientName = document.getElementById('clientName').value;
            const projectDescription = document.getElementById('projectDescription').value;
            const startDate = document.getElementById('startDate').value;
            const deadline = document.getElementById('deadline').value;
            const freelancer = document.getElementById('freelancer').value;
            const freelancerText = document.getElementById('freelancer').options[document.getElementById('freelancer').selectedIndex].text;
            const budget = document.getElementById('budget').value;
            const projectStatus = document.getElementById('projectStatus').value;
            
            // Create new project object
            const newProject = {
                id: 'proj-' + Date.now(),
                name: projectName,
                client: clientName,
                freelancer: freelancerText.split(' (')[0],
                freelancerEmail: document.getElementById('freelancer').options[document.getElementById('freelancer').selectedIndex].text.split(' ')[1].replace(/[()]/g, ''),
                description: projectDescription,
                startDate: new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                deadline: new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                status: projectStatus,
                budget: parseInt(budget),
                createdAt: new Date().toISOString()
            };
            
            // Save to local storage
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects.push(newProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Close modal and refresh projects list
            addProjectModal.style.display = 'none';
            addProjectForm.reset();
            
            // Show success message
            alert('Project added successfully!');
            
            // Reload projects
            if (localStorage.getItem('userRole') === 'admin') {
                loadProjects();
            } else {
                loadFreelancerProjects(localStorage.getItem('userEmail'));
            }
        });
    }
    
    // Filter Projects
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            alert('Filter functionality will be implemented here.');
        });
    }
    
    // Initialize date pickers
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            const today = new Date().toISOString().split('T')[0];
            input.value = today;
            
            // For deadline, set 2 weeks from today
            if (input.id === 'deadline') {
                const twoWeeksLater = new Date();
                twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
                input.value = twoWeeksLater.toISOString().split('T')[0];
            }
        }
    });
});