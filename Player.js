class Player {
    constructor(CONFIG) {

        console.log("Player was created");

        this.CONFIG = CONFIG;

        this.x = 300+25;
        this.y = 285;

        this.img = null;

        this.width = 100/2;
        this.height = 100;

        this.deltaX = 0;
        this.deltaY = 0;

        this.currentKeys = [];

        this.speed = this.CONFIG.playerSpeed;

        this.ticks = 0;

        this.frameX = 0;

        this.gravity = 0.4;
        this.friction = 0.6;

        this.grounded = false;
        this.jumping = false;

        this.init();
    }



    init() {

        this.img;

        //standing sprite
        this.imgI = new Image();
        this.imgI.src = './stand5.png';

        //running sprite
        this.imgR = new Image();
        this.imgR.src = './run8.png';

        this.imgL = new Image();
        this.imgL.src = './run8L.png';

        document.addEventListener('keyup', (event) => {
            this.currentKeys[event.code] = false;
        });

        document.addEventListener('keydown', (event) => {
            this.currentKeys[event.code] = true;
        });

    }
    // werte werden theoretisch geändert aber noch nicht auf x und y angewendet
    update() {

        if (this.currentKeys['ArrowUp'] || this.currentKeys['ArrowRight'] || this.currentKeys['ArrowDown'] || this.currentKeys['ArrowLeft']) {
            this.img = this.imgR;
        }
        else {
            this.img = this.imgI;
        }

        //arrow up & down for moving in y axis
        if (this.currentKeys['ArrowUp'] == true) {
            if (!this.jumping && this.grounded) {
                this.jumping = true;
                this.grounded = false;
                this.deltaY = -this.speed * 2.5;//how high to jump
            }
        }

        //arrow left & right for moving in x axis
        if (this.currentKeys['ArrowLeft'] === true) {
            if (this.deltaX > -this.speed) {
                this.img = this.imgL;
                this.deltaX--;
            }
        }
        else if (this.currentKeys['ArrowRight'] === true) {
            if (this.deltaX < this.speed) {
                this.deltaX++;
            }
        }

        this.deltaX *= this.friction;
        this.deltaY += this.gravity;
    }

    // werte von oben werden hier dann wirklich angewendet (x,y)
    updateApply() {
        this.x = this.x + this.deltaX * 3;
        this.y = this.y + this.deltaY;

        if (this.x - this.width / 2 < 0)
            this.x = this.width / 2;

        if (this.x + this.width / 2 > this.CONFIG.width)
            this.x = this.CONFIG.width - this.width / 2;

        if (this.y - this.height / 2 < 0)
            this.y = this.height / 2;

        if (this.y + this.height / 2 > this.CONFIG.height)
            this.y = this.CONFIG.height - this.height / 2;
    }


    render(context) {
        context.save();

        // idle animation - need to implement
        let spriteCoords = this.getImageSpriteCoordinates();
        context.drawImage(this.img,
            spriteCoords.sourceX,
            spriteCoords.sourceY,
            spriteCoords.sourceWidth,
            spriteCoords.sourceHeight,
            this.x-25,
            this.y,
            this.width*2,
            this.height
        );

        context.restore();

        this.ticks++;
    }

    getBoundingBox() {
        return {
            x: this.x - this.width / 2 + 30,
            y: this.y - this.height / 2 + 10,
            width: this.width - 60,
            height: this.height - 10
        }
    }



    getImageSpriteCoordinates = () => {

        let frameSize = { width: 5000 / 10, height: 410 }
        let framesTotalCount = 2;
        let fpt = 0.1;

        if (this.currentKeys['ArrowLeft'] === true || this.currentKeys['ArrowRight'] === true) {
            framesTotalCount = 10;
        }

        let frameX = Math.floor(this.ticks * fpt % framesTotalCount);


        return {
            sourceX: frameX * frameSize.width,
            sourceY: 0,
            sourceWidth: frameSize.width,
            sourceHeight: frameSize.height,
        }
    }
}

export default Player;