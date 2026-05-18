$(document).ready(function(){

/* ================= USER CHECK ================= */

const user = JSON.parse(localStorage.getItem('user')) || null;

if(user){

    $('#user-status').html(`
        Welcome, ${user.firstName}
        <a href="#" onclick="logout()" class="btn-logout">
            Logout
        </a>
    `);

    $('.nav-auth').html(`
        <span class="welcome-user">
            👋 ${user.firstName}
        </span>

        <a href="#" onclick="logout()" class="btn-register">
            Logout
        </a>
    `);

}

/* ================= LOGIN FORM ================= */

$('#loginForm').submit(function(e){

    e.preventDefault();

    let email = $('#loginEmail').val().trim();

    let password = $('#loginPassword').val().trim();

    let rememberMe = $('#rememberMe').is(':checked');

    $('.error').text('');

    let emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let passPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

    if(email === ''){

        $('#loginEmailError').text(
            'Email is required'
        );

        return;
    }

    if(!emailPattern.test(email)){

        $('#loginEmailError').text(
            'Enter valid email'
        );

        return;
    }

    if(password === ''){

        $('#loginPasswordError').text(
            'Password is required'
        );

        return;
    }

    if(!passPattern.test(password)){

        $('#loginPasswordError').text(
            'Password must contain capital, number & special character'
        );

        return;
    }

    const userData = {
        firstName : email.split('@')[0],
        email : email
    };

    localStorage.setItem(
        'user',
        JSON.stringify(userData)
    );

    if(rememberMe){

        localStorage.setItem(
            'rememberedUser',
            JSON.stringify(userData)
        );

    }

    showSuccess(
        '🔥 Login Successful'
    );

    setTimeout(function(){

        window.location.href = 'index.html';

    },1500);

});

/* ================= REGISTER FORM ================= */

$('#registerForm').submit(function(e){

    e.preventDefault();

    let firstName =
    $('#firstName').val().trim();

    let lastName =
    $('#lastName').val().trim();

    let phone =
    $('#phone').val().trim();

    let dob =
    $('#dob').val();

    let email =
    $('#registerEmail').val().trim();

    let password =
    $('#registerPassword').val().trim();

    let confirmPassword =
    $('#confirmPassword').val().trim();

    let pdfFile =
    $('#resume')[0].files[0];

    $('.error').text('');

    let passPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if(firstName.length < 3){

        $('#firstNameError').text(
            'Minimum 3 characters required'
        );

        return;
    }

    if(lastName.length < 3){

        $('#lastNameError').text(
            'Minimum 3 characters required'
        );

        return;
    }

    if(phone.length < 10){

        $('#phoneError').text(
            'Enter valid phone number'
        );

        return;
    }

    if(dob === ''){

        $('#dobError').text(
            'Select date of birth'
        );

        return;
    }

    if(!passPattern.test(password)){

        $('#registerPasswordError').text(
            'Password must contain capital, number & special character'
        );

        return;
    }

    if(password !== confirmPassword){

        $('#confirmPasswordError').text(
            'Passwords do not match'
        );

        return;
    }

    if(!pdfFile){

        $('#resumeError').text(
            'Upload PDF file'
        );

        return;
    }

    if(pdfFile.type !== 'application/pdf'){

        $('#resumeError').text(
            'Only PDF allowed'
        );

        return;
    }

    if(pdfFile.size === 0){

        $('#resumeError').text(
            'Empty PDF not allowed'
        );

        return;
    }

    const userData = {

        firstName,
        lastName,
        phone,
        dob,
        email,

        joined :
        new Date().toLocaleDateString()

    };

    localStorage.setItem(
        'user',
        JSON.stringify(userData)
    );

    showSuccess(
        '🚗 Account Created Successfully'
    );

    setTimeout(function(){

        window.location.href = 'login.html';

    },2000);

});

/* ================= CART COUNT ================= */

const cart =
JSON.parse(localStorage.getItem('cart')) || [];

$('#cart-items').text(cart.length);

/* ================= HAMBURGER ================= */

$('.hamburger').click(function(){

    $('.nav-menu').toggleClass('active');

});

});

/* ================= SUCCESS ================= */

function showSuccess(message){

    showNotification(message,'success');

}

/* ================= ERROR ================= */

function showError(message){

    showNotification(message,'error');

}

/* ================= NOTIFICATION ================= */

function showNotification(message,type){

    const notification = $(`

        <div class="notification ${type}">

            <i class="fas
            ${type === 'success'
            ? 'fa-circle-check'
            : 'fa-circle-xmark'}"></i>

            <span>${message}</span>

            <button class="close-btn">
                &times;
            </button>

        </div>

    `);

    $('body').append(notification);

    notification.hide().fadeIn();

    setTimeout(function(){

        notification.fadeOut();

    },4000);

    $('.close-btn').click(function(){

        notification.fadeOut();

    });

}

/* ================= LOGOUT ================= */

function logout(){

    localStorage.removeItem('user');

    localStorage.removeItem(
        'rememberedUser'
    );

    showSuccess('Logged Out');

    setTimeout(function(){

        window.location.href = 'index.html';

    },1000);

}