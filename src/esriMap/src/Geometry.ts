import { Loader, CreationResult } from "./esriUtils";
import { Esri } from "@/esriMap/src/Esri";

export class Geometry {

  // public async Geometry(): Promise<__esri.Geometry> {
  //   return (await Loader.get(Loader.packageName + "/geometry/Geometry")) as __esri.Geometry;
  // }

  public async Circle(options?: any): Promise<__esri.Circle> {
    return (await Loader.create<__esri.Circle>(Loader.packageName + "/geometry/Circle", options));
  }

  public async Extent(options?: any): Promise<__esri.Extent> {
    return (await Loader.create<__esri.Extent>(Loader.packageName + "/geometry/Extent", options));
  }

  public async ExtentConstructor(): Promise<__esri.ExtentConstructor> {
    return (await Loader.get(Loader.packageName + "/geometry/Extent")) as __esri.ExtentConstructor;
  }

  public async ExtentOf(geometries: Array<__esri.Geometry>): Promise<__esri.Extent> {
    let extent: __esri.Extent = null;
    if (geometries)
      for (const key in geometries) {
        const geom = geometries[key] as any;

        let gextent = geom.extent;

        if (!gextent && geom.longitude)
          gextent = await Esri.Geometry.Extent({
            xmin: geom.longitude,
            xmax: geom.longitude,
            ymin: geom.latitude,
            ymax: geom.latitude,
            spatialReference: geom.spatialReference
          } as __esri.Extent)

        if (gextent)
          if (extent == null)
            extent = gextent;
          else
            extent = extent.union(gextent);

      }
    return extent;
  }

  public async HeightModelInfo(options?: any): Promise<__esri.HeightModelInfo> {
    return (await Loader.create<__esri.HeightModelInfo>(Loader.packageName + "/geometry/HeightModelInfo", options));
  }

  public async Multipoint(options?: any): Promise<__esri.Multipoint> {
    return (await Loader.create<__esri.Multipoint>(Loader.packageName + "/geometry/Multipoint", options));
  }

  public async MultipointConstructor(): Promise<__esri.PointConstructor> {
    return (await Loader.get(Loader.packageName + "/geometry/Multipoint"));
  }

  public async Point(options?: any): Promise<__esri.Point> {
    return (await Loader.create<__esri.Point>(Loader.packageName + "/geometry/Point", options));
  }

  public async PointConstructor(): Promise<__esri.PointConstructor> {
    return (await Loader.get(Loader.packageName + "/geometry/Point"));
  }

  public async Polygon(options?: any): Promise<__esri.Polygon> {
    return (await Loader.create<__esri.Polygon>(Loader.packageName + "/geometry/Polygon", options));
  }

  public async PolygonConstructor(): Promise<__esri.PolygonConstructor> {
    return (await Loader.get(Loader.packageName + "/geometry/Polygon"));
  }

  public async Polyline(options?: any): Promise<__esri.Polyline> {
    return (await Loader.create<__esri.Polyline>(Loader.packageName + "/geometry/Polyline", options));
  }

  public async PolylineConstructor(): Promise<__esri.PolylineConstructor> {
    return (await Loader.get(Loader.packageName + "/geometry/Polyline"));
  }

  public async ScreenPoint(options?: any): Promise<__esri.ScreenPoint> {
    return (await Loader.create<__esri.ScreenPoint>(Loader.packageName + "/geometry/ScreenPoint", options));
  }

  public async SpatialReference(options?: any): Promise<__esri.SpatialReference> {
    return (await Loader.create<__esri.SpatialReference>(Loader.packageName + "/geometry/SpatialReference", options));
  }

  public async geometryEngine(): Promise<__esri.geometryEngine> {
    return (await Loader.get(Loader.packageName + "/geometry/geometryEngine")) as __esri.geometryEngine;
  }

  public async geometryEngineAsync(): Promise<__esri.geometryEngineAsync> {
    return (await Loader.get(Loader.packageName + "/geometry/geometryEngineAsync")) as __esri.geometryEngineAsync;
  }

  public Support = {
    normalizeUtils: async function (): Promise<__esri.normalizeUtils> {
      return (await Loader.get(Loader.packageName + "/geometry/support/normalizeUtils")) as __esri.normalizeUtils;
    },
    jsonUtils: async function (): Promise<__esri.jsonUtils> {
      return (await Loader.get(Loader.packageName + "/geometry/support/jsonUtils")) as __esri.jsonUtils;
    },
    webMercatorUtils: async function (): Promise<__esri.webMercatorUtils> {
      return (await Loader.get(Loader.packageName + "/geometry/support/webMercatorUtils")) as __esri.webMercatorUtils;
    }
  }
}
