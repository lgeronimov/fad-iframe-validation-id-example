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



const IDENTIFICATION_DATA = {
  documentNumber: "179305873",
  backNumber: "4327084136899",
  verificationNumber: null
};
// errors
const ERROR_CODE = {
  NO_SERVICE : -1,
  NO_INTERNET : -2,
  REQUIRED_CREDENTIALS: -3,
  BAD_CREDENTIALS : -4,
  USER_NOT_EXIST : -5,
  FAILED_GET_VALIDATION : -6,
  FAILED_SEND_VALIDATION : -7,
  NO_CITIZEN_IDENTIFIER : -8,
  NO_CARD_TYPE : -9,
  TIMEOUT_EXCEEDED : -10,
  USER_NOT_CONFIGURED : -11,
  SERVICES_URL_NOT_CONFIGURED : -12,
  INVALID_DATA : -13
};

class Result {
  anioEmision;
  anioRegistro;
  claveElector;
  claveMensaje;
  codigoValidacion;
  estatus;
  idValidation;
  mensaje;
  numeroEmision;
  ocr;
  vigencia;
  constructor(data) {
    this.anioEmision = data.anioEmision;
    this.anioRegistro = data.anioRegistro;
    this.claveElector = data.claveElector;
    this.claveMensaje = data.claveMensaje;
    this.codigoValidacion = data.codigoValidacion;
    this.estatus = data.estatus;
    this.idValidation = data.idValidation;
    this.mensaje = data.mensaje;
    this.numeroEmision = data.numeroEmision;
    this.ocr = data.ocr;
    this.vigencia =  data.vigencia;
  }
}


// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data!
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EventModule.MODULE_READY) {
      // MODULE_READY
      initModule();
    }
    if (message.data.event === EventModule.PROCESS_INIT) {
      // PROCESS_INIT
      // only informative
      console.log("Process init");
    } else if (message.data.event === EventModule.PROCESS_ERROR) {
      // PROCESS_ERROR
      // restart component and send error
      if (message.data.data.code === ERROR_CODE.INVALID_DATA) {
        // capture id again
        console.error(message.data)
      } else {
        // do something
        console.log("Unexpected error:" + JSON.stringify(message.data.data));
      }
    }
    else if (message.data.event === EventModule.SERVICE_RESULT) {
      // there is result from service
      console.log("There is result");
      console.log(message.data.data);
    } else if (message.data.event === EventModule.PROCESS_COMPLETED) {
      // end of the process
      console.log("Process completed");
      const result = new Result(message.data.data);
      console.log("Result:", result );
      
    }
  } else return;
});



function initIframe() {
  // get iframe
  const iframe = document.getElementById("iframe-validation");
  // url - https://devapiframe.firmaautografa.com/fad-iframe-validation-id
  const tkn = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const url = `https://devapiframe.firmaautografa.com/fad-iframe-validation-id?tkn=${tkn}`;
  // set src to iframe
  iframe.src = url;
}

function initModule() {
  const iframe = document.getElementById("iframe-validation");
  iframe.contentWindow.postMessage(
    new ResponseEvent(EventModule.INIT_MODULE, {
      identificationData: IDENTIFICATION_DATA
    }),
    iframe.src
  );
}