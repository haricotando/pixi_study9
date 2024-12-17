import Utils from "./Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

import { ApplicationRoot } from "./ApplicationRoot.js";

console.log(PIXI.VERSION)
/* ------------------------------------------------------------
    変数定義
------------------------------------------------------------ */

/* ------------------------------------------------------------
    アセット読み込み
------------------------------------------------------------ */
WebFont.load({
    google: {
        families: ['Inter:300,500,700'],
    },
    
    active: () => {
        console.log('OK: Font');
        init();
    },

    // フォント読み込み失敗時
    inactive: () => {
        console.log("ER: Font");
    },
});

function init(){
    //  app instance
    let app = new PIXI.Application({
        background: '#FFFFFF',
        resizeTo  : window,
        /**
         * @todo 高解像度端末の対応について調べる
         */
        // resolution: window.devicePixelRatio || 1,
        // autoDensity: true,
    });

    dataProvider.app = app;
    dataProvider.isMobile = Utils.isMobileDevice();
    
    if(dataProvider.isMobile){
        dataProvider.spRect = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    }else{
        const pcPaddingFactor = 0.9;
        const h = window.innerHeight * pcPaddingFactor;
        const aspectRatio = 9 / 19.5;
        const w = aspectRatio * h;
        
        dataProvider.spRect = new PIXI.Rectangle(0, 0, Math.round(w), Math.round(h));
    }
    dataProvider.limitedScreen = {
        width             : dataProvider.spRect.width,
        height            : dataProvider.spRect.height,
        halfWidth         : dataProvider.spRect.width / 2,
        halfHeight        : dataProvider.spRect.height / 2,
        negativeWidth     : 0 - dataProvider.spRect.width,
        negativeHeight    : 0 - dataProvider.spRect.height,
        negativeHalfWidth : 0 - dataProvider.spRect.width / 2,
        negativeHalfHeight: 0 - dataProvider.spRect.height / 2,
    };

    document.body.appendChild(app.view);
    const appRoot = app.stage.addChild(new ApplicationRoot(true, 'LT'));
/* ------------------------------------------------------------
    resize Event
------------------------------------------------------------ */
    app.renderer.on('resize', (width, height) => {
        let w = width == undefined ? window.innerWidth : width;
        let h = height == undefined ? window.innerHeight : height;
        const windowRect = {width: w, height: h};
        const limitedRect = {width: dp.limitedScreen.width, height: dp.limitedScreen.height};
        appRoot.resizeHandler(windowRect, limitedRect);
    });
    app.renderer.emit('resize');
}