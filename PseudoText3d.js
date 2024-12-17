import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./helper/GraphicsHelper.js";
import Utils from "./Utils.js";

export class PseudoText3d extends PIXI.Container {
    
    constructor(text = 'AOOA', pseudoStyle) {
        super();
        
        this.text = text;
        this.sortableChildren = true;
        
        this.textContainer = this.addChild(new PIXI.Container());
        this.textContainer.sortableChildren = true;
        /**
         * フロントフェイスを作成
        */
        this.frontFace = new PIXI.Text(text, pseudoStyle);
        this.textContainer.addChild(this.frontFace);

        /**
        * サイドフェイスを作成
       */
        this.sideFace = this.textContainer.addChild(new PIXI.Container());
        const sideStyle = Utils.cloneTextStyle(pseudoStyle, {fill: 0xCBCBCB});
        const numOfSideLayer = 10;
        this._sideFaceList = [];
        for (let i = 0; i < numOfSideLayer; i++) {
            const side = this._sideFaceList.push(this.sideFace.addChild(new PIXI.Text(text, sideStyle)));
        }

        /**
         * シャドウを作成
        */
        this.shadows = this.textContainer.addChild(new PIXI.Container());
        const shadowStyle = Utils.cloneTextStyle(pseudoStyle, {fill: 0x333333});
        const numOfShadowLayer = 20;
        this._shadowList = [];
        for (let i = 0; i < numOfShadowLayer; i++) {
            const shadow = this.shadows.addChild(new PIXI.Text(text, shadowStyle));
            shadow.alpha = ((numOfShadowLayer - i) / numOfShadowLayer) * 0.2;
            this._shadowList.push(shadow);
        }
        
        /**
         * ドロップシャドウを作成
         */
        const dropshadowStyle = Utils.cloneTextStyle(pseudoStyle, {fill: 0xFFFFFF});
        this.dropshadowText = this.textContainer.addChild(new PIXI.Text(text, dropshadowStyle));
        
        this.dropShadowFilter = new PIXI.filters.DropShadowFilter({
            color     : 0x333333,
            alpha     : 0.5,
            blur      : 4,
            quality   : 4,
            offset    : {x:0, y:0},
            shadowOnly: true,
        });
        this.dropshadowText.filters = [this.dropShadowFilter];
        
        /**
         * ドロップシャドウ（ライト）を作成
         */
        const lightStyle = Utils.cloneTextStyle(pseudoStyle, {fill: 0xFFFFFF});
        this.lightText = this.textContainer.addChild(new PIXI.Text(text, lightStyle));

        this.lightFilter = new PIXI.filters.DropShadowFilter({
            color     : 0xFFFFFF,
            alpha     : 0.5,
            blur      : 4,
            quality   : 4,
            offset    : {x:0, y:0},
            shadowOnly: true,
        });
        this.lightText.filters = [this.lightFilter];

        this.sideFace.zIndex = 10;
        this.frontFace.zIndex = 20;

        // Utils.pivotCenter(this);
        // this.x = dp.limitedScreen.halfWidth;
        // this.y = dp.limitedScreen.halfHeight;
        // this.redraw();
    }
    


    update(text){
        if(this.text == text){
            // console.log('not update');
            return false;
        }
        this.text = text;

        this.frontFace.text = text;
        for (let i = 0; i < this._sideFaceList.length; i++) {
            let side = this._sideFaceList[i];
            side.text = text;
        }

        for (let i = 0; i < this._shadowList.length; i++) {
            let shadow = this._shadowList[i];
            shadow.text = text;
        }

        this.dropshadowText.text = text;
        this.lightText.text = text;
    }

    redraw(cameraRadius = 8, cameraAngle = 90, shadowRadius = 80, shadowDegree = 135){
        /**
         * サイドフェイス
         */

        this.textContainer.x = (window.innerWidth - this.frontFace.width) / 2;
        this.textContainer.y = (window.innerHeight - this.frontFace.height) / 2;

        const cameraRadiusPerTick = cameraRadius / this._sideFaceList.length;
        for (let i = 0; i < this._sideFaceList.length; i++) {
            
            const pos = {
                x: (cameraRadiusPerTick * i) * Math.cos(Utils.degreesToRadians(cameraAngle)),
                y: (cameraRadiusPerTick * i) * Math.sin(Utils.degreesToRadians(cameraAngle)),
            };
            let side = this._sideFaceList[i];
            side.scale.set(1);
            side.x = pos.x;
            side.y = pos.y;
            const fov = i * 1.5;
            side.width -= fov;
            side.x += (fov) / 2;
            if(i == this._sideFaceList.length - 1){
                this.shadows.y = side.y;
            }
        }

        let diff = Math.abs(shadowDegree - cameraAngle) % 360;
        if (diff > 180) {
            diff = 360 - diff;
        }
        let diffAlpha = 0.1 + (diff / 180 * 0.7);
        
        this.sideFace.alpha = diffAlpha;
        
        

        /**
         * シャドウ
         */
        const shadpwRadiusPerTick = shadowRadius / this._shadowList.length;
        for (let i = 0; i < this._shadowList.length; i++) {
            
            const pos = {
                x: (shadpwRadiusPerTick * i) * Math.cos(Utils.degreesToRadians(shadowDegree)),
                y: (shadpwRadiusPerTick * i) * Math.sin(Utils.degreesToRadians(shadowDegree)),
            }

            let shadow = this._shadowList[i];
            shadow.scale.set(1);
            shadow.x = pos.x;
            shadow.y = pos.y;
            const fov = i * 1.5;
            shadow.width -= fov;
            shadow.x += (fov) / 2;
        }

        /**
         * ドロップシャドウ
         */
        const pos = {
            x: (shadowRadius/5) * Math.cos(Utils.degreesToRadians(shadowDegree)),
            y: (shadowRadius/5) * Math.sin(Utils.degreesToRadians(shadowDegree)),
        }
        this.dropShadowFilter.offset = pos;

        /**
         * ドロップシャドウ（ライト）
         */
        const lightPos = {
            x: (shadowRadius/8) * Math.cos(Utils.degreesToRadians(Utils.getOppositeDegrees(shadowDegree))),
            y: (shadowRadius/8) * Math.sin(Utils.degreesToRadians(Utils.getOppositeDegrees(shadowDegree))),
        }
        this.lightFilter.offset = lightPos;
    }

}