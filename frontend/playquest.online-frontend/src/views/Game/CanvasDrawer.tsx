
class CanvasDrawer{
    height: number;
    width: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;

    constructor(height: number, width: number, canvas: HTMLCanvasElement){
        this.height = height;
        this.width = width;
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext("2d");
    }
    drawDot(x: number, y: number){
		console.log("drawing dot");
        if(this.ctx){
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(x, y, 5, 5);
        }
    }
	drawBouncy( radius: number, momX: number, momY: number, x: number, y: number){
        if(this.ctx){
            //calculate new position
            x += momX;
            y += momY;
            if(x > this.width - radius || x < radius){
                momX = -momX;
                x += momX;
            }
            if(y > this.height - radius || y < radius){
                momY = -momY;
                y += momY;
            }
            this.ctx.clearRect(0, 0, this.width, this.height); // clear canvas
            this.ctx.fillStyle = "red";
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        window.requestAnimationFrame(()=>{this.drawBouncy(radius, momX, momY, x, y)});
    }
}


export default CanvasDrawer;
