import { Esri } from "../Esri";

interface onDrawCompletedDelegate {
  (graphic: __esri.Graphic): void;
}
interface onDrawResetDelegate {
  (): void;
}

export class Draw {
  private draw: __esri.Draw;

  private _graphics: __esri.Collection<__esri.Graphic>;
  private _graphic: __esri.Graphic;

  private _defaultGeometrySymbol: {};
  private _defaultLabelSymbol: {};

  private _startedMeasuring: boolean = false;
  public drawing: boolean = false;
  public onDrawCompleted: onDrawCompletedDelegate;
  public onDrawReset: onDrawResetDelegate;

  constructor(public parameters: DrawParameters, public options: __esri.DrawCreateDrawOptions) {
    if (!parameters.domButtonNode) throw "Unable to create a Draw tool without a dom button reference";
    if (!parameters.view) throw "Unable to create a Draw Tool without a View";

    if (parameters.graphicLayer) this._graphics = parameters.graphicLayer.graphics;
    else this._graphics = parameters.view.graphics;

    this.initWidget(options);
  }

  private async initWidget(drawOption: __esri.DrawCreateDrawOptions) {
    this.parameters.domButtonNode.addEventListener("click", () => this.initDrawing(drawOption));
  }

  public async endDrawing() {
    if (this.drawing) {
      this._graphics.removeAll();
      this.drawing = false;
      this.draw.reset();
      if (this.onDrawReset) this.onDrawReset();
    }
  }

  public async initDrawing(drawOption: __esri.DrawCreateDrawOptions) {
    if (this.drawing) this.endDrawing();

    this.drawing = true;
    this.draw = (await Esri.Views._2D.Draw({ view: this.parameters.view } as __esri.DrawProperties)) as __esri.Draw;

    var action: any = this.draw.create(this.parameters.tool, drawOption);
    this.parameters.view.focus();

    switch (this.parameters.tool) {
      case "polygon":
        action.on("vertex-add", (e) => {
          if (this.parameters.enableMeasure) this._startedMeasuring = true;
          this.drawPolygon(e, this.parameters.view);
        });
        action.on("cursor-update", (e) => this.drawPolygon(e, this.parameters.view));
        action.on("vertex-remove", (e) => this.drawPolygon(e, this.parameters.view));
        action.on("draw-complete", async (e) => {
          await this.drawPolygon(e, this.parameters.view, true);
          if (this.parameters.enableMeasure) this._startedMeasuring = false;
        });
        break;
      case "polyline":
        action.on("vertex-add", (e) => {
          if (this.parameters.enableMeasure) this._startedMeasuring = true;
          this.drawPolygon(e, this.parameters.view);
        });
        action.on("cursor-update", (e) => this.drawPolyline(e, this.parameters.view));
        action.on("vertex-remove", (e) => this.drawPolyline(e, this.parameters.view));
        action.on("draw-complete", async (e) => {
          await this.drawPolygon(e, this.parameters.view, true);
          if (this.parameters.enableMeasure) this._startedMeasuring = false;
        });
        break;
    }
  }

  private async drawPolygon(evt, mapView: __esri.MapView, emit: boolean = false) {
    var vertices = evt.vertices;

    //remove existing graphic
    this._graphics.removeAll();

    // create a new polygon
    var polygon = await await Esri.Geometry.Polygon({
      rings: vertices,
      spatialReference: mapView.spatialReference
    });

    // create a new graphic representing the polygon, add it to the view
    var graphic = await Esri.Graphic({
      geometry: polygon,
      symbol: this.parameters.geometrySymbol
    });
    this._graphics.add(graphic);

    if (this.parameters.enableMeasure && this._startedMeasuring) {
      let geoengine = await Esri.Geometry.geometryEngine();
      let area = geoengine.geodesicArea(polygon, this.parameters.areaUnitOfMeasure);
      if (area < 0) {
        // simplify the polygon if needed and calculate the area again
        let simplifiedPolygon = geoengine.simplify(polygon) as __esri.Polygon;
        if (simplifiedPolygon) {
          area = geoengine.geodesicArea(simplifiedPolygon, this.parameters.areaUnitOfMeasure);
        }
      }
      // start displaying the area of the polygon
      await this.labelAreas(polygon, area, mapView);
    }

    if (emit && this.onDrawCompleted) this.onDrawCompleted(graphic);
  }

  private async drawPolyline(evt, view: __esri.MapView, emit: boolean = false) {
    var vertices = evt.vertices;

    //remove existing graphic
    this._graphics.removeAll();

    // create a new polyline
    var polyline = await Esri.Geometry.Polyline({
      paths: vertices,
      spatialReference: view.spatialReference
    });

    // create a new graphic representing the polyline, add it to the view
    var graphic = await await Esri.Graphic({
      geometry: polyline,
      symbol: this.parameters.polylineSymbol
    });
    this._graphics.add(graphic);
    if (this.parameters.enableMeasure && this._startedMeasuring) {
      let geoengine = await Esri.Geometry.geometryEngine();
      let area = geoengine.geodesicLength(polyline, this.parameters.areaUnitOfMeasure);
      if (area < 0) {
        // simplify the polyline if needed and calculate the area again
        let simplifiedPolygon = geoengine.simplify(polyline) as __esri.Polygon;
        if (simplifiedPolygon) {
          area = geoengine.geodesicLength(simplifiedPolygon, this.parameters.areaUnitOfMeasure);
        }
      }
      // start displaying the area of the polyline
      await this.labelDistance(polyline, area, view);
    }
    if (emit && this.onDrawCompleted) this.onDrawCompleted(graphic);
  }

  private async labelAreas(geom, area, mapView: __esri.MapView) {
    var s = this.parameters.labelSymbol;
    s.text = area.toFixed(2) + " " + this.parameters.areaLabel;
    var graphic = await Esri.Graphic({
      geometry: geom.centroid,
      symbol: s
    });
    this._graphics.add(graphic);
  }

  private async labelDistance(geom, area, mapView: __esri.MapView) {
    var s = this.parameters.labelSymbol;
    s.text = area.toFixed(2) + " " + this.parameters.distanceLabel;
    var graphic = await Esri.Graphic({
      geometry: geom.extent.center,
      symbol: s
    });
    this._graphics.add(graphic);
  }
}

export class DrawParameters {
  public graphicLayer: __esri.GraphicsLayer = null;
  public tool: string = "polygon"; // polygon - line
  public enableMeasure: boolean = false;
  public measureTool: string = "polygon"; // polygon - polyline
  public areaUnitOfMeasure: string = "hectares";
  public distanceUnitOfMeasure: string = "meters";
  public areaLabel: string = "ha";
  public distanceLabel: string = "m";
  public labelSymbol: any = {
    type: "text",
    color: "lightblue",
    haloColor: "black",
    haloSize: "5px",
    xoffset: 3,
    yoffset: 3,
    font: {
      // autocast as Font
      size: 12,
      family: "sans-serif"
    }
  };
  public geometrySymbol: any = {
    type: "simple-fill", // autocasts as SimpleFillSymbol
    color: [140, 140, 140, 0.7],
    style: "solid",
    outline: {
      // autocasts as SimpleLineSymbol
      color: [36, 146, 170],
      width: 2,
      cap: "round",
      join: "round"
    }
  };

  public polylineSymbol: any = {
    type: "simple-line", // autocasts as new SimpleLineSymbol()
    color: "lightblue",
    width: "2px",
    style: "solid"
  };

  constructor(public view: __esri.MapView, public domButtonNode: any) {}
}
