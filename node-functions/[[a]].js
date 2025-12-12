export async function onRequest(req, context) {
  return new Response("Hello,  world1234!" + JSON.stringify(context.params))
} 