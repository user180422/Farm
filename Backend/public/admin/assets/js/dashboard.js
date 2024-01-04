(function ($) {
  'use strict';
  $.fn.andSelf = function () {
    return this.addBack.apply(this, arguments);
  }
  $(function () {
    if ($("#currentBalanceCircle").length) {
      var bar = new ProgressBar.Circle(currentBalanceCircle, {
        color: '#000',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 12,
        trailWidth: 12,
        trailColor: '#0d0d0d',
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: '#d53f3a', width: 12 },
        to: { color: '#d53f3a', width: 12 },
        // Set default step function for all animate calls
        step: function (state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);

          var value = Math.round(circle.value() * 100);
          circle.setText('');

        }
      });

      bar.text.style.fontSize = '1.5rem';
      bar.animate(0.4);  // Number from 0.0 to 1.0
    }
    if ($('#audience-map').length) {
      $('#audience-map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        panOnDrag: true,
        focusOn: {
          x: 0.5,
          y: 0.5,
          scale: 1,
          animate: true
        },
        series: {
          regions: [{
            scale: ['#3d3c3c', '#f2f2f2'],
            normalizeFunction: 'polynomial',
            values: {

              "BZ": 75.00,
              "US": 56.25,
              "AU": 15.45,
              "GB": 25.00,
              "RO": 10.25,
              "GE": 33.25
            }
          }]
        }
      });
    }
    // if ($("#transaction-history").length) {
    //   var areaData = {
    //     labels: ["Profit", "Refund"],
    //     datasets: [{
    //       data: [totalProfit, 1000],
    //       backgroundColor: [
    //         "#23fa14", "#e8f002" 
    //       ]
    //     }
    //     ]
    //   };
    //   var areaOptions = {
    //     responsive: true,
    //     maintainAspectRatio: true,
    //     segmentShowStroke: false,
    //     cutoutPercentage: 70,
    //     elements: {
    //       arc: {
    //         borderWidth: 0
    //       }
    //     },
    //     legend: {
    //       display: false
    //     },
    //     tooltips: {
    //       enabled: true
    //     }
    //   }
    //   var transactionhistoryChartPlugins = {
    //     beforeDraw: function (chart) {
    //       var width = chart.chart.width,
    //         height = chart.chart.height,
    //         ctx = chart.chart.ctx;

    //       ctx.restore();
    //       var fontSize = 1;
    //       ctx.font = fontSize + "rem sans-serif";
    //       ctx.textAlign = 'left';
    //       ctx.textBaseline = "middle";
    //       ctx.fillStyle = "#ffffff";

    //       var text = '',
    //         textX = Math.round((width - ctx.measureText(text).width) / 2),
    //         textY = height / 2.4;

    //       ctx.fillText(text, textX, textY);

    //       ctx.restore();
    //       var fontSize = 0.75;
    //       ctx.font = fontSize + "rem sans-serif";
    //       ctx.textAlign = 'left';
    //       ctx.textBaseline = "middle";
    //       ctx.fillStyle = "#6c7293";

    //       var texts = "",
    //         textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
    //         textsY = height / 1.7;

    //       ctx.fillText(texts, textsX, textsY);
    //       ctx.save();
    //     }
    //   }
    //   var transactionhistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");
    //   var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
    //     type: 'doughnut',
    //     data: areaData,
    //     options: areaOptions,
    //     plugins: transactionhistoryChartPlugins
    //   });
    // }
    if ($("#transaction-history-arabic").length) {
      var areaData = {
        labels: ["Profit", "Refund"],
        datasets: [{
          data: [55, 25],
          backgroundColor: [
            "#111111", "#00d25b", "#ffab00"
          ]
        }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function (chart) {
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";

          var text = '',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2.4;

          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "مجموع",
            textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
            textsY = height / 1.7;

          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history-arabic").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }
    if ($('#owl-carousel-basic').length) {
      $('#owl-carousel-basic').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4500,
        navText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
    }
    var isrtl = $("body").hasClass("rtl");
    if ($('#owl-carousel-rtl').length) {
      $('#owl-carousel-rtl').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        nav: true,
        rtl: isrtl,
        autoplay: true,
        autoplayTimeout: 4500,
        navText: ["<i class='mdi mdi-chevron-right'></i>", "<i class='mdi mdi-chevron-left'></i>"],
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
    }
  });
})(jQuery);

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

  fetch('http://localhost:4000/api/projectData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
    .then(response => response.json())
    .then(data => {

      console.log("data", data);

      // project status
      const statusCounts = data.data.statusCounts
      document.getElementById('totalProject').textContent = statusCounts.totalCount;
      document.getElementById('completedProject').textContent = statusCounts.completed || 0;
      document.getElementById('processingProject').textContent = statusCounts.process || 0;
      document.getElementById('failedProject').textContent = statusCounts.failed || 0;

      // totalAmount
      const totalProfit = data.data.totalAmount
      const totalRefund = data.data.refundAmount
      createTransactionHistoryChart(totalProfit, totalRefund);
      document.getElementById("profit").textContent = `$${totalProfit}` || 0;
      document.getElementById("refund").textContent = `$${totalRefund}` || 0;

      // quotesData
      const quotesData = data.data.quotesData
      const messageContainer = document.getElementById("messageContainer")
      if (quotesData.length > 4) {
        for (let i = 0; i < 4; i++) {

          const dateObject = new Date(quotesData[i].createdAt);
          const day = String(dateObject.getUTCDate()).padStart(2, "0");
          const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
          const year = String(dateObject.getUTCFullYear());
          const formattedDate = day + '-' + month + '-' + year;

          messageContainer.innerHTML += `
            <div class="preview-item border-bottom">
              <div class="preview-item-content d-flex flex-grow">
                <div class="flex-grow">
                  <div class="d-flex d-md-block d-xl-flex justify-content-between">
                    <h6 class="preview-subject">${quotesData[i].name}</h6>
                    <p class="text-muted text-small">${formattedDate}</p>
                  </div>
                  <p class="text-muted">${quotesData[i].quote.length > 40 ? `${quotesData[i].quote.substring(0, 40)}...` : quotesData[i].quote}</p>
                </div>
              </div>
            </div>
          `
        }
      } else {
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
                    <h6 class="preview-subject">${item.name}</h6>
                    <p class="text-muted text-small">${formattedDate}</p>
                  </div>
                  <p class="text-muted">${item.quote.length > 40 ? `${item.quote.substring(0, 40)}...` : item.quote}</p>
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
      }

      // user
      const userData = data.data.users
      const tableBodyContainer = document.getElementById('table-data');
      const noUserContainer = document.getElementById('no-user-data')
      userData.length > 0 ? userData.forEach(user => {
        tableBodyContainer.innerHTML += `
        <tr>
          <td>
            <span>${user.username}</span>
          </td>
          <td>${user.email}</td>
          <td>${user.totalPrice == undefined ? 0 : user.totalPrice}</td>
          <td>${user.priceUsed}</td>
          <td>
            <a class="text-decoration-none" href="userDetail.html?id=${user.email}">View</a>
          </td>
        </tr>
        `;
      }) : (noUserContainer.innerHTML = `
        <div class="text-center">
          <p class="text-danger px-5 py-2">No users to show</p>
        </div>
      `);
    })
    .catch(error => {
      console.error('Error:', error);
    });

}

projectData()

function createTransactionHistoryChart(profit, refund) {

  if ($("#transaction-history").length) {
    var areaData = {
      labels: ["Profit", "Refund"],
      datasets: [{
        data: [profit, refund],
        backgroundColor: [
          "#23fa14", "#e8f002"
        ]
      }]
    };
    var areaOptions = {
      responsive: true,
      maintainAspectRatio: true,
      segmentShowStroke: false,
      cutoutPercentage: 70,
      elements: {
        arc: {
          borderWidth: 0
        }
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: true
      }
    }
    var transactionhistoryChartPlugins = {
      beforeDraw: function (chart) {
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;

        ctx.restore();
        var fontSize = 1;
        ctx.font = fontSize + "rem sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";

        var text = `$${profit}`,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2.4;

        ctx.fillText(text, textX, textY);

        ctx.restore();
        var fontSize = 0.75;
        ctx.font = fontSize + "rem sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#6c7293";

        var texts = "Total",
          textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
          textsY = height / 1.7;

        ctx.fillText(texts, textsX, textsY);
        ctx.save();
      }
    }
    var transactionhistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");
    var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
      type: 'doughnut',
      data: areaData,
      options: areaOptions,
      plugins: transactionhistoryChartPlugins
    });
  }
}

