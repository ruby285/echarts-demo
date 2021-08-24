// 每个分子需要使用的面积 => 1000px * 1000px 的尺寸下容纳 20 个分子
const baseMolNum = 20;
const baseArea = (1000 * 1000) / baseMolNum;

class Room {
  width = 0;
  height = 0;
  scale = 1;
  maxScale = 2;
  minScale = 1;
  translateX = 0;
  translateY = 0;

  init(len) {
    const parentW = this.parent.offsetWidth;
    const parentH = this.parent.offsetHeight;
    const parentArea = parentW * parentH;
    const molNum = Math.floor(parentArea / baseArea);
    const molScale = len / molNum;

    if (molScale < 1) {
      this.width = parentW;
      this.height = parentH;
    } else {
      const edgeScale = Math.sqrt(molScale);
      this.scale = 1 / edgeScale;
      this.minScale = 1 / edgeScale;
      this.width = parentW * edgeScale;
      this.height = parentH * edgeScale;
    }

    this.translateX = -this.width / 2;
    this.translateY = -this.height / 2;
    this.dom.style.width = this.width + "px";
    this.dom.style.height = this.height + "px";
    this.dom.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  // 放大
  zoomIn(delta) {
    if (this.scale === this.maxScale) return;
    this.scale += delta / 100;
    if (this.scale > this.maxScale) this.scale = this.maxScale;
    this.dom.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  // 缩小
  zoomOut(delta) {
    if (this.scale <= this.minScale) return;
    this.scale += delta / 100;
    if (this.scale < this.minScale) this.scale = this.minScale;
    this.dom.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  constructor(parent, dom) {
    this.parent = parent;
    this.dom = dom;
  }
}

export default Room;
