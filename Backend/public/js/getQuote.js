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

const failedMsg = document.querySelector(".failedMsg");

function submitHandler(event) {
    console.log("failedmsg", failedMsg);

    event.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var countryCode = document.getElementById('countryCode').value;
    var phone = document.getElementById('phone').value;
    var quote = document.getElementById('quote').value;

    document.getElementById('nameError').innerText = '';
    document.getElementById('emailError').innerText = '';
    document.getElementById('countryCodeError').innerText = '';
    document.getElementById('phoneNoError').innerText = '';
    document.getElementById('quotesError').innerText = '';

    if (!name) {
        document.getElementById('nameError').innerText = 'Name is required';
        return;
    }

    if (!email) {
        document.getElementById('emailError').innerText = 'Email is required';
        return;
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').innerText = 'Invalid email format';
            return;
        }
    }

    if (!countryCode) {
        document.getElementById('countryCodeError').innerText = 'Country Code is required';
        return;
    }

    if (!phone) {
        document.getElementById('phoneNoError').innerText = 'Phone Number is required';
        return;
    }

    if (!quote) {
        document.getElementById('quotesError').innerText = 'Quote is required';
        return;
    }

    const data = {
        name: name,
        email: email,
        countryCode: countryCode,
        phone: phone,
        quote: quote
    };

    fetch('http://localhost:4000/api/createQuote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('name').value = ""
                document.getElementById('email').value = ""
                document.getElementById('countryCode').value = ""
                document.getElementById('phone').value = ""
                document.getElementById('quote').value = ""
                failedMsg.innerHTML = data.success;
                setTimeout(() => {
                    failedClosePopup();
                }, 5000);
                showFailedPopup();
            } else {
                failedMsg.innerHTML = data.error;
                setTimeout(() => {
                    failedClosePopup();
                }, 5000);
                showFailedPopup();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            failedMsg.innerHTML('An error occurred. Please try again later.');
        });
}
