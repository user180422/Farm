// first call

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('farmAdmin');
console.log("t", token);

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

    fetch('http://localhost:4000/api/adminCheck', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.isAuthenticated) {
                console.log("User is authenticated");
                console.log("data", data);
            } else {
                console.log("User is not authenticated, redirecting to login");
                window.location.href = '/login.html';
            }
        })
        .catch(error => console.error('Fetch error:', error));
} else {
    console.log("No token found, redirecting to login");
    window.location.href = '/login.html';
}


function logout() {
    document.cookie = "farmAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'index.html';
}

const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get('id');

console.log('User ID:', userId);