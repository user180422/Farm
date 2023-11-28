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
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    console.log('Token not found in cookies');
    loginElements.style.display = 'block';
    logoutElements.style.display = 'none';
}

function logout() {

    document.cookie = "farm= ";
    console.log("logout ");

}