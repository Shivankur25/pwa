const App =  {
  deferredInstall : null,
  messaging : null,


  init(){
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js')
          .then((reg)=> {
                console.log('service worker is register',reg);
                requestNotificationPermission();
              }
          )
          .catch((err)=> console.log('service worker is not register',err));
    }

    const beforeInstallListener = e => {
      // Prevent Chrome 76 and later from showing the install prompt
      e.preventDefault();
      App.deferredInstall = e;
      console.log("install prompt saved in object");


    };
    installOrNot();

    window.addEventListener("beforeinstallprompt", beforeInstallListener);

    let button = document.getElementById("installBtn");
    try{


      button.addEventListener("click",event =>{
        if(App.deferredInstall){
          console.log(App.deferredInstall);
          App.deferredInstall.prompt();
          App.deferredInstall.userChoice.then(choiceResult=>{
                if (choiceResult.outcome === "accepted") {
                  console.log("User accepted the PWA prompt");
                  shwoProgress();

                } else {
                  console.log("User dismissed the PWA prompt");
                }
              }

          );



        }else{
          console.log("install prompt not saved");
        }




      });
    }catch(e){
      console.log(e);
    }

  }


}



const requestNotificationPermission =  async () =>{
  if('Notification' in window){
    console.log("Notification is register");
    const permission = await Notification.requestPermission();

    if(permission !=="granted"){
      console.log("Permission is not granted");

    }
  }

}

function shwoProgress(){
  let installBtn = document.getElementById("installBtn");
  let installText = document.getElementById("installText");
  let installDiv = document.getElementById("install");
  let uninstallDiv = document.getElementById("uninstall");
  let appLogo = document.getElementById("app-logo");
  let spinner = document.getElementById("spinner");
  let progressText = document.getElementById("progress");

  let progress = 1;

  // Disable button to prevent multiple clicks
  installBtn.disabled = true;
  //  installText.textContent = "Installing..."; // Change button text to "Installing..."

  // Add spinner animation and shrink the logo
  spinner.classList.add("spinner-active");
  appLogo.classList.add("shrink-logo");
  installBtn.classList.add("disable-btn")

  // Show progress message
  progressText.textContent = `${progress}%`;

  // Simulate progress (1% to 100%)
  let interval = setInterval(() => {
    progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      spinner.classList.remove("spinner-active");
      appLogo.classList.remove("shrink-logo");

      // Hide Install Button
      installDiv.style.opacity = "0";
      installDiv.style.display = "none";
      uninstallDiv.classList.add("show");
      uninstallDiv.style.display = "flex";
      installText.textContent = "Open"; // Change button text to "Open"
      installBtn.disabled = false; // Re-enable button

      // Show "Installed" message
      progressText.textContent = "Installed";
      // Remove spinner effect after installation

      installOrNot();

    }
    progress++;
  }, 150); // Adjust speed of the percentage increase



}

async function installOrNot() {
  if ('getInstalledRelatedApps' in navigator) {
    installNavigator = navigator;
    console.log("a");
    const relatedApps = await navigator.getInstalledRelatedApps();
    console.log("relatedApps",relatedApps);
    relatedApps.forEach((app) => {
      //if your PWA exists in the array it is installed
      console.log(app.platform, app.url);
      let  installDiv  = document.getElementById("install");
      let uninstallDiv = document.getElementById("uninstall");
      installDiv.style.display = "none";
      uninstallDiv.style.display = "flex";
      uninstallDiv.classList.add("show");
    });
  }

}

document.addEventListener("DOMContentLoaded",App.init);

