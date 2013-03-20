module.exports = function(P) {
    this.setLocation = function(data) {
        data.username = P.account.username;

        P.clients.forEach(function(client) {
            if (client != P)
                client.socket.emit("player-changed-pos", data);
        });
    };
};