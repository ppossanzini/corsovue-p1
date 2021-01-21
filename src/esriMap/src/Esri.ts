import { Loader, CreationResult } from "./esriUtils";
import { Views } from "./Views";
import { Layers } from "./Layers";
import { Geometry } from "./Geometry";
import { Tasks } from "./Tasks";
import { Symbols } from "./Symbols";
import { Widgets, WidgetsFactory } from "./Widgets";
import { Renderers } from "./Renderers";
import { Support } from "./Support";


export class Core {
  public async urlUtils(): Promise<__esri.urlUtils> {
    return (await Loader.get(Loader.packageName + "/core/urlUtils")) as __esri.urlUtils;
  }

  public async Collection(options?: any): Promise<__esri.Collection> {
    return (await Loader.create<__esri.Collection>(Loader.packageName + "/core/Collection", options));
  }

  public async PromiseUtils(): Promise<__esri.promiseUtils> {
    return (await Loader.get(Loader.packageName + "/core/promiseUtils")) as __esri.promiseUtils;
  }

  public async WatchUtils(): Promise<__esri.watchUtils> {
    return (await Loader.get(Loader.packageName + "/core/watchUtils")) as __esri.watchUtils;
  }


}

export class Esri {

  public static async Basemap(options?: any): Promise<__esri.Basemap> {
    return await Loader.create<__esri.Basemap>(Loader.packageName + "/Basemap", options);
  }

  public static async Camera(options?: any): Promise<__esri.Camera> {
    return (await Loader.create<__esri.Camera>(Loader.packageName + "/Camera", options));
  }

  public static async Color(options?: any): Promise<__esri.Color> {
    return (await Loader.create<__esri.Color>(Loader.packageName + "/Color", options));
  }

  public static async ColorConstructor(): Promise<__esri.ColorConstructor> {
    return (await Loader.get(Loader.packageName + "/Color"));
  }

  public static async config(): Promise<__esri.config> {
    return (await Loader.get(Loader.packageName + "/config")) as __esri.config;
  }

  public static async Graphic(options?: any): Promise<__esri.Graphic> {
    return (await Loader.create<__esri.Graphic>(Loader.packageName + "/Graphic", options));
  }



  public static async GraphicConstructor(): Promise<__esri.GraphicConstructor> {
    return (await Loader.get(Loader.packageName + "/Graphic"));
  }

  public static async Ground(options?: any): Promise<__esri.Ground> {
    return await Loader.create<__esri.Ground>(Loader.packageName + "/Ground", options);
  }

  public static async kernel(): Promise<__esri.kernel> {
    return (await Loader.get(Loader.packageName + "/kernel")) as __esri.kernel
  }

  public static async PopupTemplate(options?: any): Promise<__esri.PopupTemplate> {
    return (await Loader.create<__esri.PopupTemplate>(Loader.packageName + "/PopupTemplate", options));
  }

  public static async Map(options?: any): Promise<__esri.Map> {
    return (await Loader.create<__esri.Map>(Loader.packageName + "/Map", options));
  }

  public static async request(): Promise<__esri.request> {
    return (await Loader.get(Loader.packageName + "/request")) as __esri.request;
  }

  public static async Viewpoint(options?: any): Promise<__esri.Viewpoint> {
    return (await Loader.create<__esri.Viewpoint>(Loader.packageName + "/Viewpoint", options));
  }

  public static async WebMap(options?: any): Promise<__esri.WebMap> {
    return await Loader.create<__esri.WebMap>(Loader.packageName + "/WebMap", options);
  }

  public static async WebScene(options?: any): Promise<__esri.WebScene> {
    return await Loader.create<__esri.WebScene>(Loader.packageName + "/WebScene", options);
  }

  public static Views: Views = new Views();
  public static Layers: Layers = new Layers();
  public static Geometry: Geometry = new Geometry();
  public static Symbols: Symbols = new Symbols();
  public static Tasks: Tasks = new Tasks();
  public static Widgets: Widgets = new Widgets();
  public static WidgetsFactory: WidgetsFactory = new WidgetsFactory();
  public static Core: Core = new Core();
  public static Renderers: Renderers = new Renderers();
  public static Support: Support = new Support();
}




