// Authentication Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
    }
    
    // Forgot Password Link
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset link will be sent to your email.');
        });
    }
});

// Check Authentication Status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect to login if not authenticated and trying to access protected pages
    const protectedPages = ['admin-dashboard.html', 'freelancer-dashboard.html', 'projects.html', 'payments.html', 'profile.html'];
    if (protectedPages.includes(currentPage)) {
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
        
        // Redirect to appropriate dashboard based on role
        if (userRole === 'admin' && currentPage === 'freelancer-dashboard.html') {
            window.location.href = 'admin-dashboard.html';
        } else if (userRole === 'freelancer' && currentPage === 'admin-dashboard.html') {
            window.location.href = 'freelancer-dashboard.html';
        }
    }
    
    // Redirect to dashboard if already logged in
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === 'index.html')) {
        window.location.href = userRole === 'admin' ? 'admin-dashboard.html' : 'freelancer-dashboard.html';
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Check for admin credentials
    if (email === 'deityommarketing@gmail.com' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', 'Admin User');
        
        if (rememberMe) {
            localStorage.setItem('rememberEmail', email);
        } else {
            localStorage.removeItem('rememberEmail');
        }
        
        window.location.href = 'admin-dashboard.html';
        return;
    }
    
    // Check freelancers in local storage
    const freelancers = JSON.parse(localStorage.getItem('freelancers')) || [];
    const freelancer = freelancers.find(f => f.email === email && f.password === password);
    
    if (freelancer) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'freelancer');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', freelancer.fullName);
        
        if (rememberMe) {
            localStorage.setItem('rememberEmail', email);
        } else {
            localStorage.removeItem('rememberEmail');
        }
        
        window.location.href = 'freelancer-dashboard.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const skills = Array.from(document.getElementById('skills').selectedOptions).map(option => option.value);
    const portfolio = document.getElementById('portfolio').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    const freelancers = JSON.parse(localStorage.getItem('freelancers')) || [];
    
    // Check if email already exists
    if (freelancers.some(f => f.email === email)) {
        alert('Email already registered. Please use a different email or login.');
        return;
    }
    
    // Add new freelancer
    const newFreelancer = {
        id: Date.now().toString(),
        fullName,
        email,
        password,
        skills,
        portfolio: portfolio || null,
        joinedDate: new Date().toISOString(),
        status: 'active'
    };
    
    freelancers.push(newFreelancer);
    localStorage.setItem('freelancers', JSON.stringify(freelancers));
    
    alert('Registration successful! You can now login with your credentials.');
    window.location.href = 'login.html';
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    window.location.href = 'login.html';
}