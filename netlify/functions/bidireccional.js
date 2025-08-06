const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1843783", // Tu appId real de Pusher
  key: "46e53dfe6f8d93182aaa",
  secret: "18cf3757c66e3beb13cd", // Pon tu secret real
  cluster: "us2",
  useTLS: true
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Solo permitimos sender y text como llegan
    // No reconfiguramos la lógica, solo retransmitimos
    const { sender, text, clientId } = body;

    // channel y event deben coincidir con el frontend
    await pusher.trigger("chat-duplicado", "nuevo-mensaje", {
      sender,
      text,
      clientId
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};