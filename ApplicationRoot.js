import { dataProvider, dp } from "./dataProvider.js";
import { ExApplicationRoot } from "./ExApplicationRoot.js";
import GraphicsHelper from "./helper/GraphicsHelper.js";
import { PseudoText3d } from "./PseudoText3d.js";
import Utils from "./Utils.js";

export class ApplicationRoot extends ExApplicationRoot {
    
    constructor(debug = false, anchor = 'Center') {
        super(debug, anchor);

        this.init();
        // this.initAssetLoader();
    }

    /** ------------------------------------------------------------
     * アセット読み込み時は initAssetLoader -> init
    */
    init(){
        const background = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.limitedScreen.width, dp.limitedScreen.height, false, {color:0xE2DDDA}));

        const pseudoStyle = new PIXI.TextStyle({
            fontFamily: 'Inter',
            fontSize  : 300,
            fontWeight: 800,
            // fill      : [0xFFFFFF, 0xEFEFEF],
            //    fill             : [0xEFEFEF, 0xE7E0E0],
               fill             : [0xE7E0E0, 0xD3CDCD],
            align            : 'center',
            fillGradientType : 0,
            fillGradientStops: [1,0.2],
        });
        this.pseudo = this.addChild(new PseudoText3d('00:00', pseudoStyle));
        if(!Utils.isMobileDevice()){
            this.pseudo.scale.set(0.4);
        }

        let sd = 1;
        dp.app.ticker.add(() => {
            // const date = new Date();
            // console.log(date.getSeconds());
            
            // redraw(cameraRadius = 8, cameraAngle = 90, shadowRadius = 80, shadowDegree = 135){
            // sd = sd > 360 ? 1 : sd+1;
            sd = sd > 360 ? 1 : sd+0.1;
            this.pseudo.redraw(18, 90, 80, sd);
        });
    }
    
    initAssetLoader(){
        // PIXI.Assets.add('gradient', './assets/gradient.png');
        this._assetsLoad = [
            // 'gradient',
        ];
        this.loadAssets();
    }
}