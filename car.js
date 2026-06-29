class Car{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Physics
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05
        this.angle = 0;
        this.sensor = new Sensor(this);// sensor is added
        this.controls = new Controls();
        this.damaged = false;
        // visuals
        this.img = new Image();
        this.img.src = "car.png";
    }
    update(roadBorders){
        if(!this.damaged){
        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders){
        for(let i = 0; i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points = [];
        const radius = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height);
        // it gives us all the corner points of a polygon
        points.push({
            x: this.x - Math.sin(this.angle-alpha)*radius,
            y: this.y - Math.cos(this.angle-alpha)*radius
        });
        points.push({
            x: this.x - Math.sin(this.angle+alpha)*radius,
            y: this.y - Math.cos(this.angle+alpha)*radius
        });
        points.push({
            x: this.x - Math.sin(Math.PI+this.angle-alpha)*radius,
            y: this.y - Math.cos(Math.PI+this.angle-alpha)*radius
        });
        points.push({
            x: this.x - Math.sin(Math.PI+this.angle+alpha)*radius,
            y: this.y - Math.cos(Math.PI+this.angle+alpha)*radius
        });
        return points;
    }
    
    #move(){
               // acceleration
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
           this.speed -= this.acceleration;
        }
        // friction
        if(this.speed >0){
            this.speed -=this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0;
        }
        // Clamp speed
        if(this.speed>=this.maxSpeed){
            this.speed= this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed =- this.maxSpeed/2;
        }
        // steering
        if(this.speed!==0){
             if(this.controls.left){
                this.angle -= 0.03;
            }
            if(this.controls.right){
                this.angle += 0.03;
            }
        }
    
        //update position based on angle + speed
        this.x += Math.sin(this.angle)*this.speed;
        this.y -=Math.cos(this.angle)*this.speed;
    }

    draw(ctx) {
        ctx.save();    // save current canvas state
        ctx.translate(this.x, this.y); //move origin to car’s position
        ctx.rotate(this.angle); // rotate canvas by car’s angle
        // ctx.imageSmoothingEnabled = true;
        // ctx.imageSmoothingQuality = "high";

         ctx.drawImage(
            this.img,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
         if(this.damaged){
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.fillRect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
    }
         ctx.restore();        // restore canva state
         this.sensor.draw(ctx);
    }

}