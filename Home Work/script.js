const patternName = /[a-z]+\s[a-z]+(\s[a-z]+)?/i;
const patternEmail = /\w{3,}@[a-z]{3,10}\.[a-z]{2,6}/i;
const patternPassword = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;
const inputs = document.getElementsByTagName("input");
const gender = document.getElementsByTagName("select")[0];
const checkNameMailPassword = () => {
  const patternList = [patternName, patternEmail, patternPassword];
  const errorMessage = [
    "Enter Your Full Name",
    "Enter a Valid Mail",
    "Enter Your Password (At least 8 chars with digits and at least one special char)",
  ];
  for (let i = 0; i < inputs.length - 2; i++) {
    if (patternList[i].test(inputs[i].value)) {
      inputs[i].style.borderColor = "green";
      inputs[i].nextElementSibling.textContent = "";
    } else {
      inputs[i].style.borderColor = "red";
      inputs[i].nextElementSibling.textContent = errorMessage[i];
    }
  }
};
inputs[inputs.length - 1].onclick = function (event) {
  event.preventDefault();
  checkNameMailPassword();
  checkBirthDayGender();
};
const checkBirthDayGender = () => {
  const errorMessage = ["Enter Your Birth day", "Select Your Gender"];
  if (inputs[3].value === "") {
    inputs[3].style.borderColor = "red";
    inputs[3].nextElementSibling.textContent = errorMessage[0];
  } else {
    inputs[3].style.borderColor = "green";
    inputs[3].nextElementSibling.textContent = "";
  }
  if (gender.value === "") {
    gender.style.borderColor = "red";
    gender.nextElementSibling.textContent = errorMessage[1];
  } else {
    gender.style.borderColor = "green";
    gender.nextElementSibling.textContent = "";
  }
};
