var user_name = localStorage.getItem("name");
console.log(user_name);
let current = document.querySelector("#replacee");

if (user_name != null) {
  current.innerHTML = user_name;
  let replacee = document.createElement("a");
  replacee.classList.add("nav-link");
  replacee.classList.add("active");
  replacee.style.fontSize = "16px";
  replacee.style.marginTop = "10px";
  replacee.innerHTML = user_name;
  replacee.href = current.href;
  current.parentNode.appendChild(replacee);
  current.parentNode.replaceChild(replacee, current);
  function changeToShoppingCart() {
    window.location = "shoppingcart.html";
  }
}
console.log(current.innerHTML);

function checkInput() {
  const username = document.getElementById("username_1").value;
  const password = document.getElementById("password_1").value;

  console.log(username);
  console.log(password);

  if (username == "" || password == "")
    alert("Tên đăng nhập hoặc mật khẩu còn trống");
  else {
    var user = username;
    window.location = "index.html";
  }
  localStorage.setItem("name", username);
}
