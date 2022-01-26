const LOCAL_BASE_URL = "http://localhost:7071";
const REMOTE_BASE_URL = "";

const getAPIBaseUrl = () => {
  const isLocal = /localhost/.test(window.location.href);
  return isLocal ? LOCAL_BASE_URL : REMOTE_BASE_URL;
};

const app = new Vue({
  el: "#app",
  data() {
    return {
      stocks: [],
    };
  },
  methods: {
    async getStocks() {
      try {
        const apiUrl = `${LOCAL_BASE_URL}/api/getStocks`;
        const response = await axios.get(apiUrl);
        //console.log('Stocks fetched from ', apiUrl);
        app.stocks = response.data;
      } catch (ex) {
        console.error(ex);
      }
    },
    // startPoll() {
    //     this.interval = setInterval(this.update, 5000);
    // }
    created() {
      this.getStocks();
    },
  },
  created() {
    this.update();
    this.startPoll();
  },
});

const connect = () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${getAPIBaseUrl()}/api`)
    .build();

  connection.onclose(() => {
    console.log("SignalR connection disconnected");
    setTimeout(() => connect(), 2000);
  });

  connection.on("update", (updatedStock) => {
    const index = app.stocks.findIndex((s) => s.id === updatedStock.id);
    app.stocks.splice(index, 1, updatedStock);
  });

  connection.start().then(() => {
    console.log("SignalR connection established");
  });
};

connect();
