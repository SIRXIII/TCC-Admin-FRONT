// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: "reverb",
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST,
//   wsPort: import.meta.env.VITE_REVERB_PORT,
//   wssPort: import.meta.env.VITE_REVERB_PORT,
//   forceTLS: false,
//   enabledTransports: ["ws", "wss"],
//   authEndpoint: "https://travelclothingclub-admin.online/broadcasting/auth",
//   auth: {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//     },
//   },
// });

// export default echo;

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,

  authEndpoint: "http://tcc-admin-back.test/broadcasting/auth",
  auth: {
    withCredentials: true,
  },
});

export default echo;
