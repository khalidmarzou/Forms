// Informations Stagiaires :
// declaration :
const genderInputs = document.querySelectorAll("input[type='radio']");
const cineNameInputs = document.querySelectorAll("input[type='text']");
const branchSelect = document.querySelector("select");
const btnAdd = document.getElementById("btnAdd");
class Stagiaire {
  constructor(cine, name, gender, branch) {
    this.cine = cine;
    this.name = name;
    this.gender = gender;
    this.branch = branch;
  }
}
let stagiaires = [];

// edit StagiaireNote :
// instance inside this class cine and list stagiaireNotes :
class CineNotes {
  constructor(cine, notes) {
    this.cine = cine;
    this.notes = notes;
  }
}
// Note of all stagiaire (push inside class CineNotes)
let stagiairesNotes = [];

// Fill Branchs with AJAX :
let branchs;
let modules;

document.addEventListener("DOMContentLoaded", fillBranchsStagiairesList);
function fillBranchsStagiairesList() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://getpantry.cloud/apiv1/pantry/48db89c1-ef9c-4410-b945-2c1a51212191/basket/BrachsModules",
    true
  );
  xhr.onload = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        const response = JSON.parse(this.responseText).Branchs;
        branchs = Object.keys(response);
        modules = response;
        branchs.forEach((branch) => {
          branchSelect.innerHTML += `<option value="${branch}">${branch}</option>"`;
        });
      }
    }
  };
  xhr.onerror = function () {
    alert("error at receive Branchs from the server");
  };
  xhr.send();
  // Fill stagiaires List
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://getpantry.cloud/apiv1/pantry/48db89c1-ef9c-4410-b945-2c1a51212191/basket/stagiaires",
    true
  );
  request.onload = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        const response = JSON.parse(this.responseText);
        stagiaires = response.data;
        stagiairesNotes = response.dataNote;
        console.log(stagiaires);
        console.log(stagiairesNotes);
      }
    }
  };
  request.onerror = function () {
    alert("fail to load stagiaires data");
  };
  request.send();
}

// validation form infos :
const infosValidation = (e) => {
  e.preventDefault();
  let validation = true;
  const maleRadio = genderInputs[0];
  const femaleRadio = genderInputs[1];
  const patternCineName = [/[a-z]{2}\d{4,10}/i, /[a-z]+\s[a-z]+/i];
  const errorCineName = [
    'Enter your CINE ex : "ex00000"',
    "Enter your full name with space",
  ];
  // validation CINE and Name :
  patternCineName.forEach((pattern, index) => {
    if (pattern.test(cineNameInputs[index].value)) {
      cineNameInputs[index].style.borderColor = "green";
      cineNameInputs[index].nextElementSibling.textContent = "";
      validation = validation && true;
    } else {
      cineNameInputs[index].style.borderColor = "red";
      cineNameInputs[index].nextElementSibling.textContent =
        errorCineName[index];
      validation = validation && false;
    }
  });
  // check if cine exist or not :
  const checkCine = stagiaires.find(
    (stagiaire) => stagiaire.cine === cineNameInputs[0].value
  );
  if (checkCine !== undefined) {
    validation = validation && false;
    cineNameInputs[0].style.borderColor = "red";
    cineNameInputs[0].nextElementSibling.textContent = "CINE Already Exist";
  }

  // Validation Gender :
  if (maleRadio.checked === true || femaleRadio.checked === true) {
    Array.from(genderInputs).forEach(
      (radio) => (radio.nextElementSibling.style.color = "green")
    );
    femaleRadio.parentElement.nextElementSibling.textContent = "";
    validation = validation && true;
  } else {
    Array.from(genderInputs).forEach(
      (radio) => (radio.nextElementSibling.style.color = "red")
    );
    femaleRadio.parentElement.nextElementSibling.textContent =
      "Select Your Gender";
    validation = validation && false;
  }
  // validation Branch :
  if (branchSelect.value === "") {
    branchSelect.style.borderColor = "red";
    branchSelect.nextElementSibling.textContent = "Select Your Branch";
    validation = validation && false;
  } else {
    branchSelect.style.borderColor = "green";
    branchSelect.nextElementSibling.textContent = "";
    validation = validation && true;
  }
  return validation;
};

// test validation on button add :
btnAdd.addEventListener("click", sendData);

