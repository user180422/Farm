function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('farm');

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

    fetch('http://localhost:4000/api/loginCheck', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                logoutElements.style.display = 'block';
                loginElements.style.display = 'none';
                dashboard.style.display = 'block'
                renderNow.style.display = 'block'
            } else {
                loginElements.style.display = 'block';
                logoutElements.style.display = 'none';
                dashboard.style.display = 'none'
                renderNow.style.display = 'none'
                window.location.href = 'login.html'
            }
        })
        .catch(error => console.error('Error:', error));
} else {
    loginElements.style.display = 'block';
    logoutElements.style.display = 'none';
    dashboard.style.display = 'none'
    renderNow.style.display = 'none'
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

const failedMsg = document.querySelector(".failedMsg");
const totalElement = document.getElementById('total');
const submittedElement = document.getElementById('submitted');
const processElement = document.getElementById('process');
const completedElement = document.getElementById('completed');
const failedElement = document.getElementById('failed');
const noData = document.getElementById('no-data');
const totalBalance = document.getElementById('balance');
const spendCon = document.getElementById('spend')

let balancePrice = 0
let priceUsed = 0
let totalCount = 0
let submittedCount = 0;
let processCount = 0;
let completedCount = 0;
let failedCount = 0

async function fetchDashboardData() {
    fetch('http://localhost:4000/api/dashboard', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("data", data);
            if (data.success) {
                totalCount = data.data.length
                data.data.forEach(item => {

                    const newRow = document.createElement('tr');

                    const pathParts = item.path.split('\\');
                    const displayText = pathParts[pathParts.length - 1];

                    const cell1 = createTableCell(displayText);
                    const cell2 = createTableCell(item.created_at);
                    const cell3 = createTableCell(item.status);
                    const cell4 = createLinkCell(item.downloadPath);

                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);

                    const tbody = document.getElementById('dataBody');
                    tbody.appendChild(newRow);

                    if (item.status === 'submitted') {
                        submittedCount++;
                    } else if (item.status === 'process') {
                        processCount++;
                    } else if (item.status === 'completed') {
                        completedCount++;
                    } else if (item.status === 'failed') {
                        failedCount++
                    }
                });

                function createTableCell(text) {
                    const cell = document.createElement('td');
                    cell.style.backgroundColor = '#1D1D1D';
                    cell.style.color = 'white';
                    cell.textContent = text;
                    return cell;
                }

                function createLinkCell(link) {
                    const cell = document.createElement('td');
                    cell.style.backgroundColor = '#1D1D1D';
                    cell.style.color = 'white';

                    if (link) {
                        const buttonElement = document.createElement('button');
                        buttonElement.textContent = 'Download';
                        buttonElement.style.backgroundColor = '#e80cc0';
                        buttonElement.style.color = 'white';
                        buttonElement.style.border = 'none';
                        buttonElement.style.borderRadius = '8px';

                        const pathParts = link.split('\\');
                        const lastElement = pathParts[pathParts.length - 1];

                        buttonElement.onclick = function (clickedLink, fileName) {
                            return function () {
                                console.log('Button clicked:', clickedLink);
                                console.log('File Name:', fileName);

                                fetch(`http://localhost:4000/api/downloadFile/${fileName}`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                })
                                    .then(response => {
                                        // Check if the response is successful
                                        if (!response.ok) {
                                            throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
                                        }

                                        // Extract the filename from the Content-Disposition header
                                        const contentDisposition = response.headers.get('Content-Disposition');
                                        const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);

                                        const suggestedFileName = filenameMatch ? filenameMatch[1] : fileName;

                                        // Trigger the download
                                        response.blob().then(blob => {
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = suggestedFileName;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        });
                                    })
                                    .catch(error => {
                                        console.error('Error downloading file:', error);
                                    });
                            };
                        }(link, lastElement);

                        cell.appendChild(buttonElement);
                    } else {
                        cell.textContent = '-';
                    }

                    return cell;
                }

                totalElement.textContent = totalCount ? `Total Projects: ${totalCount}` : 'Total Projects: 0';
                submittedElement.textContent = submittedCount ? `Submitted: ${submittedCount}` : 'Submitted: 0';
                processElement.textContent = processCount ? `Process: ${processCount}` : 'Process: 0';
                completedElement.textContent = completedCount ? `Completed: ${completedCount}` : 'Completed: 0';
                failedElement.textContent = failedCount ? `Failed: ${failedCount}` : 'Failed: 0';
                totalBalance.textContent = data.userData[0].totalPrice ?
                    `Balance: $ ${data.userData[0].totalPrice}` : 'Balance: $0'
                spendCon.textContent = data.userData[0].priceUsed ? `Spend: $ ${data.userData[0].priceUsed}` :
                    'Spend: $0'

            } else {
                noData.textContent = "No Data To Shown"
            }
        })
        .catch(error => {
            console.log("er", error);
            failedMsg.innerHTML = "Error fetching dashboard data";
            setTimeout(() => {
                failedClosePopup();
            }, 5000);
            showFailedPopup();
        });
}

fetchDashboardData();

async function fetchUserPayments() {
    try {
        const response = await fetch('http://localhost:4000/api/paymentList', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            // Render payment data inside modal
        } else {
            // No data, show a message
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}


