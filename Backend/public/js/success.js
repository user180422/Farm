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
        }
    };

    try {
        const response = await fetch(`http://localhost:4000/api/user-session`, requestOptions);
        const data = await response.json();

        console.log("data", data);

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

let subsId 

const getSubscription = async () => {
    try {
        const subscriptionId = subsId

        if (!subscriptionId) {
            alert('Subscription ID is required.');
            return;
        }

        const response = await fetch(`http://localhost:4000/api/subscription?id=${subscriptionId}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to retrieve subscription');
        }

        const data = await response.json();
        console.log('Subscription:', data.subscription);
        console.log('Payment Status:', data.paymentStatus);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

