/*
 *------------------------------------------------
 * 小星星的属性控制模块
 *------------------------------------------------
 */
 
 cc.Class({
    extends: cc.Component,

    properties: {
        // 星星的距离判断值
        pickRadius: 0
    },
    
    getPlayerDistance: function() {
        // 判断距离
        var playerPos = this.game.player.getPosition();
        var dist = cc.pDistance( this.node.position, playerPos );
        return dist;
    },
    
    onPicked: function() {
        // 当拾取后，建一个新星星
        this.game.spawnNewStar();
        
        // 调用计分
        this.game.gainScore();
        
        // 销毁星星
        this.node.destroy();
    },
    
    update: function(dt) {
        // 判断距离逻辑
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
        }
        
        // 更新星星重置的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * ( 255 - minOpacity));
    }

    // use this for initialization
    /*onLoad: function () {

    },*/

});
