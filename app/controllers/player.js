module.exports = function(P) {
    this.setLocation = function(data) {
        data.email = P.account.email;
        data.name = P.account.firstName;

        P.clients.forEach(function(client) {
            if (client != P)
                client.socket.emit("player-changed-pos", data);
        });
    };
};