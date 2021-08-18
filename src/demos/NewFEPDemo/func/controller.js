class Link {
  id = "";
  left = {};
  right = {};

  get show() {
    return this.left.show && this.right.show;
  }
  get symbol() {}
}

class Controller {
  allLinks = new Map();

  visualNodes = [];
  visualLinks = [];
  visualTexts = [];

  init(originNodes, originLinks) {
    const tempLinks = new Map();
    originLinks.forEach((link) => {
      let { source, target } = link;
      let direction = "left";
      if (source > target) {
        [source, target] = [target, source];
        direction = "right";
      }
      const id = `${source}=>${target}`;
      const tempLink = tempLinks.get(id) || {};
      tempLink[direction] = {
        show: true,
        info: link.info,
      };
      tempLinks.set(id, tempLink);
    });
    for (let i = 0; i < originNodes.length; i++) {
      const node = originNodes[i];
      this.visualNodes.push([node.x, node.y, node.id]);
      this.visualTexts.push([node.x, node.y, node.name]);
      for (let j = i + 1; j < originNodes.length; j++) {
        if (i === j) return;
        const sourceId = node.id;
        const target = originNodes[j];
        const linkId = `${sourceId}=>${target.id}`;
        const tempLink = tempLinks.get(linkId) || {};
        const { left, right } = tempLink;
        this.allLinks.set(linkId, {
          id: linkId,
          left: {
            show: false,
            info: null,
            x: node.x,
            y: node.y,
            nodeId: sourceId,
            ...left,
          },
          right: {
            show: false,
            info: null,
            x: target.x,
            y: target.y,
            nodeId: target.id,
            ...right,
          },
          show: false,
          info: null,
        });
      }
    }

    for (let [, link] of this.allLinks) {
      const { left, right } = link;
      const coords = [
        [left.x, left.y],
        [right.x, right.y],
      ];
      const show = left.show || right.show;

      this.visualLinks.push({
        coords,
        lineStyle: {
          opacity: show ? 1 : 0,
        },
      });
    }
  }
}

export default new Controller();
