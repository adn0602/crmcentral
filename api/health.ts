export const config = {
  runtime: "edge",
};

export default function health() {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
