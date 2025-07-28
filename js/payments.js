// Payments Management Functions
document.addEventListener('DOMContentLoaded', function() {
    // Add Payment Modal
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const addPaymentModal = document.getElementById('addPaymentModal');
    const addPaymentForm = document.getElementById('addPaymentForm');
    
    if (addPaymentBtn && addPaymentModal) {
        addPaymentBtn.addEventListener('click', function() {
            addPaymentModal.style.display = 'flex';
        });
    }
    
    // Handle Add Payment Form Submission
    if (addPaymentForm) {
        addPaymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const paymentProject = document.getElementById('paymentProject').value;
            const paymentProjectText = document.getElementById('paymentProject').options[document.getElementById('paymentProject').selectedIndex].text;
            const paymentAmount = document.getElementById('paymentAmount').value;
            const paymentDate = document.getElementById('paymentDate').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            const paymentReference = document.getElementById('paymentReference').value;
            const paymentNotes = document.getElementById('paymentNotes').value;
            
            // Get project details
            const projectParts = paymentProjectText.split(' (');
            const projectName = projectParts[0];
            const freelancerName = projectParts[1].replace(')', '');
            
            // Create new payment object
            const newPayment = {
                id: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                project: projectName,
                freelancer: freelancerName,
                amount: parseInt(paymentAmount),
                dueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                paidDate: new Date(paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                method: paymentMethod,
                reference: paymentReference || null,
                notes: paymentNotes || null,
                status: 'completed',
                processedBy: localStorage.getItem('userName') || 'Admin',
                processedAt: new Date().toISOString()
            };
            
            // Save to local storage
            const payments = JSON.parse(localStorage.getItem('payments')) || [];
            payments.push(newPayment);
            localStorage.setItem('payments', JSON.stringify(payments));
            
            // Close modal and refresh payments list
            addPaymentModal.style.display = 'none';
            addPaymentForm.reset();
            
            // Show success message
            alert('Payment recorded successfully!');
            
            // Reload payments
            if (localStorage.getItem('userRole') === 'admin') {
                loadPayments();
            } else {
                loadFreelancerPayments(localStorage.getItem('userEmail'));
            }
        });
    }
    
    // Filter Payments
    const filterPaymentsBtn = document.getElementById('filterPaymentsBtn');
    if (filterPaymentsBtn) {
        filterPaymentsBtn.addEventListener('click', function() {
            alert('Filter functionality will be implemented here.');
        });
    }
    
    // Initialize date picker for payment date
    const paymentDateInput = document.getElementById('paymentDate');
    if (paymentDateInput && !paymentDateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        paymentDateInput.value = today;
    }
    
    // Process Payment (Mark as Paid)
    const processPaymentButtons = document.querySelectorAll('.btn-action.primary');
    processPaymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const paymentId = this.closest('tr').querySelector('td:first-child').textContent;
            
            if (confirm(`Mark payment ${paymentId} as paid?`)) {
                const payments = JSON.parse(localStorage.getItem('payments')) || [];
                const paymentIndex = payments.findIndex(p => p.id === paymentId);
                
                if (paymentIndex !== -1) {
                    payments[paymentIndex].status = 'completed';
                    payments[paymentIndex].paidDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    payments[paymentIndex].method = 'bank';
                    payments[paymentIndex].reference = `TRX${Math.floor(100000 + Math.random() * 900000)}`;
                    payments[paymentIndex].processedBy = localStorage.getItem('userName') || 'Admin';
                    payments[paymentIndex].processedAt = new Date().toISOString();
                    
                    localStorage.setItem('payments', JSON.stringify(payments));
                    
                    // Show success message
                    alert(`Payment ${paymentId} marked as paid.`);
                    
                    // Reload payments
                    if (localStorage.getItem('userRole') === 'admin') {
                        loadPayments();
                    } else {
                        loadFreelancerPayments(localStorage.getItem('userEmail'));
                    }
                }
            }
        });
    });
});