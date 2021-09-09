class scene1 extends Phaser.Scene {
    constructor() {
        super({ key: "scene1" });
    }

    init() {
        this.playerSpeed = 3.5;
        this.enemySpeed = 2;
        (this.enemyMaxY = 320), (this.enemyMinY = 0);
    }

    preload() {
        this.load.image("background", "assets/konoha.jpg");
        this.load.image("player", "assets/itachiRun.gif");
        this.load.image("enemy", "assets/noob2.png");
        this.load.image("chest", "assets/chest.png");
    }

    create() {
        let bg = this.add.sprite(40, 40, "background");
        this.scoreTitle=this.add.text(10,10,"Score:")
        this.scoreText=this.add.text(70,10,"0")
        var score=document.getElementById("score")
        this.scoreText.text=score.textContent
        this.player = this.add.sprite(
            40,
            this.sys.game.config.height / 2,
            "player"
        );
        this.player.setScale(0.17);

        this.chest = this.add.sprite(
            this.sys.game.config.width - 30,
            this.sys.game.config.height / 2,
            "chest"
        );
        this.chest.setScale(0.3);

        this.enemies = this.add.group({
            key: "enemy",
            repeat: 3,
            setXY: {
                x: 180,
                y: 250,
                stepX: 160,
                stepY: 20,
            },
        });
        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.95, -0.95);

        Phaser.Actions.Call(
            this.enemies.getChildren(),
            function (enemy) {
                enemy.speed = Math.random() * 2 + 1;
            },
            this
        );
        console.log(
            "player bounds: ",
            this.getExactBounds(this.player.getBounds())
        );

        this.isPlayerAlive = true;
    }

    update() {
        if (!this.isPlayerAlive) {
            return;
        }

        if (this.input.activePointer.isDown) {
            this.player.x += this.playerSpeed;
        }

        if (
            Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                this.chest.getBounds()
            )
        ) {
            // alert("game over retard")
            var score=document.getElementById("score")
            score.textContent=parseInt(score.textContent)+1
            this.scoreText.text=score.textContent
            this.gameOver();
        }

        let enemies = this.enemies.getChildren();

        for (let i = 0; i < enemies.length; i++) {
            //move enemies
            enemies[i].y += enemies[i].speed;

            //reverse movement if reaches edges
            if (enemies[i].y >= this.enemyMaxY) {
                enemies[i].speed *= -1;
            } else if (enemies[i].y <= this.enemyMinY) {
                enemies[i].speed *= -1;
            }

            //enemy collision
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.getExactBounds(this.player.getBounds()),
                    this.getExactBounds(enemies[i].getBounds())
                )
            ) {
                this.scoreText.text="0"
                document.getElementById("score").textContent="0"
                this.gameOver();
                break;
            }
        }
    }

    gameOver() {
        console.log("game gober!!!!");
        this.isPlayerAlive = false;
        //shake the camera
        this.cameras.main.shake(500);

        //fade camera
        this.time.delayedCall(
            250,
            function () {
                this.cameras.main.fade(250);
            },
            [],
            this
        );

        //restart game
        this.time.delayedCall(
            500,
            function () {
                this.scene.restart();
            },
            [],
            this
        );
    }

    getExactBounds(damn) {
        var objBounds = damn;
        objBounds.width -= objBounds.width / 3;
        objBounds.height -= objBounds.height / 3;
        return objBounds;
    }
}
