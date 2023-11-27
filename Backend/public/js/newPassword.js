function closePopup(popupId) {
    var popup = document.getElementById("successPopup");
    popup.style.display = 'none';
    window.location.href = "login.html"
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

const resetPasswordContainer = document.getElementsByClassName('form-container');
function renderResetPasswordForm() {
    resetPasswordContainer.innerHTML = '';

    const innerContainer = document.createElement('div');
    innerContainer.className = 'container text-center p-5 width-adjust';

    const form = document.createElement('form');
    form.className = 'border rounded shadow-lg p-3';
    form.addEventListener('submit', validateAndSubmit);

    const passwordDiv = createFormGroup('password', 'Password');
    const passwordInput = createInput('password', 'password', 'Password');
    passwordDiv.appendChild(passwordInput);

    const confirmPasswordDiv = createFormGroup('confirmPassword', 'Confirm Password');
    const confirmPasswordInput = createInput('confirmPassword', 'password', 'Confirm Password');
    confirmPasswordDiv.appendChild(confirmPasswordInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submit-btn mt-2';
    submitButton.textContent = 'Reset Password';

    form.appendChild(passwordDiv);
    form.appendChild(confirmPasswordDiv);
    form.appendChild(submitButton);

    innerContainer.appendChild(form);
    resetPasswordContainer.appendChild(innerContainer);
}

function renderRetryMessage() {
    const resetPasswordContainer = document.getElementsByClassName('form-container');

    resetPasswordContainer.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'container text-center p-2 widt2h-adjust';

    const message = document.createElement('div');
    message.className = 'error-message text-danger';

    const mainMessage = document.createTextNode('Invalid or expired token ');

    const retryLink = document.createElement('a');
    retryLink.href = '/login.html';
    retryLink.textContent = 'Please retry the password reset process.';

    message.appendChild(mainMessage);
    message.appendChild(retryLink);

    container.appendChild(message);
    
    resetPasswordContainer.appendChild(container);
}


function renderServerErrorMessage() {
    document.body.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'container text-center p-2 width-adjust';

    const message = document.createElement('div');
    message.className = 'error-message text-danger';

    const mainMessage = document.createTextNode('Invalid or expired token ');

    const retryLink = document.createElement('a');
    retryLink.href = '/login.html';  
    retryLink.textContent = 'Server error. Please try again later.';

    message.appendChild(mainMessage);
    message.appendChild(retryLink);

    container.appendChild(message);
    document.body.appendChild(container);
}


const token = new URLSearchParams(window.location.search).get('token')
async function checkTokenValidity(token) {
    try {
        const response = await fetch(`http://localhost:4000/api/check-token?token=${token}`);
        const data = await response.json();
        if (data.success) {
            renderResetPasswordForm();
        } else {
            if(data.status = 500){
                renderServerErrorMessage()
            }
            renderRetryMessage()
        }
    } catch (error) {
        console.error('Error checking token validity:', error);
    }
}

const run = async () => {
    const res = await checkTokenValidity(token)
}
run()

function validateAndSubmit(event) {

    const msgContainer = document.querySelector(".msg")
    const failedMsg = document.querySelector(".failedMsg")

    event.preventDefault();
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    document.getElementById('passwordError').innerText = '';
    document.getElementById('confirmPasswordError').innerText = '';

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

        try {
            const response = await fetch('http://localhost:4000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendData)
            });

            const data = await response.json();
            if (data.success) {
                document.getElementById('password').value = "";
                document.getElementById('confirmPassword').value = "";
                msgContainer.innerHTML = data.success
                setTimeout(() => {
                    showFailedPopup()
                    window.location.href = "login.html"
                }, 5000)
                showPopup()
            } else {
                failedMsg.innerHTML = data.error
                setTimeout(() => {
                    failedClosePopup()
                }, 5000)
                showFailedPopup()
            }
        } catch (error) {
            failedMsg.innerHTML = error
        }
    }

    if (!password || !confirmPassword || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password) || confirmPassword !== password) {
        return false;
    } else {
        const data = {
            token: token,
            password: password,
            confirmPassword: confirmPassword
        }
        createUser(data)
    }

}

