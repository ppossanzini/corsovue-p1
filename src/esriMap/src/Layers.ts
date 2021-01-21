import { CreationResult, Loader } from "./esriUtils";
import { GeoTiffImageLayer } from "./customLayers/GeoTiffImageLayer";
import { MultiLayer } from "./customLayers/MultiLayer";
import { ClientsideImageryLayer } from "./customLayers/ClientsideImageryLayer";

export class Layers {

  public async FeatureLayer(options?: any): Promise<__esri.FeatureLayer> {
    return await Loader.create<__esri.FeatureLayer>(Loader.packageName + "/layers/FeatureLayer", options);
  }

  // public async BaseDynamicLayer(options?: any): Promise<__esri.BaseDynamicLayer> {
  //   return await Loader.create<__esri.BaseDynamicLayer>(Loader.packageName + "/layers/BaseDynamicLayer", options);
  // }

  // public async BaseElevationLayer(options?: any): Promise<__esri.BaseElevationLayer> {
  //   return await Loader.create<__esri.BaseElevationLayer>(Loader.packageName + "/layers/BaseElevationLayer", options);
  // }

  public async BaseDynamicLayer(): Promise<any> {
    return (await Loader.get(Loader.packageName + "/layers/BaseDynamicLayer"));
  }

  public async BaseElevationLayer(): Promise<any> {
    return (await Loader.get(Loader.packageName + "/layers/BaseElevationLayer"));
  }

  public async BaseTileLayer(): Promise<any> {
    return (await Loader.get(Loader.packageName + "/layers/BaseTileLayer"));
  }

  public async BaseLayerView2D(): Promise<any> {
    return (await Loader.get(Loader.packageName + "/views/2d/layers/BaseLayerView2D"));
  }

  public async CSVLayer(options?: any): Promise<__esri.CSVLayer> {
    return await Loader.create<__esri.CSVLayer>(Loader.packageName + "/layers/CSVLayer", options);
  }

  public async ElevationLayer(options?: any): Promise<__esri.ElevationLayer> {
    return await Loader.create<__esri.ElevationLayer>(Loader.packageName + "/layers/ElevationLayer", options);
  }

  public async GeoRSSLayer(options?: any): Promise<__esri.GeoRSSLayer> {
    return await Loader.create<__esri.GeoRSSLayer>(Loader.packageName + "/layers/GeoRSSLayer", options);
  }

  public async GraphicsLayer(options?: any): Promise<__esri.GraphicsLayer> {
    return await Loader.create<__esri.GraphicsLayer>(Loader.packageName + "/layers/GraphicsLayer", options);
  }

  public async GroupLayer(options?: any): Promise<__esri.GroupLayer> {
    return await Loader.create<__esri.GroupLayer>(Loader.packageName + "/layers/GroupLayer", options);
  }

  public async ImageryLayer(options?: any): Promise<__esri.ImageryLayer> {
    return await Loader.create<__esri.ImageryLayer>(Loader.packageName + "/layers/ImageryLayer", options);
  }

  public async IntegratedMeshLayer(options?: any): Promise<__esri.IntegratedMeshLayer> {
    return await Loader.create<__esri.IntegratedMeshLayer>(Loader.packageName + "/layers/IntegratedMeshLayer", options);
  }

  public async KMLLayer(options?: any): Promise<__esri.KMLLayer> {
    return await Loader.create<__esri.KMLLayer>(Loader.packageName + "/layers/KMLLayer", options);
  }

  public async MapImageLayer(options?: any): Promise<__esri.MapImageLayer> {
    return await Loader.create<__esri.MapImageLayer>(Loader.packageName + "/layers/MapImageLayer", options);
  }

  public async OpenStreetMapLayer(options?: any): Promise<__esri.OpenStreetMapLayer> {
    return await Loader.create<__esri.OpenStreetMapLayer>(Loader.packageName + "/layers/OpenStreetMapLayer", options);
  }

  public async PointCloudLayer(options?: any): Promise<__esri.PointCloudLayer> {
    return await Loader.create<__esri.PointCloudLayer>(Loader.packageName + "/layers/PointCloudLayer", options);
  }

  public async SceneLayer(options?: any): Promise<__esri.SceneLayer> {
    return await Loader.create<__esri.SceneLayer>(Loader.packageName + "/layers/SceneLayer", options);
  }

  public async StreamLayer(options?: any): Promise<__esri.StreamLayer> {
    return await Loader.create<__esri.StreamLayer>(Loader.packageName + "/layers/StreamLayer", options);
  }

  public async TileLayer(options?: any): Promise<__esri.TileLayer> {
    return await Loader.create<__esri.TileLayer>(Loader.packageName + "/layers/TileLayer", options);
  }

  public async VectorTileLayer(options?: any): Promise<__esri.VectorTileLayer> {
    return await Loader.create<__esri.VectorTileLayer>(Loader.packageName + "/layers/VectorTileLayer", options);
  }

  public async WebTileLayer(options?: any): Promise<__esri.WebTileLayer> {
    return await Loader.create<__esri.WebTileLayer>(Loader.packageName + "/layers/WebTileLayer", options);
  }

  public async WMSLayer(options?: any): Promise<__esri.WMSLayer> {
    return await Loader.create<__esri.WMSLayer>(Loader.packageName + "/layers/WMSLayer", options);
  }

  public async WMTSLayer(options?: any): Promise<__esri.WMTSLayer> {
    return await Loader.create<__esri.WMTSLayer>(Loader.packageName + "/layers/WMTSLayer", options);
  }

  public async GeoTiffImageLayer(options?: any) {
    return await GeoTiffImageLayer(options);
  }

  public async MultiRendererLayer(options?: any) {
    return await MultiLayer(options);
  }

  public async ClientsideImageryLayer(options?: any) {
    return await ClientsideImageryLayer(options);
  }

  public Support: LayersSupport = new LayersSupport();

}

export class LayersSupport {

  public async DimensionalDefinition(options?: any): Promise<__esri.DimensionalDefinition> {
    return await Loader.create<__esri.DimensionalDefinition>(Loader.packageName + "/layers/support/DimensionalDefinition", options);
  }

  public async Sublayer(options?: any): Promise<__esri.Sublayer> {
    return await Loader.create<__esri.Sublayer>(Loader.packageName + "/layers/support/Sublayer", options);
  }

  public async RasterFunction(options?: any): Promise<__esri.RasterFunction> {
    return await Loader.create<__esri.RasterFunction>(Loader.packageName + "/layers/support/RasterFunction", options);
  }

}
