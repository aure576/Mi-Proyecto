// bidireccional.js - Netlify Function (handler)
// Maneja POST, valida entrada, llama OpenAI, responde resultado.

const fetch = require("node-fetch");

// Helper: Responde siempre con CORS y JSON
function responder(status, bodyObj) {
  return {
    statusCode: status,
    body: JSON.stringify(bodyObj),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  };
}

// Helper: Validar método HTTP
function validarMetodo(event, metodo = "POST") {
  if (event.httpMethod !== metodo) {
    return responder(405, { error: "Método no permitido" });
  }
  return null;
}

// Helper: Validar cuerpo presente
function validarBody(event) {
  if (!event.body) {
    return responder(400, { error: "Falta el cuerpo de la petición" });
  }
  return null;
}

// Helper: Validar mensaje presente y correcto
function validarMensaje(mensaje) {
  if (!mensaje || typeof mensaje !== "string" || mensaje.trim().length === 0) {
    return responder(400, { error: "El mensaje es requerido" });
  }
  return null;
}

// Helper: Construir payload para OpenAI
function construirPayloadOpenAI(mensaje) {
  return {
    model: "gpt-4-1106-preview",
    tools: [
      { type: "prompt", id: "pmpt_6893d5fd89e4819683d72f63598fd27e071a60eb0525d4fd" }
    ],
    messages: [
      { role: "user", content: mensaje }
    ]
  };
}

// Helper: Extraer respuesta del JSON OpenAI
function extraerRespuestaOpenAI(resultado) {
  if (!resultado.choices || !resultado.choices[0] || !resultado.choices[0].message) {
    return null;
  }
  return resultado.choices[0].message.content;
}

// Helper: Logging solo en desarrollo
function logEvento(msg) {
  if (process.env.NODE_ENV === "development") {
    console.log("[handler-log]", msg);
  }
}

// --- Export principal ---
exports.handler = async function(event) {
  try {
    // Validar método
    let metError = validarMetodo(event, "POST");
    if (metError) return metError;

    // Validar cuerpo
    let bodError = validarBody(event);
    if (bodError) return bodError;

    // Parsear body JSON
    let bodyData;
    try {
      bodyData = JSON.parse(event.body);
    } catch (err) {
      return responder(400, { error: "El cuerpo debe estar en formato JSON" });
    }

    // Validar mensaje
    let mensaje = bodyData.mensaje;
    let msgError = validarMensaje(mensaje);
    if (msgError) return msgError;

    // Continua en parte 2...
        // --- Aquí se realiza la llamada a la API de OpenAI ---
    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(construirPayloadOpenAI(mensaje))
    });

    // Intentamos parsear la respuesta
    let resultado;
    try {
      resultado = await respuesta.json();
    } catch (err) {
      logEvento("Error al parsear JSON de OpenAI: " + err.message);
      return responder(500, { error: "No se pudo parsear la respuesta de OpenAI" });
    }

    // Log: respuesta cruda
    logEvento(resultado);

    // Extraemos el texto de la respuesta
    const texto = extraerRespuestaOpenAI(resultado);

    if (!texto) {
      return responder(500, { error: "Error en la respuesta de OpenAI" });
    }

    // Retornamos el texto como respuesta exitosa
    return responder(200, { respuesta: texto });

  } catch (error) {
    // Error general del handler
    logEvento("Error global: " + error.message);
    return responder(500, { error: error.message });
  }
};

