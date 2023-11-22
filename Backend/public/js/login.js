function validateAndSubmit(event) {

    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    document.getElementById('emailError').innerText = '';
    document.getElementById('passwordError').innerText = '';

    if (!email) {
        document.getElementById('emailError').innerText = 'Email is required';
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').innerText = 'Invalid email format';
        }
    }

    if (!password) {
        document.getElementById('passwordError').innerText = 'Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        document.getElementById('passwordError').innerText = 'Password must contain at least 8 characters with at least one uppercase letter, one number, and one special character';
    }

    if (!email || !password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        return false; 
    } else {
        alert('Form submitted successfully');
    }

}
