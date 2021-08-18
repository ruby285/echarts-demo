import imgData from "./img.jpg";

export const renderImage = (params, api) => {
  var cx = api.value(0);
  var cy = api.value(1);
  var r = 100;
  const pos = api.coord([cx, cy]);
  var id = api.value(3);

  const image = {
    type: "image",
    id,
    style: {
      image: imgData,
      x: pos[0] - r / 2,
      y: pos[1] - r / 2,
      width: r,
      height: r,
    },
    focus: "none",

    emphasis: {
      style: {
        x: pos[0] - (r / 2) * 1.5,
        y: pos[1] - (r / 2) * 1.5,
        width: r * 1.5,
        height: r * 1.5,
      },
    },
    z2: 100,
  };
  return image;
};

export const renderText = (params, api) => {
  var x = api.value(0);
  var y = api.value(1);
  var text = api.value(2);
  const pos = api.coord([x, y]);
  // var id = api.value(3);
  // var scale = api.value(4) || 1;

  const image = {
    type: "text",
    // id,
    style: {
      text,
      x: pos[0] + 40,
      y: pos[1] - 80,
      textAlign: "center",
    },
    focus: "none",
    z2: 100,
  };
  return image;
};
