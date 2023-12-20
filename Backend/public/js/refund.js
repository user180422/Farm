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
                window.location.href = 'login.html'
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    console.log("else");
    loginElements.style.display = 'block';
    logoutElements.style.display = 'none';
    dashboard.style.display = 'none'
    renderNow.style.display = 'none'
    window.location.href = 'login.html'
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

async function fetchUserPayments() {
    try {
        const response = await fetch('http://localhost:4000/api/paymentList', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.data && data.data.length >0) {
            renderPaymentList(data.data);
        } else {
            renderNoPaymentMessage();
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}

function renderPaymentList(paymentData) {
    const container = document.querySelector('.container.text-center');

    if (!container) {
        console.error('Container not found');
        return;
    }

    const paymentForm = document.createElement('form');
    paymentForm.classList.add('row', 'g-3', 'p-5');

    paymentData.forEach(payment => {
        const paymentItem = document.createElement('div');
        paymentItem.classList.add('d-flex', 'mb-3');
        paymentItem.innerHTML = `
            <table class="table mb-0">
                <tbody>
                    <tr>
                        <td>${payment.currency}</td>
                        <td>Amount: ${payment.totalPrice}</td>
                        <td>
                            <button class="btn btn-primary" onclick="handleRefund('${payment.paymentIntent}')">Refund</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
        paymentForm.appendChild(paymentItem);
    });

    container.appendChild(paymentForm);
    $('#exampleModal').modal('show');
}

function renderNoPaymentMessage() {
    const container = document.querySelector('.container.text-center');

    if (!container) {
        console.error('Container not found');
        return;
    }

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.innerHTML = '<p>No payments available.</p>';

    container.appendChild(modalBody);
    $('#exampleModal').modal('show');
}

function handleRefund(paymentId) {
    console.log('Refund requested for payment ID:', paymentId);
}

// Call your API and render the payment list
fetchUserPayments();


