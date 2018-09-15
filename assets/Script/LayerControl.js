/*
 * @Author: wsf
 * @Date: 2018-08-21 10:01:25
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 09:32:18
 * @Description: 
 */

var _util = require("./GameClass/Util");
var _data = require("./GameData/UserData");
cc.Class({
    extends: cc.Component,

    properties: {
        SetUpLayer:cc.Node,//设置页面
        HelpLayer:cc.Node,//帮助页面
        ShopLayer:cc.Node,//商店页面
        ScreenLayer:cc.Node,//首页背景 跑道 钻石数 金币数 每秒收益
        SignLayer:cc.Node,//每日登陆奖励
        CarControlLayer:cc.Node,//也是一个重要的页面
        showSetArrow:cc.Sprite,//箭头
    },


    onLoad:function() {
        this.SetUpLayer.active = false;
        this.HelpLayer.active = false;
        this._init();
        this.screenScript = this.ScreenLayer.getComponent("ScreenLayer");
        this.shopScript = this.ShopLayer.getComponent("ShopLayer");
    },


    //初始化操作
    _init:function(){
        let firstTime = parseInt(_data.getFirstTime());
        if(firstTime == 0){
            _data.saveData();
            _data.setFirstTime(1);
        }
        if(!_util.isToday()){
            let sinDays = parseInt(_data.getSignDays());
            _data.setSignDays(sinDays+1);
            _data.setIsSign(0);
            _data.saveData();
        }

    },

    //进入小游戏的处理
    _wxListenShow:function(){
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            wx.onShow(function(res){
                console.log("show:",res);
                let isSign = parseInt(_data.getIsSign());
                if(!_util.isToday()){
                    let sinDays = parseInt(_data.getSignDays());
                    _data.setSignDays(sinDays+1);
                    _data.setIsSign(0);
                    _data.saveData();
                }
                if(isSign === 0){
                    this.SignLayer.active = true;
                }
                
            });
        }
    },

    //点击设置按钮
    onClickShowSet:function(e){
        let curRotation = this.showSetArrow.node.rotation;
        this.showSetArrow.node.rotation += 180;
        let n = curRotation / 180 % 2;
        if(n === 1){
            this.SetUpLayer.active = true;
        }
        else if(n === 0){
            this.SetUpLayer.active = false;
        }
    },

    //点击帮助按钮
    onClickOpenHelp:function(e){
        this.HelpLayer.active = true;
    },
    //关闭帮助界面
    onClickCloseHelp:function(e){
        this.HelpLayer.active = false;
    },

    //点击商店按钮
    onClickOpenShop:function(e){
        this.ShopLayer.active = true;
    },
    //关闭商店界面
    onClickCloseShop:function(e){
        this.ShopLayer.active = false;
    },

    start () {

    },

    update (dt) {
        //刷新金币和钻石
        if(_data.getUpdateScoreAndDiamond()){
            this.screenScript.updateGoldAndDiamond();
            this.shopScript.updateGoldAndDiamond();
            _data.setUpdateScoreAndDiamond(false);
        }
    },
});
