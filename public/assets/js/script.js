const charts = document.querySelectorAll(".chart");

charts.forEach(function (chart) {
  var ctx = chart.getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

$(document).ready(function () {
  $(".data-table").each(function (_, table) {
    $(table).DataTable();
  });
});

// ajax call
// process order
$("order_form").on("submit", function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr("action");
  var method = form.attr("method");
  var data = form.serialize();
  $.ajax({
    url: url,
    type: method,
    data: data,
    success: function (data) {
      console.log(data);
      window.location.href = "/order/success";
    },
  });
});

// autocomplete search
// autocomplete
function getData(str) {
  if (str.length == 0) {
    document.getElementById("suggestion").innerHTML = "";
    document.getElementById("suggestion").style.border = "0px";
  }

  // ajax call
  http.ajax({
    url: `/search?q=${str}`,
    method: "GET",
    dataType: "json",
    success: (res) => {
      let data = res.posts.data;
      let html = "";
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          html += `
          <a class="dropdown-item" href="/?q=${data[i].name}">${data[i].name}</a>
          `;
        }
      } else {
        html = "";
      }
      document.getElementById("suggestion").innerHTML = html;
      document.getElementById("suggestion").style.border = "1px solid #A5ACB2";
    },
  });
}
const showResult = debounce(getData, 300);
// end autocomplete

// multilevel category
toggleMultilevelCategory();
function toggleMultilevelCategory() {
  var toggler = document.getElementsByClassName("caret");
  var i;

  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }

  document.addEventListener("click", function () {
    const el = document.getElementById("ccontainer");
    if(el.classList.contains("active")){
      el.classList.remove("active")
    }
  },true);
  // var toggler = document.getElementsByClassName("caret");
  // var i;

  // for (i = 0; i < toggler.length; i++) {
  //   toggler[i].addEventListener("click", function () {
  //     this.parentElement.querySelector(".nested").classList.toggle("active");
  //     this.classList.toggle("caret-down");
  //   });
  // }
}

// end multilevel category
