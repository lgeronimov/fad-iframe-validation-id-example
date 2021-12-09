window.onload = function () {
  initIframe();
};

const EventModule = {
  PROCESS_INIT: "INIT_MODULE",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
  SERVICE_RESULT: "SERVICE_RESULT"
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
  username: 'someone@example.com.mx',
  password: '1c3da398a8a4827fbf97cad82c9e24577a',
};

identificationData = {
  cardType: 'ine',
  cic: '136708660',
  ocr: "12345678",
  citizenId: '104325114',
};

// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data!
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EventModule.PROCESS_INIT) {
      // only informative
      console.log("Process init");
    } else if (message.data.event === EventModule.PROCESS_ERROR) {
      // restart component and send error
      console.log("Unespected error:" + JSON.stringify(message.data.data));
    } else if (message.data.event === EventModule.SERVICE_RESULT) {
      // there is result from service
      console.log("There is result");
    } else if (message.data.event === EventModule.PROCESS_COMPLETED) {
      // end of the process
      console.log("Process completed");
    }
  } else return;
});



function initIframe() {
  const iframe = document.getElementById("iframe-validation");
  iframe.src = "https://uatapiweb.firmaautografa.com/";
  iframe.onload = () => {
    iframe.contentWindow.postMessage(new ResponseEvent(EventModule.PROCESS_INIT, {
      user: this.user,
      identificationData: this.identificationData,
    }
  ), "https://uatapiweb.firmaautografa.com/");
  };
}