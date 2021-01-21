import { Loader, CreationResult } from "./esriUtils"

export class Symbols {

  public async ExtrudeSymbol3DLayer(options?: any): Promise<__esri.ExtrudeSymbol3DLayer> {
    return (await Loader.create<__esri.ExtrudeSymbol3DLayer>(Loader.packageName + "/symbols/ExtrudeSymbol3DLayer", options));
  }

  public async FillSymbol(options?: any): Promise<__esri.FillSymbol> {
    return (await Loader.create<__esri.FillSymbol>(Loader.packageName + "/symbols/FillSymbol", options));
  }

  public async FillSymbolConstructor(): Promise<__esri.FillSymbolConstructor> {
    return (await Loader.get(Loader.packageName + "/symbols/FillSymbol"));
  }

  public async FillSymbol3DLayer(options?: any): Promise<__esri.FillSymbol3DLayer> {
    return (await Loader.create<__esri.FillSymbol3DLayer>(Loader.packageName + "/symbols/FillSymbol3DLayer", options));
  }

  public async Font(options?: any): Promise<__esri.Font> {
    return (await Loader.create<__esri.Font>(Loader.packageName + "/symbols/Font", options));
  }

  public async IconSymbol3DLayer(options?: any): Promise<__esri.IconSymbol3DLayer> {
    return (await Loader.create<__esri.IconSymbol3DLayer>(Loader.packageName + "/symbols/IconSymbol3DLayer", options));
  }

  public async LabelSymbol3D(options?: any): Promise<__esri.LabelSymbol3D> {
    return (await Loader.create<__esri.LabelSymbol3D>(Loader.packageName + "/symbols/LabelSymbol3D", options));
  }

  public async LineSymbol(options?: any): Promise<__esri.LineSymbol> {
    return (await Loader.create<__esri.LineSymbol>(Loader.packageName + "/symbols/LineSymbol", options));
  }

  public async LineSymbol3D(options?: any): Promise<__esri.LineSymbol3D> {
    return (await Loader.create<__esri.LineSymbol3D>(Loader.packageName + "/symbols/LineSymbol3D", options));
  }

  public async LineSymbol3DLayer(options?: any): Promise<__esri.LineSymbol3DLayer> {
    return (await Loader.create<__esri.LineSymbol3DLayer>(Loader.packageName + "/symbols/LineSymbol3DLayer", options));
  }

  public async MarkerSymbol(options?: any): Promise<__esri.MarkerSymbol> {
    return (await Loader.create<__esri.MarkerSymbol>(Loader.packageName + "/symbols/MarkerSymbol", options));
  }

  public async MeshSymbol3D(options?: any): Promise<__esri.MeshSymbol3D> {
    return (await Loader.create<__esri.MeshSymbol3D>(Loader.packageName + "/symbols/MeshSymbol3D", options));
  }

  public async ObjectSymbol3DLayer(options?: any): Promise<__esri.ObjectSymbol3DLayer> {
    return (await Loader.create<__esri.ObjectSymbol3DLayer>(Loader.packageName + "/symbols/ObjectSymbol3DLayer", options));
  }

  public async PathSymbol3DLayer(options?: any): Promise<__esri.PathSymbol3DLayer> {
    return (await Loader.create<__esri.PathSymbol3DLayer>(Loader.packageName + "/symbols/PathSymbol3DLayer", options));
  }

  public async PictureFillSymbol(options?: any): Promise<__esri.PictureFillSymbol> {
    return (await Loader.create<__esri.PictureFillSymbol>(Loader.packageName + "/symbols/PictureFillSymbol", options));
  }

  public async PictureMarkerSymbol(options?: any): Promise<__esri.PictureMarkerSymbol> {
    return (await Loader.create<__esri.PictureMarkerSymbol>(Loader.packageName + "/symbols/PictureMarkerSymbol", options));
  }

  public async PointSymbol3D(options?: any): Promise<__esri.PointSymbol3D> {
    return (await Loader.create<__esri.PointSymbol3D>(Loader.packageName + "/symbols/PointSymbol3D", options));
  }

  public async PolygonSymbol3D(options?: any): Promise<__esri.PolygonSymbol3D> {
    return (await Loader.create<__esri.PolygonSymbol3D>(Loader.packageName + "/symbols/PolygonSymbol3D", options));
  }

  public async SimpleFillSymbol(options?: any): Promise<__esri.SimpleFillSymbol> {
    return (await Loader.create<__esri.SimpleFillSymbol>(Loader.packageName + "/symbols/SimpleFillSymbol", options));
  }

  public async SimpleLineSymbol(options?: any): Promise<__esri.SimpleLineSymbol> {
    return (await Loader.create<__esri.SimpleLineSymbol>(Loader.packageName + "/symbols/SimpleLineSymbol", options));
  }

  public async SimpleMarkerSymbol(options?: any): Promise<__esri.SimpleMarkerSymbol> {
    return (await Loader.create<__esri.SimpleMarkerSymbol>(Loader.packageName + "/symbols/SimpleMarkerSymbol", options));
  }

  public async SimpleMarkerSymbolConstructor(): Promise<__esri.SimpleMarkerSymbolConstructor> {
    return (await Loader.get(Loader.packageName + "/symbols/SimpleMarkerSymbol"));
  }

  public async TextSymbol(options?: any): Promise<__esri.TextSymbol> {
    return (await Loader.create<__esri.TextSymbol>(Loader.packageName + "/symbols/TextSymbol", options));
  }

  public async TextSymbolConstructor(): Promise<__esri.TextSymbolConstructor> {
    return (await Loader.get(Loader.packageName + "/symbols/TextSymbol"));
  }

  public async TextSymbol3DLayer(options?: any): Promise<__esri.TextSymbol3DLayer> {
    return (await Loader.create<__esri.TextSymbol3DLayer>(Loader.packageName + "/symbols/TextSymbol3DLayer", options));
  }

  public async WebStyleSymbol(options?: any): Promise<__esri.WebStyleSymbol> {
    return (await Loader.create<__esri.WebStyleSymbol>(Loader.packageName + "/symbols/WebStyleSymbol", options));
  }
}
