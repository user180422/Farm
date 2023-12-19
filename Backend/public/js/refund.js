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

function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

const failedMsg = document.querySelector(".failedMsg");

function submitRefundRequest() {

    const refundAmountInput = document.getElementById('inputRefundAmount');
    const refundAmount = refundAmountInput.value;

    // Perform number validation
    if (!isValidNumber(refundAmount)) {
        failedMsg.innerHTML = 'Please enter a valid refund amount.';
        setTimeout(() => {
            failedClosePopup();
        }, 5000);
        showFailedPopup();
        refundAmountInput.focus();
        return;
    }

    console.log("amount", refundAmount);

    fetch('/api/refund', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ refundAmount, refundAmount }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('inputRefundAmount').value = ""
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
            failedMsg.innerHTML = error.message || "An error occurred.";;
            setTimeout(() => {
                failedClosePopup();
            }, 5000);
            showFailedPopup();
        });
}

function isValidNumber(value) {
    // Check if the value is a valid number
    return /^\d+$/.test(value);
}

function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

