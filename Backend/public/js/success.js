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
    window.location.href = 'index.html'
}

async function getUserSession() {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };

    try {
        const response = await fetch(`http://localhost:4000/api/user-session`, requestOptions);
        const data = await response.json();

        console.log("data this ", data);

        if (data.sessionId) {
            subsId = data.sessionId
        } else {
            document.getElementById('result').innerText = `Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('result').innerText = 'Error fetching data.';
    }
}

getUserSession()

// const getSubscription = async () => {

//     console.log("working first");

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ id: subsId })
//     };

//     try {
//         console.log("working second");

//         if (!subsId) {
//             alert('Subscription ID is required.');
//             return;
//         }   

//         const response = await fetch(`http://localhost:4000/api/sub`, requestOptions);
//         if(response){
//             const data =
//         }

//     } catch (error) {
//         console.log('Error:', error);
//     }
// }

function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
    window.location.href = 'index.html'
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

let subsId
const getSubscription = async () => {

    const failedMsg = document.querySelector(".failedMsg");

    try {

        if (!subsId) {
            alert('Subscription ID is required.');
            return;
        }

        const response = await fetch('http://localhost:4000/api/sub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: subsId }),
        });

        const data = await response.json();

        if (data.paymentStatus === 'paid') {
            window.location.href = 'renderNow.html'
        } else {
            failedMsg.innerHTML = "Payment Failed Try Again"
            setTimeout(() => {
                failedClosePopup();
            }, 5000);
            showFailedPopup();
        }
    } catch (error) {
        failedMsg.innerHTML = "Somthing went wrong"
        setTimeout(() => {
            failedClosePopup();
        }, 5000);
        showFailedPopup();
    }
};



