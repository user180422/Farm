function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

function validateAndSubmit(event) {

    const failedMsg = document.querySelector(".failedMsg")

    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    console.log("working", email, password);

    document.getElementById('emailError').innerText = '';
    document.getElementById('passwordError').innerText = '';

    if (!email) {
        document.getElementById('emailError').innerText = 'Email is required';
        return
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').innerText = 'Invalid email format';
            return
        }
    }

    if (!password) {
        document.getElementById('passwordError').innerText = 'Password is required';
        return
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        document.getElementById('passwordError').innerText = 'Password must contain at least 8 characters with at least one uppercase letter, one number, and one special character';
        return
    }

    if (!email || !password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        return false;
    } else {
        const data = {
            email: email,
            password: password
        };

        fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "index.html#pricing"
                } else {
                    failedMsg.innerHTML = data.error
                    setTimeout(() => {
                        failedClosePopup()
                    }, 5000)
                    showFailedPopup()
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            });
    }

}
