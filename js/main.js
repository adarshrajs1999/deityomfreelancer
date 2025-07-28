// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Dashboard Sidebar Toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Profile Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Change Avatar
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const avatarFile = document.getElementById('avatarFile');
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    const profileImage = document.getElementById('profileImage');
    
    if (changeAvatarBtn && avatarModal) {
        changeAvatarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            avatarModal.style.display = 'flex';
        });
    }
    
    if (avatarFile) {
        avatarFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profileImage.src = event.target.result;
                    
                    // Save to local storage (in a real app, you would upload to server)
                    localStorage.setItem('userAvatar', event.target.result);
                };
                reader.readAsDataURL(file);
            }
            avatarModal.style.display = 'none';
        });
    }
    
    if (removeAvatarBtn) {
        removeAvatarBtn.addEventListener('click', function() {
            // Set default avatar based on user role
            const defaultAvatar = localStorage.getItem('userRole') === 'admin' ? 
                'images/admin-avatar.jpg' : 'images/freelancer-avatar.jpg';
            
            profileImage.src = defaultAvatar;
            localStorage.removeItem('userAvatar');
            avatarModal.style.display = 'none';
        });
    }
    
    // Load saved avatar if exists
    if (profileImage && localStorage.getItem('userAvatar')) {
        profileImage.src = localStorage.getItem('userAvatar');
    }
    
    // Password Strength Checker
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBars = document.querySelectorAll('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            
            // Reset
            strengthBars.forEach(bar => bar.style.backgroundColor = '#e5e7eb');
            strengthText.textContent = 'Password strength';
            
            if (password.length > 0) {
                // Very weak
                if (password.length < 6) {
                    strengthBars[0].style.backgroundColor = '#ef4444';
                    strengthText.textContent = 'Very weak';
                } 
                // Weak
                else if (password.length < 8) {
                    strengthBars[0].style.backgroundColor = '#f59e0b';
                    strengthBars[1].style.backgroundColor = '#f59e0b';
                    strengthText.textContent = 'Weak';
                } 
                // Medium
                else if (password.length < 10) {
                    strengthBars[0].style.backgroundColor = '#3b82f6';
                    strengthBars[1].style.backgroundColor = '#3b82f6';
                    strengthBars[2].style.backgroundColor = '#3b82f6';
                    strengthText.textContent = 'Medium';
                } 
                // Strong
                else {
                    strengthBars[0].style.backgroundColor = '#10b981';
                    strengthBars[1].style.backgroundColor = '#10b981';
                    strengthBars[2].style.backgroundColor = '#10b981';
                    strengthText.textContent = 'Strong';
                }
            }
        });
    }
    
    // Handle Profile Form Submissions
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            // Save to local storage
            localStorage.setItem('userName', `${firstName} ${lastName}`);
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('userAddress', address);
            
            // Update profile name
            const profileName = document.getElementById('profileName');
            if (profileName) profileName.textContent = `${firstName} ${lastName}`;
            
            // Update freelancer name in welcome banner
            const freelancerName = document.getElementById('freelancerName');
            if (freelancerName) freelancerName.textContent = `${firstName} ${lastName}`;
            
            alert('Profile information updated successfully!');
        });
    }
    
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate current password
            const userEmail = localStorage.getItem('userEmail');
            const freelancers = JSON.parse(localStorage.getItem('freelancers')) || [];
            const freelancer = freelancers.find(f => f.email === userEmail);
            
            if (userEmail === 'deityommarketing@gmail.com') {
                if (currentPassword !== 'admin') {
                    alert('Current password is incorrect.');
                    return;
                }
            } else if (freelancer && currentPassword !== freelancer.password) {
                alert('Current password is incorrect.');
                return;
            }
            
            // Validate new password
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }
            
            if (newPassword.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            
            // Update password
            if (userEmail === 'deityommarketing@gmail.com') {
                // In a real app, you would update the admin password securely
                alert('Admin password cannot be changed from here in this demo.');
            } else if (freelancer) {
                freelancer.password = newPassword;
                localStorage.setItem('freelancers', JSON.stringify(freelancers));
                alert('Password changed successfully!');
                securityForm.reset();
            }
        });
    }
    
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Notification preferences saved!');
        });
    }
    
    // Remember email functionality
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail && document.getElementById('email')) {
        document.getElementById('email').value = rememberEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Initialize dashboard based on user role
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
        const dashboardLink = document.getElementById('dashboardLink');
        const projectsLabel = document.getElementById('projectsLabel');
        const freelancersLink = document.getElementById('freelancersLink');
        
        if (userRole === 'admin') {
            if (dashboardLink) dashboardLink.href = 'admin-dashboard.html';
            if (projectsLabel) projectsLabel.textContent = 'Projects';
            if (freelancersLink) freelancersLink.style.display = 'block';
        } else {
            if (dashboardLink) dashboardLink.href = 'freelancer-dashboard.html';
            if (projectsLabel) projectsLabel.textContent = 'My Projects';
            if (freelancersLink) freelancersLink.style.display = 'none';
        }
    }
});