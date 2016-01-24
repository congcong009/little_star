/*
 *------------------------------------------------
 * 游戏主要逻辑，控制成绩等
 *------------------------------------------------
 */
 
 cc.Class({
    extends: cc.Component,

    properties: {
        // 生成星星
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        
        //星星产生后消失的随机位置
        maxStarDuration: 0,
        minStarDuration: 0,
        
        //星星的高度位置几点
        ground: {
            default: null,
            type: cc.Node
        },
        
        // 玩家的初始化
        player: {
            default: null,
            type: cc.Node
        },
        
        // 分数计算
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        
        // 音频资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {
        // 首先获取地平面坐标
        this.groundY = this.ground.y + this.ground.height/2;
        
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        
        // 生成一个星星
        this.spawnNewStar();
        
        // 计分初始化 
        this.score = 0;

    },
    
    spawnNewStar: function() {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        
        // 将game组件的实例传入星星
        newStar.getComponent('Star').game = this;
        
        // 重置计时器
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    
    getNewStarPosition: function() {
        // 随机生成一个坐标
        var randX = 0;
        var randY = this.ground + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        
        // 根据宽度生成一个X
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        
        return cc.p( randX, randY);
    },

    gainScore: function() {
        this.score += 1;
        this.scoreDisplay.string = 'Score:' + this.score.toString();
        cc.audioEngine.playEffect( this.scoreAudio, false );
    },
    
    update: function(dt) {
        // 更新计时器，并调用失败的逻辑
        if ( this.timer > this.starDuration ) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },
    
    gameOver: function() {
        this.player.stopAllActions();
        cc.director.loadScene('game');
    }
});
