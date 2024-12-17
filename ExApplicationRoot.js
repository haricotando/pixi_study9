import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./helper/GraphicsHelper.js";

export class ExApplicationRoot extends PIXI.Container {
    
    constructor(debug, anchor) {
        super();

        this._debug = debug;
        this.anchorPoint = anchor;
        
        if(this._debug){
            this.sortableChildren = true;
            this.debugAssets = this.addChild(new PIXI.Container());
            this.debugAssets.zIndex = 1000;
            this.initSPFrame();
            this.debugAssets.addChild(GraphicsHelper.addCross(100, 2));
        }
    }


    /** ------------------------------------------------------------
        * アセットをまとめてロード
        * 公式の画像でテスト読み込み
     */
    loadAssets(){
        const assetsPromise = PIXI.Assets.load(this._assetsLoad);
        
        assetsPromise.then((items) => {
            dataProvider.assets = items;
            console.log('assets loaded');
            this.init();
        });
    }
    /** ------------------------------------------------------------
         * resizeHandler
         * 
     */
    resizeHandler(width, height){
        switch(this.anchorPoint){
            case 'Center':
                this.x = width / 2;
                this.y = height / 2;
                break;
            case 'LT':
                this.x = window.innerWidth / 2 - dp.limitedScreen.halfWidth;
                this.y = window.innerHeight / 2 - dp.limitedScreen.halfHeight;
                break;
                
        }
    }

    /** ============================================================
        * Debug時要素
     */
    initSPFrame(){
        let lineColor = 0x00FFFF;
        let lineWidth = 10;

        const debugFrame = GraphicsHelper.exDrawRect(
            0, 0, 
            dataProvider.spRect.width,
            dataProvider.spRect.height,
            {
                color: lineColor,
                width: lineWidth,
            }, false
        );

        if(this.anchorPoint == 'Center'){
            debugFrame.pivot.x = debugFrame.width/2;
            debugFrame.pivot.y = debugFrame.height/2;
        }
        this.debugAssets.addChild(debugFrame);
    }
}