function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('farm');

const loginElements = document.querySelector('.login');
const logoutElements = document.querySelector('.logout');
const dashboard = document.querySelector("#dashboard")

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
            } else {
                loginElements.style.display = 'block';
                logoutElements.style.display = 'none';
                dashboard.style.display = 'none'
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    loginElements.style.display = 'block';
    logoutElements.style.display = 'none';
    dashboard.style.display = 'none'
}

function logout() {
    document.cookie = "farm= ";
    window.location.href = 'index.html'
}

function submitHandler() {
    // Add your form ID or class if it's specific to one form
    var form = document.querySelector('quoteForm');

    console.log("working");

    form.addEventListener('submit', function (event) {
        // Prevent the form from submitting by default
        event.preventDefault();

        // Reset previous error messages
        resetErrors();

        // Validate each field
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var countryCode = document.getElementById('countryCode').value;
        var phone = document.getElementById('phone').value;

        validateName(name);
        validateEmail(email);
        validateCountryCode(countryCode);
        validatePhone(phone);

        // If all validations pass, you can submit the form
        if (validateName(name) && validateEmail(email) && validateCountryCode(countryCode) && validatePhone(phone)) {
            // Your form submission logic goes here
            console.log('Form submitted successfully!');
        }
    });
};

function validateName(name) {
    var nameRegex = /^[a-zA-Z\s]+$/;
    var nameError = document.getElementById('nameError');

    if (!nameRegex.test(name)) {
        nameError.textContent = 'Invalid name. Only alphabets and spaces are allowed.';
        return false;
    }
    return true;
}

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var emailError = document.getElementById('emailError');

    if (!emailRegex.test(email)) {
        emailError.textContent = 'Invalid email address.';
        return false;
    }
    return true;
}

function validateCountryCode(countryCode) {
    var countryCodeError = document.getElementById('countryCodeError');

    // You can add your specific validation logic for the country code if needed

    return true;
}

function validatePhone(phone) {
    var phoneRegex = /^\d{10}$/; // Change this regex based on your phone number format
    var phoneError = document.getElementById('phoneNoError');

    if (!phoneRegex.test(phone)) {
        phoneError.textContent = 'Invalid phone number. It should be 10 digits.';
        return false;
    }
    return true;
}

function resetErrors() {
    var errorContainers = document.querySelectorAll('.error-message');
    errorContainers.forEach(function (container) {
        container.textContent = '';
    });
}