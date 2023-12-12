var user_name = localStorage.getItem("admin_name");
console.log(user_name);
let current = document.querySelector("#admin_name");
let replacee = document.createElement("p");
replacee.classList.add("d-inline");
replacee.style.fontSize = "24px";
replacee.style.color = "white";
replacee.innerHTML = user_name;
replacee.href = current.href;

current.parentNode.appendChild(replacee);
current.parentNode.replaceChild(replacee, current);

document.querySelector("#myModal_1").innerHTML;
// $("#log-out").click(function(){
//     $("#myModal_1").toggle();
//   });

function checkInput() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username == "" || password == "")
    alert("Tên đăng nhập hoặc mật khẩu còn trống");
  else {
    window.location = "admin.html";
  }
  localStorage.setItem("admin_name", username);
}
