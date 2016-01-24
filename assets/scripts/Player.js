/*
 *------------------------------------------------
 * 角色的属性控制模块
 *------------------------------------------------
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        
        // 主角跳起时间
        jumpDuration: 0,
        
        // 最大移动速度
        maxMoveSpeed: 0,
        
        // 加速度
        accel: 0,
        
        // 声音
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },
    },
    
    setJumpAction: function(){
        // 起跳
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        
        // 回调获得音频事件
        var callback = cc.callFunc(this.playJumpSound, this);
        
        // repeat
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    
    playJumpSound: function() {
        // 调用音频
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    
    setInputControl: function(){
        var self = this;
        
        //添加监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
        
        // 触摸屏监控输入
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                var touchLoc = touch.getLocation();
                if (touchLoc.x >= cc.winSize.width/2) {
                    self.accLeft = false;
                    self.accRight = true;
                } else {
                    self.accLeft = true;
                    self.accRight = false;
                }
                // don't capture the event
                return true;
            },
            onTouchEnded: function(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    },

    onLoad: function () {
        // 初始化跳跃
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        
        // 加速度开关
        this.accLeft = false;
        this.accRight = false;
        
        //当前速度
        this.xSpeed = 0;
        
        //初始化
        this.setInputControl();
    },
    
    update: function(dt){
        // 根据加速度更新
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        
        // 限制速度
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        
        this.node.x += this.xSpeed * dt;
    },

    
});
