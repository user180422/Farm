function closePopup(popupId) {
    var popup = document.getElementById("successPopup");
    popup.style.display = 'none';
    window.location.href = "login.html";
}
function showPopup(popupId) {
    var popup = document.getElementById("successPopup");
    popup.style.display = 'block';
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

    const msgContainer = document.querySelector(".msg")
    const failedMsg = document.querySelector(".failedMsg")

    event.preventDefault();
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    document.getElementById('usernameError').innerText = '';
    document.getElementById('emailError').innerText = '';
    document.getElementById('phoneError').innerText = '';
    document.getElementById('passwordError').innerText = '';
    document.getElementById('confirmPasswordError').innerText = '';

    if (!username) {
        document.getElementById('usernameError').innerText = 'Username is required';
    } else {
        var usernameRegex = /^[a-z0-9]{5,10}$/;
        if (!usernameRegex.test(username)) {
            document.getElementById('usernameError').innerText = 'Invalid username format';
        }
    }

    if (!email) {
        document.getElementById('emailError').innerText = 'Email is required';
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').innerText = 'Invalid email format';
        }
    }

    if (!phone) {
        document.getElementById('phoneError').innerText = 'Phone number is required';
    } else {
        var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!phoneRegex.test(phone)) {
            document.getElementById('phoneError').innerText = 'Invalid phone number';
        }
    }

    if (!password) {
        document.getElementById('passwordError').innerText = 'Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        document.getElementById('passwordError').innerText = 'Password must contain at least 8 characters with at least one uppercase letter, one number, and one special character';
    }

    if (!confirmPassword) {
        document.getElementById('confirmPasswordError').innerText = 'Please confirm your password';
    } else if (confirmPassword !== password) {
        document.getElementById('confirmPasswordError').innerText = 'Passwords do not match';
    }

    // send data 
    async function createUser(sendData) {

        console.log("sendData", sendData);
        try {
            const response = await fetch('http://localhost:4000/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendData)
            });

            const data = await response.json();
            console.log(data);
            if (data.success) {
                document.getElementById('username').value = "";
                document.getElementById('email').value = "";
                document.getElementById('phone').value = "";
                document.getElementById('password').value = "";
                document.getElementById('confirmPassword').value = "";
                msgContainer.innerHTML = data.success
                showPopup()
                setTimeout(() => {
                    closePopup()
                    window.location.href = "login.html";
                }, 5000)
            } else {
                failedMsg.innerHTML = data.error
                setTimeout(() => {
                    failedClosePopup()
                }, 5000)
                showFailedPopup()
            }
        } catch (error) {
            console.log("error");
            alert("failed", error)
        }
    }

    if (!username || !email || !phone || !password || !confirmPassword || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password) || confirmPassword !== password) {
        return false;
    } else {
        const data = {
            username: username,
            email: email,
            phone: phone,
            password: password,
            confirmPassword: confirmPassword
        }
        createUser(data)
    }

}

