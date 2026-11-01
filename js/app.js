const $=id=>document.getElementById(id);
const money=n=>"₹ "+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});

const seedVehicles=[
 {registration:"MP04 AB 1234",rfid:"A4:2B:91:E1",category:"Car",balance:1250,status:"Active",registered:"2026-10-01"},
 {registration:"MP04 CD 5678",rfid:"09:7F:2A:B4",category:"Bike",balance:450,status:"Active",registered:"2026-10-04"},
 {registration:"MP04 EF 9012",rfid:"B2:81:6D:30",category:"Truck",balance:1000,status:"Inactive",registered:"2026-10-09"},
 {registration:"MP04 GH 3456",rfid:"C7:14:AA:62",category:"Bus",balance:550,status:"Active",registered:"2026-10-12"}
];

const seedTransactions=[
 {id:"TX-1048",timestamp:"2026-10-25T10:42:00",vehicleRegistration:"MP04 AB 1234",rfidUid:"A4:2B:91:E1",category:"Car",tollAmount:80,status:"Success",balanceAfter:1250},
 {id:"TX-1047",timestamp:"2026-10-25T10:37:00",vehicleRegistration:"MP04 CD 5678",rfidUid:"09:7F:2A:B4",category:"Bike",tollAmount:25,status:"Success",balanceAfter:450},
 {id:"TX-1046",timestamp:"2026-10-25T10:31:00",vehicleRegistration:"UNKNOWN",rfidUid:"FF:21:09:AB",category:"Unknown",tollAmount:0,status:"Rejected",balanceAfter:"—"},
 {id:"TX-1045",timestamp:"2026-10-25T10:22:00",vehicleRegistration:"MP04 GH 3456",rfidUid:"C7:14:AA:62",category:"Bus",tollAmount:120,status:"Success",balanceAfter:550},
 {id:"TX-1044",timestamp:"2026-10-25T10:15:00",vehicleRegistration:"MP04 AB 1234",rfidUid:"A4:2B:91:E1",category:"Car",tollAmount:80,status:"Success",balanceAfter:1330}
];

const seedRates={bike:20,car:50,bus:80,truck:100};

window.seedVehicles = seedVehicles;
window.seedTransactions = seedTransactions;
window.seedRates = seedRates;

function loadLocal(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
function saveLocal(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(e){console.warn(e)}}

function toast(msg){
  let t=$("toast");
  if(!t)return;
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),3000);
}
window.toast = toast;

function initTheme(){
  if(localStorage.getItem("tolleraTheme")==="light"){
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
  const b=$("themeBtn");
  if(b){
    b.innerHTML=`<span class="material-symbols-outlined">${document.body.classList.contains("light")?"light_mode":"dark_mode"}</span>`;
  }
}

function setupTheme(){
  initTheme();
  $("themeBtn")?.addEventListener("click",()=>{
    document.body.classList.toggle("light");
    localStorage.setItem("tolleraTheme",document.body.classList.contains("light")?"light":"dark");
    initTheme();
  });
}

function navActive(){
  const p=location.pathname.split("/").pop()||"index.html";
  document.querySelectorAll(".nav a").forEach(a=>{
    a.classList.toggle("active",a.dataset.page===p);
  });
}

function initAppBase(){
  setupTheme();
  navActive();
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",initAppBase);
}else{
  initAppBase();
}
