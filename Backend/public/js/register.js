function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('farm');

const loginElements = document.querySelector('.login');
const logoutElements = document.querySelector('.logout');
const dashboard = document.querySelector("#dashboard")
const renderNow = document.querySelector("#rendernow")

if (token) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    fetch('http://localhost:4000/api/loginCheck', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                logoutElements.style.display = 'block';
                loginElements.style.display = 'none';
                dashboard.style.display = 'block'
                renderNow.style.display = 'block'
            } else {
                loginElements.style.display = 'block';
                logoutElements.style.display = 'none';
                dashboard.style.display = 'none'
                renderNow.style.display = 'none'
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    loginElements.style.display = 'block';
    logoutElements.style.display = 'none';
    dashboard.style.display = 'none'
    renderNow.style.display = 'none'
}

function logout() {
    document.cookie = "farm= ";
    window.location.href = 'index.html'
}

function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

function validateAndSubmit(event) {
    const failedMsg = document.querySelector(".failedMsg");

    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    console.log("confirm password", confirmPassword);

    // Reset previous error messages
    resetErrors();

    // Validate username
    if (!username) {
        document.getElementById('usernameError').innerText = 'Username is required.';
        return;
    } else {
        var usernameRegex = /^[a-zA-Z ]{3,20}$/;
        if (!usernameRegex.test(username)) {
            document.getElementById('usernameError').innerText = 'Invalid username. Only letters 3 - 20';
            return;
        }
    }

    // Validate email
    if (!email) {
        document.getElementById('emailError').innerText = 'Email is required.';
        return;
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').innerText = 'Invalid email format.';
            return;
        }
    }

    // Validate phone
    if (!phone) {
        document.getElementById('phoneError').innerText = 'Phone number is required.';
        return;
    } else {
        var phoneRegex = /^\d{10}$/; // Change this regex based on your phone number format
        if (!phoneRegex.test(phone)) {
            document.getElementById('phoneError').innerText = 'Invalid phone number. It should be 10 digits.';
            return;
        }
    }

    // Validate password
    if (!password) {
        document.getElementById('passwordError').innerText = 'Password is required.';
        return;
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        document.getElementById('passwordError').innerText = 'Password must contain at least 8 characters with at least one uppercase letter, one number, and one special character';
        return
    }

    // Validate confirm password
    if (!confirmPassword) {
        document.getElementById('confirmPasswordError').innerText = 'Please confirm your password.';
        return;
    } else {
        var confirmPasswordError = document.getElementById('confirmPasswordError');
        if (password !== confirmPassword) {
            confirmPasswordError.innerText = 'Passwords do not match.';
            return;
        }
    }

    if (!username || !email || !phone || !password || !confirmPassword) {
        return;
    }

    const data = {
        username: username,
        email: email,
        phone: phone,
        password: password,
        confirmPassword: confirmPassword
    };

    fetch('http://localhost:4000/api/createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Registration successful, you can redirect or handle it accordingly
                document.getElementById('username').value = ""
                document.getElementById('email').value = ""
                document.getElementById('phone').value = ""
                document.getElementById('password').value = ""
                document.getElementById('confirmPassword').value = ""
                failedMsg.innerHTML = data.success
                setTimeout(() => {
                    failedClosePopup();
                }, 5000);
                showFailedPopup();
            } else {
                // Registration failed, display error message
                failedMsg.innerHTML = data.error;
                setTimeout(() => {
                    failedClosePopup();
                }, 5000);
                showFailedPopup();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            failedMsg.innerHTML = 'An error occurred. Please try again later.';
            showFailedPopup();
        });
}

function resetErrors() {
    var errorContainers = document.querySelectorAll('.error-message');
    console.log("reset");
    errorContainers.forEach(function (container) {
        container.textContent = '';
    });
}
