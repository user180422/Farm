function getVerificationToken() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}

async function verifyEmail() {
    const verificationToken = getVerificationToken();

    if (!verificationToken) {
        console.error('Verification token not found in the URL');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/verify-email?token=${verificationToken}`);
        const data = await response.json();

        handleVerificationResponse(response, data);
    } catch (error) {
        console.error('Error verifying email:', error.message);
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'An error occurred. Please try again later.';
    }
}

verifyEmail();

function handleVerificationResponse(response, data) {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    if (response.ok) {
        successMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `Verification failed: ${data.error}`;
    }
}

