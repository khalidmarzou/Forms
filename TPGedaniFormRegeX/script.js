const email = document.getElementById("email");
const password = document.getElementById("password");
const btnCheck = document.getElementById("Check");
const emailPattern = /\w{3,}@[a-z]{2,10}\.[a-z]{2,6}/i;
const passwordPattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;
const errorsP = document.getElementById("errors");
btnCheck.onclick = () => {
  if (emailPattern.test(email.value)) {
    email.style.borderColor = "green";
  } else {
    email.style.borderColor = "red";
  }
  if (passwordPattern.test(password.value)) {
    password.style.borderColor = "green";
    errorsP.innerHTML = "Password &#10004;";
    errorsP.style.color = "green";
  } else {
    password.style.borderColor = "red";
    errorsP.innerHTML = "Password :";
    if (!/[A-Z]/.test(password.value)) {
      errorsP.innerHTML += "<br/>Password must contain at least one upper case";
    }
    if (!/[a-z]/.test(password.value)) {
      errorsP.innerHTML += "<br/>Password must contain at least one Lower case";
    }
    if (!/[^A-Za-z0-9]/.test(password.value)) {
      errorsP.innerHTML +=
        "<br/>Password must contain at least one special Char";
    }
    if (!/\d/.test(password.value)) {
      errorsP.innerHTML += "<br/>Password must contain at least one number";
    }
    if (!(password.value.length >= 8)) {
      errorsP.innerHTML +=
        "<br/>And finaly don't forget the Password must be over at 8 chars";
    }
  }
};
const patternBranches = /[a-z]{1,}(?=(\s:))/gi;
const patternModules = /(^\w+|(?!([:\w])))[^:]+(?=(\s:\w+))/gi;
const strrr =
  "dev : HTML CSS ALGO JS PHP info : LINUX KALI UBUNTU DEBIAN electromecanique : CC CA MECANIQUE ELETRONIQUE ELECTRICITE";
console.log(strrr.match(patternModules));
function LoadData() {
  const request = new XMLHttpRequest();
  request.open("GET", "http://khalidmarzoug.pythonanywhere.com/", true);
  request.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText).data;
      console.log(data);
    }
  };
  request.onerror = function (error) {
    console.error("error in fetch url", error);
  };
  request.send();
}
