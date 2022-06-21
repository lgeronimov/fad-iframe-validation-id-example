window.onload = function () {
  initIframe();
};

const EventModule = {
  INIT_MODULE: "INIT_MODULE",
  PROCESS_INIT: "PROCESS_INIT",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
  MODULE_READY: "MODULE_READY",
  SERVICE_RESULT: "SERVICE_RESULT",
}

class ResponseEvent {
  event;
  data;
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

user = {
  username: "example@email.com",
  password: "password"
};

identificationData = {
  documentNumber: "179305873",
  backNumber: "4327084136899",
  personalNumber: "4327084136899",
  verificationNumber: null
};

// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data!
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EventModule.MODULE_READY) {
      // MODULE_READY
      initModule();
    }
    if (message.data.event === EventModule.PROCESS_INIT) {
      // only informative
      console.log("Process init");
    } else if (message.data.event === EventModule.PROCESS_ERROR) {
      // restart component and send error
      console.log("Unespected error:" + JSON.stringify(message.data.data));
    } else if (message.data.event === EventModule.SERVICE_RESULT) {
      // there is result from service
      console.log("There is result");
      console.log(message.data.data);
    } else if (message.data.event === EventModule.PROCESS_COMPLETED) {
      // end of the process
      console.log("Process completed");
      console.log(message.data.data);
    }
  } else return;
});



function initIframe() {
  const iframe = document.getElementById("iframe-validation");
  const username = "example@email.com";
  const password = "password";
  // url - https://devapiframe.firmaautografa.com/fad-iframe-validation-id
  const url = `https://devapiframe.firmaautografa.com/fad-iframe-validation-id?user=${username}&pwd=${password}`;
  // set src to iframe
  iframe.src = url;
}

function initModule() {
  const iframe = document.getElementById("iframe-validation");
  iframe.contentWindow.postMessage(
    new ResponseEvent(EventModule.INIT_MODULE, {
      user: this.user,
      identificationData: this.identificationData,
    }),
    iframe.src
  );
}