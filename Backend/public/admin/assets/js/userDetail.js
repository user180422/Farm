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

function fetchUserData() {

    const errorContainer = document.getElementById('error-container')

    fetch(`http://localhost:4000/api/userDetail/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {

            console.log("data", data.data);

            // project
            const projectData = data.data.statusCounts
            const totalProjectElement = document.getElementById('totalProject');
            const completedProjectElement = document.getElementById('completedProject');
            const processingProjectElement = document.getElementById('processingProject');
            const failedProjectElement = document.getElementById('failedProject');

            totalProjectElement.textContent = projectData.totalCount || 0;
            completedProjectElement.textContent = projectData.completed || 0;
            processingProjectElement.textContent = projectData.process || 0;
            failedProjectElement.textContent = projectData.failed || 0;

            const user = data.data.users

            // price
            const pricingData = data.data.pricing
            const totalPriceElement = document.getElementById('totalPrice');
            const usedPriceElement = document.getElementById('usedPrice');
            const refundedPriceElement = document.getElementById('refundedPrice');

            totalPriceElement.textContent = user.totalPrice || 0;
            usedPriceElement.textContent = user.priceUsed || 0;
            refundedPriceElement.textContent = data.data.refundedAmount || 0;

            const refundData = data.data.refunds;
            const refundContainer = document.getElementById('refundContainer');
            if (refundData.length > 0) {
                refundData.forEach(refund => {
                    console.log("refund", refund);
                    refundContainer.innerHTML += `
                        <div class="preview-item border-bottom">
                            <div class="preview-item-content d-flex flex-grow">
                                <div class="flex-grow">
                                    <div class="d-flex d-md-block d-xl-flex justify-content-between">
                                        <h6 class="preview-subject text-muted">Email: <span class="text-white">${refund.email}</span></h6>
                                    </div>
                                    <div>
                                        <p class="text-muted">App: <span class="text-white">${refund.paymentMethod}</span></p>
                                        <p class="text-muted">Id: <span class="text-white">${refund.paymentId}</span></p>
                                    </div>
                                    <div>
                                        <p class="text-muted fw-bold">Amount: <span class="text-white">$${refund.amound}</span></p>
                                        <p class="text-muted fw-bold">Status: <span class="text-white">${refund.status}</span></p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                <div class="form-group d-flex align-items-center">
                                    <label for="statusDropdown" class="px-3">Action:</label>
                                    <select class="form-control" aria-colcount="text-white" id="statusDropdown" 
                                            style="background-color: white;"  
                                            onchange="handleStatusChange(this.value, '${refund._id}', '${refund.email}', ${refund.amound})"
                                            ${refund.status === 'completed' ? 'disabled' : ''}>
                                        <option value="requested" ${refund.status === 'requested' ? 'selected' : ''} class="text-dark mb-1">Requested</option>
                                        <option value="completed" ${refund.status === 'completed' ? 'selected' : ''} class="text-dark">Completed</option>
                                        <option value="failed" ${refund.status === 'failed' ? 'selected' : ''} class="text-dark">Failed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                refundContainer.innerHTML = `
                    <div class="text-center">
                        <p class="text-danger px-5 py-2">No Refunds to show</p>
                    </div>
                `;
            }


            // for table data
            const tableData = data.data.projects;
            const tableDataContainer = document.getElementById('table-data');
            const noUserContainer = document.getElementById('no-user-data')
            tableData.length > 0 ? tableData.forEach(project => {
                const name = project.path.replace(/\\/g, '/').split('/').pop()
                console.log("name", name);
                tableDataContainer.innerHTML += `
                <tr>
                    <td>
                        <span>${name}</span>
                    </td>
                    <td>${project.created_at}</td>
                    <td>${project.status}</td>
                    <td>
                        <button type="button" class="btn btn-primary">
                            Download
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick=${project._id}>
                            update
                        </button>
                    </td>
                </tr>
            `;
            }) : (noUserContainer.innerHTML = `
                <div class="text-center">
                    <p class="text-danger px-5 py-2">No Projects to show</p>
                </div>
            `);
        })
        .catch(error => {
            setTimeout(() => {
                errorContainer.innerHTML = "Somthing went wrong try later"
            }, 5000)
        });

}

fetchUserData()


function handleStatusChange(selectedValue, id, email, amount) {

    const errorContainer = document.getElementById('error-container')

    const apiUrl = 'http://localhost:4000/api/refundStatusUpdate';

    const requestData = {
        selectedValue: selectedValue,
        id: id,
        email: email,
        amount: amount
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("data eee", data);
            const currentPage = window.location.href
            console.log("currentPage", currentPage);
            if (data.success) {
                window.location.href = currentPage
            } else {
                setTimeout(() => {
                    errorContainer.innerHTML = "Somthing went wrong try later"
                }, 5000)
            }
        })
        .catch(error => {
            setTimeout(() => {
                errorContainer.innerHTML = "Somthing went wrong try later"
            }, 5000)
        });
}


function handleFormSubmit(event) {
    event.preventDefault();

    var projectName = document.getElementById('projectName').value;
    var fileUploader = document.getElementById('fileUploader').value;
    var statusDropdown = document.getElementById('statusDropdown').value;

    console.log("Project Name:", projectName);
    console.log("File Upload:", fileUploader);
    console.log("Status:", statusDropdown);

    document.getElementById('myForm').reset();
}