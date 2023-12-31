function getCookie(name) {
    console.log("name", document.cookie);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('farm');

const loginElements = document.querySelector('.login');
const logoutElements = document.querySelector('.logout');

if (token) {
    console.log('Bearer Token:', token);

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
            console.log("isauth", data.isAuthenticated);
            if (data.isAuthenticated) {
                logoutElements.style.display = 'block';
                loginElements.style.display = 'none';
            } else {
                loginElements.style.display = 'block';
                logoutElements.style.display = 'none';
                window.location.href = 'login.html'
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    console.log('Token not found in cookies');
    loginElements.style.display = 'block';
    logoutElements.style.display = 'none';
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

function handleFormSubmission(event) {
    event.preventDefault();

    const failedMsg = document.querySelector(".failedMsg");
    const folderInput = document.getElementById('folderInput');
    const selectedFiles = folderInput.files;

    // Check if selected files are ZIP files
    if (!validateFiles(selectedFiles)) {
        failedMsg.innerHTML = "Please select valid ZIP files.";
        showFailedPopup();
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
    }

    // Replace the existing headers with 'Authorization' if needed
    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    fetch('http://localhost:4000/api/uploads', {
        method: 'POST',
        headers: headers,
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle success
                window.location.href = 'dashboard.html'
            } else {
                console.log("data", data);
                failedMsg.innerHTML = data.error;
                setTimeout(() => {
                    failedClosePopup();
                }, 5000);
                showFailedPopup();
            }
        })
        .catch(error => {
            console.error("error", error);
            failedMsg.innerHTML = error.message || "An error occurred.";
            setTimeout(() => {
                failedClosePopup();
            }, 5000);
            showFailedPopup();
        });
}

// Validate if the selected files are ZIP files
function validateFiles(files) {
    for (const file of files) {
        const lowerCaseType = file.type.toLowerCase();
        if (lowerCaseType !== 'application/zip' && lowerCaseType !== 'application/x-zip-compressed') {
            return false;
        }
    }
    return true;
}

const folderInput = document.getElementById('folderInput');
const msgCon = document.getElementById('msg')
const submitBtn = document.getElementById('submit-btn');

function checker() {
    fetch('http://localhost:4000/api/subStatus', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("data", data);
            if (data.status == "active") {
                msgCon.style.display = 'none'
            } else {
                folderInput.disabled = true;
                submitBtn.disabled = true;
                msgCon.style.display = 'block'
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

checker()