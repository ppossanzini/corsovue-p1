import { Esri } from "@/esriMap";

export async function GeoTiffImageLayer(options): Promise<ICustomImageLayer> {

  let webMercatorUtils = await Esri.Geometry.Support.webMercatorUtils();

  let GeoTiffImageLayerView = (await Esri.Layers.BaseLayerView2D()).createSubclass({
    // create Web workers to manipulate the raster image
    // Attach property watchers to layer
    attach: function () {
      this._imagesWatcher = this.layer.watch("imageRasters", function () {
        this.requestRender();
      })
    },
    // Detach property watchers from layer
    detach: function () {
      this._propertyHandle.remove();
      this._propertyHandle = null;
    },
    render(renderParameters: { context: Object, stationary: boolean, state: any }) {
      var state = renderParameters.state;
      var context = renderParameters.context as any;
      var pixelRatio = state.pixelRatio;
      var width = state.size[0];
      var height = state.size[1];

      if (state.rotation !== 0) {
        context.translate(width * pixelRatio * 0.5, height * pixelRatio * 0.5);
        context.rotate((state.rotation * Math.PI) / 180);
        context.translate(- width * pixelRatio * 0.5, -height * pixelRatio * 0.5);
      }

      context.save();

      (this.layer.imageRasters).forEach(element => {
        this.createTile(element, context, state);
      });

      context.restore();
    },
    createTile: function (rasterdata: any, context, state) {

      rasterdata.values.forEach(ras => {

        let xmin = rasterdata.xmin;
        let ymin = rasterdata.ymax;
        let rxstep = ((rasterdata.xmax - rasterdata.xmin) / rasterdata.width);
        let rystep = ((-rasterdata.ymax + rasterdata.ymin) / rasterdata.height);
        for (let x = 0; x < rasterdata.width; x++) {
          for (let y = 0; y < rasterdata.height; y++) {
            let val = ras[y][x];

            if (!val && this.layer.skipIfNoValue) continue;

            let gxmin = (xmin + (x) * rxstep);
            let gxmax = (xmin + (x + 1) * rxstep);
            let gymin = (ymin + (y) * rystep);
            let gymax = (ymin + (y + 1) * rystep);

            let p1 = [0, 0];
            let p2 = [0, 0];
            state.toScreenNoRotation(p1, [gxmin, gymax]);
            state.toScreenNoRotation(p2, [gxmax, gymin]);

            let style = this.layer.classifyCell(val);
            context.fillStyle = 'rgba(' + style[0] + ',' + style[1] + ',' + style[2] + ',' + style[3] + ')';
            context.fillRect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1]);
          }
        }
      });
    }
  })

  let GeoTiffImageLayer = (await Esri.Layers.BaseTileLayer()).createSubclass({
    properties: {
      skipIfNoValue: true,

    },
    imageRasters: [],
    classifyCell(value: number, georaster): [number, number, number, number] {
      return [0, 0, 0, value];
    },
    addImageRaster: function (rasterdata) {
      this.imageRasters.push(this.toWebMercator(rasterdata));
    },

    toWebMercator: function (rasterdata) {
      if (rasterdata.projection == 4326) {
        let minxy = webMercatorUtils.lngLatToXY(rasterdata.xmin, rasterdata.ymin);
        let maxxy = webMercatorUtils.lngLatToXY(rasterdata.xmax, rasterdata.ymax);

        rasterdata.xmin = minxy[0];
        rasterdata.ymin = minxy[1];
        rasterdata.xmax = maxxy[0];
        rasterdata.ymax = maxxy[1];
      }

      return rasterdata;
    },
    createLayerView(view) {
      return new GeoTiffImageLayerView({
        view: view,
        layer: this
      });
    }
  });

  return new GeoTiffImageLayer(options) as ICustomImageLayer;
}

interface ICustomImageLayer extends __esri.Layer {
  images: Array<any>;
}
