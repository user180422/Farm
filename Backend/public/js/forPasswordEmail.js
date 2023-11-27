function failedClosePopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'none';
}
function showFailedPopup(popupId) {
    var popup = document.getElementById("failedPopup");
    popup.style.display = 'block';
}

function validateAndSubmit(event) {

    const msgContainer = document.querySelector(".msg")
    const failedMsg = document.querySelector(".failedMsg")

    event.preventDefault();
    var email = document.getElementById('email').value;

    document.getElementById('emailError').innerText = '';

    if (!email) {
        document.getElementById('emailError').innerText = 'Email is required';
        return
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').innerText = 'Invalid email format';
            return
        }
    }

    if (!email) {
        return false;
    } else {
        const data = {
            email: email
        };

        fetch('http://localhost:4000/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {

                if (data.success) {
                    failedMsg.innerHTML = data.success
                    document.getElementById('email').value = ""
                    setTimeout(() => {
                        failedClosePopup()
                    }, 5000)
                    showFailedPopup()
                } else {
                    failedMsg.innerHTML = data.error
                    setTimeout(() => {
                        failedClosePopup()
                    }, 5000)
                    showFailedPopup()
                }
            })
            .catch(error => {
                failedMsg.innerHTML = "Somthing went wrong"
            });
    }

}
