class Fragment {

    constructor(x, y, CONFIG) {
      console.log("fragment was created");

      this.CONFIG = CONFIG
  
      this.width = 120;
      this.height = 200;
  
      this.image = new Image();
      this.image.src = "fragment1.png";
      
  
      this.x = x;
      this.y = y;
  
      this.fill = false;
  
      
    }
  
    update() {
      
      
    }
  
    render(context) {
      context.translate(this.x, this.y);
  
      context.drawImage(this.image, 0,0, this.width, this.height);
  
      context.resetTransform(); 
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
  
  export default Fragment;