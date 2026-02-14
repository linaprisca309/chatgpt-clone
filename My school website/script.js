// Show/Hide Sections with smooth transitions
function showSection(id) {
    // Hide all sections
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(id);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update active nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`a[href="#${id}"]`).classList.add('active');
    }
}

// Toggle admission form visibility
function toggleForm() {
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        const isHidden = formContainer.style.display === 'none';
        formContainer.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            formContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Load submissions from localStorage
function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('admissions')) || [];
    const container = document.getElementById('submissions-container');
    
    if (container && submissions.length > 0) {
        container.innerHTML = '';
        submissions.forEach(submission => {
            const item = document.createElement('div');
            item.className = 'submission-item';
            item.innerHTML = `
                <h4>${submission.firstName} ${submission.lastName}</h4>
                <p><strong>Email:</strong> ${submission.email}</p>
                <p><strong>Phone:</strong> ${submission.phone}</p>
                <p><strong>Course:</strong> ${submission.course}</p>
                <p><strong>Submitted:</strong> ${new Date(submission.date).toLocaleString()}</p>
            `;
            container.appendChild(item);
        });
    }
}

// Initialize - Show home section on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set home as active on load
    showSection('home');
    
    // Load existing submissions
    loadSubmissions();
    
    // Navigation link click handlers
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
    
    // Admission Form submission handler
    const admissionForm = document.getElementById('admission-form');
    if (admissionForm) {
        admissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const age = document.getElementById('age').value;
            const dob = document.getElementById('dob').value;
            const course = document.getElementById('course').value;
            const qualification = document.getElementById('qualification').value;
            const message = document.getElementById('message').value.trim();
            const terms = document.getElementById('terms').checked;
            
            // Validate form
            if (!firstName || !lastName || !email || !phone || !age || !dob || !course || !qualification || !terms) {
                alert('Please fill in all required fields and agree to terms.');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Validate age
            if (age < 16 || age > 80) {
                alert('Age must be between 16 and 80.');
                return;
            }
            
            // Create submission object
            const submission = {
                firstName,
                lastName,
                email,
                phone,
                age,
                dob,
                course,
                qualification,
                message,
                date: new Date().toISOString(),
                id: Date.now()
            };
            
            // Save to localStorage
            const admissions = JSON.parse(localStorage.getItem('admissions')) || [];
            admissions.unshift(submission);
            localStorage.setItem('admissions', JSON.stringify(admissions));
            
            // Show success message
            alert(`Thank you, ${firstName}! Your application has been submitted successfully. We will contact you at ${email} soon.`);
            
            // Reset form
            admissionForm.reset();
            
            // Hide form
            document.getElementById('form-container').style.display = 'none';
            
            // Reload submissions if visible
            loadSubmissions();
        });
    }
    
    // Contact Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Save to localStorage
            const messages = JSON.parse(localStorage.getItem('contact-messages')) || [];
            messages.unshift({
                name,
                email,
                subject,
                message,
                date: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('contact-messages', JSON.stringify(messages));
            
            alert(`Thank you, ${name}! We received your message and will respond soon.`);
            contactForm.reset();
        });
    }
});
