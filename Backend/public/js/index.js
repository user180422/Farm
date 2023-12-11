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

let toCheckUser = false

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
            toCheckUser = data
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

// price call

function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

async function handleSubscribeClick(id) {

    const failedMsg = document.querySelector(".failedMsg");
    const priceId = id

    console.log("to", priceId, token);

    if (token) {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ priceId }),
            });

            const session = await response.json();
            console.log("session", session);
            if (session && session.session.id) {
                console.log("if", session.session.url);
                window.location = session.session.url;
            } else {
                console.log("else", session);
                failedMsg.innerHTML = "Somthing went wrong try later"
                setTimeout(() => {
                    failedClosePopup();
                }, 5000);
                showFailedPopup();
            }
        } catch (error) {
            console.log("error", error);
            failedMsg.innerHTML = error
            setTimeout(() => {
                failedClosePopup();
            }, 5000);
            showFailedPopup();
        }
    } else {
        failedMsg.innerHTML = "For Subscription login Required"
        setTimeout(() => {
            failedClosePopup();
        }, 5000);
        showFailedPopup();
    }

}