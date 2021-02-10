
class Platform {
    constructor (x,y,w,h) {

        console.log ("Platform got spawned");

        this.x = x;
        this.y = y;

        this.width = w;
        this.height = h;
        
    }

    


    render(context) {

        
         context.strokeStyle = "#FF0000"
       
        context.strokeStyle = "rgb(64, 114, 196)";
        context.strokeRect(this.x, this.y, this.width, this.height);  
    }
    
        
    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }



}

export default Platform;