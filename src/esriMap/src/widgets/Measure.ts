import { Esri } from "../Esri";

export class Measure {

  private _graphics: __esri.Collection<__esri.Graphic>;
  public drawing: boolean = false;

  activeWidget: any = null;
  currentMode = null;

  constructor(public parameters: MeasureParameters) {
    if (!parameters.view) throw "Unable to create a Measure Tool without a View";
  }

  public async MeasureArea() {
    this.RemoveWidget();
    if (this.currentMode == "area")  { this.currentMode = null; return; }
    this.currentMode = "area";

    this.activeWidget = await Esri.Widgets.AreaMeasurement2D({
      viewModel: {
        view: this.parameters.view,
        // mode: "geodesic",
      }
    });

    this.activeWidget.viewModel.newMeasurement();
    this.parameters.view.ui.add(this.activeWidget, "top-right");
  }

  public async MeasurePerimeter() {
    this.RemoveWidget();

    if (this.currentMode == "perimeter") { this.currentMode = null; return; }
    this.currentMode = "perimeter";

    this.activeWidget = await Esri.Widgets.DistanceMeasurement2D({
      viewModel: {
        view: this.parameters.view,
        // mode: "geodesic",
      }
    });

    this.activeWidget.viewModel.newMeasurement();
    this.parameters.view.ui.add(this.activeWidget, "top-right");
  }

  public RemoveWidget() {
    if (this.activeWidget) {
      this.parameters.view.ui.remove(this.activeWidget);
      this.activeWidget.destroy();
    }
    this.activeWidget = null;
  }
}

export class MeasureParameters {

  public areaUnitOfMeasure: string = "hectares";
  public distanceUnitOfMeasure: string = "meters";

  constructor(
    public view: __esri.MapView,
  ) {
  }
}
