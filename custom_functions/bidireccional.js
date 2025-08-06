const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "2023897",
  key: "46e53dfe6f8d93182aaa",
  secret: "18cf3757c66e3beb13cd",
  cluster: "us2",
  useTLS: true,
});

exports.handler = async function(event, context) {
  const { sender, text, clientId } = JSON.parse(event.body);

  await pusher.trigger("chat-duplicado", "nuevo-mensaje", {
    sender,
    text,
    clientId,
    timestamp: Date.now()
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok" })
  };
};