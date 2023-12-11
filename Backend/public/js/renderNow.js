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

function handleFormSubmission(event) {
    event.preventDefault();

    const folderInput = document.getElementById('folderInput');
    const selectedFiles = folderInput.files;

    const formData = new FormData();

    // Append each file to the FormData object
    for (let i = 0; i < selectedFiles.length; i++) {
        console.log("in loop", selectedFiles[i].name);
        formData.append(`files`, selectedFiles[i]);
    }

    console.log('Selected files:', formData);

    fetch('http://localhost:4000/api/uploads', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Upload successful:', data);
        })
        .catch(error => {
            console.error('Error uploading files:', error);
        });
}

function validateFiles(files) {
    const supportedExtensions = ['.blend', '.fbx', '.obj', '.stl', '.abc'];

    for (const file of files) {
        const fileName = file.name.toLowerCase().trim();
        const lastDotIndex = fileName.lastIndexOf(".");

        if (lastDotIndex === -1) {
            return false;
        }

        const fileExtension = fileName.slice(lastDotIndex);

        if (!supportedExtensions.includes(fileExtension)) {
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