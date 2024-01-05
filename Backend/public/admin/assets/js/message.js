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

function projectData() {

    const errorContainer = document.getElementById('error-container')

    fetch('http://localhost:4000/api/projectData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then(data => {
            // quotesData
            const quotesData = data.data.quotesData;
            const messageContainer = document.getElementById("messageContainer");

            quotesData.length > 0
                ? quotesData.forEach(item => {

                    const dateObject = new Date(item.createdAt);
                    const day = String(dateObject.getUTCDate()).padStart(2, "0");
                    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
                    const year = String(dateObject.getUTCFullYear());
                    const formattedDate = day + '-' + month + '-' + year;

                    messageContainer.innerHTML += `
                        <div class="preview-item border-bottom">
                            <div class="preview-item-content d-flex flex-grow">
                                <div class="flex-grow">
                                    <div class="d-flex d-md-block d-xl-flex justify-content-between">
                                        <h6 class="preview-subject text-muted">Name: ${item.name}</h6>
                                        <p class="text-muted text-small">${formattedDate}</p>
                                    </div>
                                    <div>
                                        <p class="text-muted">Phone: ${item.countryCode} ${item.phone}</p>
                                        <p class="text-muted">Email: ${item.email}</p>
                                    </div>
                                    <div class="mt-3 text-center px-5">
                                        <p class="text-white fw-bold">${item.quote}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                })
                : (messageContainer.innerHTML = `
                    <div class="text-center">
                        <p class="text-danger">No Messages to show</p>
                    </div>
                `);
        })
        .catch(error => {
            setTimeout(() => {
                errorContainer.innerHTML = "Somthing went wrong try later"
            }, 5000)
        });

}

projectData();



