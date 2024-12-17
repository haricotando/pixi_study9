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
        const background = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.limitedScreen.width, dp.limitedScreen.height, false, {color:0xE6E1DE}));

        const pseudoStyle = new PIXI.TextStyle({
            fontFamily: 'Inter',
            fontSize  : 300,
            fontWeight: 800,
            fill      : [0xFFFFFF, 0xEFEFEF],
            //    fill             : [0xEFEFEF, 0xE7E0E0],
            // fill             : [0xE7E0E0, 0xD3CDCD],
            align            : 'center',
            fillGradientType : 0,
            fillGradientStops: [1,0.2],
        });
        this.pseudo = this.addChild(new PseudoText3d('28:00', pseudoStyle));
        if(!Utils.isMobileDevice()){
            this.pseudo.scale.set(0.4);
        }


        const getCurrentHM = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0'); // 時間（2桁に0埋め）
            const minutes = String(now.getMinutes()).padStart(2, '0'); // 分（2桁に0埋め）
            return [hours, minutes];
        };

        dp.app.ticker.add(() => {
            const currentHM = getCurrentHM();
            const seconds = new Date().getSeconds();
            const milliseconds = new Date().getMilliseconds();
            const ss = (seconds * 1000 + milliseconds) / (60*1000) * 360 - 90;
            this.pseudo.update(`${currentHM[0]}:${currentHM[1]}`);
            this.pseudo.redraw(18, 90, 80, ss);
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