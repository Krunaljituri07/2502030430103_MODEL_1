$(document).ready(function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user) {
        $('#user-status').html(`Welcome, ${user.firstName}! <a href="#" onclick="logout()">Logout</a>`);
        $('.nav-auth').html(`Welcome, ${user.firstName}! <a href="#" onclick="logout()" class="btn-logout">Logout</a>`);
    }

    // Login form
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        const rememberMe = $('#rememberMe').is(':checked');
        
        // Demo users
        const demoUsers = {
            'john@example.com': { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            'sarah@example.com': { firstName: 'Sarah', lastName: 'Miller', email: 'sarah@example.com' }
        };
        
        if (demoUsers[email] && password === 'password123') {
            const userData = demoUsers[email];
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(userData));
            }
            
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('Invalid email or password');
        }
    });

    // Register form
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const phone = $('#phone').val();
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }
        
        const userData = {
            firstName,
            lastName,
            phone,
            email,
            joined: new Date().toLocaleDateString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        showSuccess('Account created successfully! Redirecting to login...');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    // Update cart count
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    $('#cart-items').text(cart.length);
});

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = $(`
        <div class="notification ${type}">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
            <button class="close-btn">&times;</button>
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.fadeOut();
    }, 4000);
    
    $('.close-btn').click(function() {
        $(this).parent().fadeOut();
    });
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUser');
    window.location.href = 'index.html';
}