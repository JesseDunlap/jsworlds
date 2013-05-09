module.exports = function() {
    this.onSetup = function(entity) {
        entity.addComponent("2D, Canvas, Mouse, playerSprite0")

            .attr({
                x:      50,
                y:      50,
                z:      10,
                w:      100,
                h:      100
            })

            .bind("Click", function(sender, e) {
                sender.alert("Welcome Boss says: 'Hey, welcome to JSWorlds and stuff.'");
            });
    };
};