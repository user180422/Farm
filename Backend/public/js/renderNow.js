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

function showFileList() {
    const folderInput = document.getElementById('folderInput');
    const selectedFiles = folderInput.files;

    const fileListPopup = document.getElementById('fileListPopup');
    const fileList = document.getElementById('fileList');

    fileList.innerHTML = '';
    fileListPopup.style.display = 'block';

    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const listItem = document.createElement('li');

        listItem.innerHTML = `${file.name} <button onclick="removeFile(${i})">❌</button>`;
        fileList.appendChild(listItem);
    }
}

function closeFileListPopup() {
    const fileListPopup = document.getElementById('fileListPopup');
    fileListPopup.style.display = 'none';
}

function removeFile(index) {
    const folderInput = document.getElementById('folderInput');
    const selectedFiles = folderInput.files;

    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    const newDataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => {
        newDataTransfer.items.add(file);
    });

    folderInput.files = newDataTransfer.files;

    showFileList();
}