function sendData(e) {
  const validation = infosValidation(e);
  if (validation) {
    const gender = Array.from(genderInputs).find(
      (radio) => radio.checked === true
    ).id;
    const stagiaire = new Stagiaire(
      cineNameInputs[0].value,
      cineNameInputs[1].value,
      gender,
      branchSelect.value
    );
    stagiaires.push(stagiaire);

    const stagiaireClass = new CineNotes(stagiaire.cine, {});
    stagiairesNotes.push(stagiaireClass);

    sendStagiaresAndNotesToServer();
  }
}

// show all stagiaires :
function displayAllStagiaires() {}

// test with showAll btn :
const btnShowAll = document.getElementById("btnShowAll");
btnShowAll.addEventListener("click", displayAllStagiaires);

const btnSearch = document.getElementById("search");
const searchZone = document.getElementById("searchZone");
const modulesSelect = document.getElementById("modules");
const tbodyEdit = document.getElementById("tbodyEdit");

modulesSelect.addEventListener("change", () => {
  const noteInput = tbodyEdit.children[0].children[4].firstChild;
  const stagiaireSelected = stagiairesNotes.find(
    (str) => str.cine === tbodyEdit.children[0].firstElementChild.textContent
  );
  noteInput.value = stagiaireSelected.notes[modulesSelect.value];
});

btnSearch.addEventListener("click", editStagiaire);
function editStagiaire() {
  modulesSelect.innerHTML = '<option value="">Select Module</option>';
  const cineSelected = searchZone.value;
  const stagiaire = stagiaires.find((str) => str.cine === cineSelected);
  if (stagiaire !== undefined) {
    btnSearch.parentElement.nextElementSibling.textContent = "";
    const modulesStagiaire = modules[stagiaire.branch];
    tbodyEdit.innerHTML = ` <tr>
                                <td class="border border-slate-700 text-center">${cineSelected}</td>
                                <td class="border border-slate-700 text-center">${stagiaire.name}</td>
                                <td class="border border-slate-700 text-center">${stagiaire.gender}</td>
                                <td class="border border-slate-700 text-center">${stagiaire.branch}</td>
                                <td class="border border-slate-700 text-center"><input type="number" min="0" max="20" class="border border-slate-600 rounded bg-slate-100 cursor-pointer mx-2" disabled /><input type="button" value="Send" class="mx-2 bg-green-500 hover:bg-green-900 rounded p-2 font-bold text-white cursor-pointer" onclick="sendNote(event)" /></td>
                                <td class="border border-slate-700 text-center"><input type="button" value="Edit" class="bg-red-500 hover:bg-red-900 rounded p-2 font-bold text-white cursor-pointer" onclick="removeDisabled(event)" /></td>
                            </tr>`;
    modulesStagiaire.forEach((module) => {
      modulesSelect.innerHTML += `<option value="${module}">${module}</option>`;
    });
  } else {
    btnSearch.parentElement.nextElementSibling.textContent =
      "Couldn't Found this CINE in DB";
  }
}

// removeDisabled() :
function removeDisabled(e) {
  const targetInput =
    e.target.parentElement.previousElementSibling.firstElementChild;
  targetInput.removeAttribute("disabled");
  targetInput.style.backgroundColor = "white";
  targetInput.style.borderColor = "green";
  targetInput.style.outline = "none";
  targetInput.style.paddingLeft = "3px";
}

// send Note :
function sendNote(e) {
  const noteInput = e.target.previousElementSibling;
  if (
    Number(noteInput.value) >= 0 &&
    Number(noteInput.value) <= 20 &&
    modulesSelect.value !== ""
  ) {
    noteInput.setAttribute("disabled", "");
    noteInput.style.backgroundColor = "#7BB1A4";
    stagiairesNotes.find(
      (str) =>
        str.cine ===
        noteInput.parentElement.parentElement.firstElementChild.textContent
    ).notes[modulesSelect.value] = Number(noteInput.value);
    console.log(stagiairesNotes);
    sendStagiaresAndNotesToServer();
  }
}

function sendStagiaresAndNotesToServer() {
  const formatPantry = {
    data: stagiaires,
    dataNote: stagiairesNotes,
  };

  console.log(formatPantry);
  let dataJSON = JSON.stringify(formatPantry);
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://getpantry.cloud/apiv1/pantry/48db89c1-ef9c-4410-b945-2c1a51212191/basket/stagiaires",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        console.log(this.responseText);
      }
    }
  };
  xhr.onerror = function () {
    alert("couldn't send infos stagiare to the server");
  };
  xhr.send(dataJSON);
}
