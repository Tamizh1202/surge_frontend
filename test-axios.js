const axiosClient = require("./lib/axios").default;
console.log("axiosClient loaded");
axiosClient.get("https://google.com").then(() => console.log("Success")).catch(e => console.error(e.message));
