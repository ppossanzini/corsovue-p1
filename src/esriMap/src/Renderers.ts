import { Loader, CreationResult } from "./esriUtils";

export class Renderers {

  public async ClassBreaksRenderer(options?: any): Promise<__esri.ClassBreaksRenderer> {
    return (await Loader.create<__esri.ClassBreaksRenderer>(Loader.packageName + "/renderers/smartMapping/statistics/classBreaks", options));
  }

  public async SimpleRenderer(options?: any): Promise<__esri.SimpleRenderer> {
    return (await Loader.create<__esri.SimpleRenderer>(Loader.packageName + "/renderers/SimpleRenderer", options));
  }

  public SmartMapping: SmartMapping = new SmartMapping();
}

export class SmartMapping {
  public async ClassBreaks(options: any): Promise<any> {
    let func = await (Loader.get(Loader.packageName + "/renderers/smartMapping/statistics/classBreaks"));
    return await func(options);
  }

  public async ColorRendererCreator(): Promise<__esri.color> {
    return await Loader.get(Loader.packageName + "/renderers/smartMapping/creators/color")
  }

  public Symbology: Symbology = new Symbology();
}

export class Symbology {
  public Color: Color = new Color();
}

export class Color {
  public async getSchemes(): Promise<__esri.ColorScheme> {
    let func = await (Loader.get(Loader.packageName + "/renderers/smartMapping/symbology/color"));
    return func.getSchemes();
  }
  public async cloneScheme(scheme: __esri.ColorScheme): Promise<__esri.ColorScheme> {
    let func = await (Loader.get(Loader.packageName + "/renderers/smartMapping/symbology/color"));
    return func.cloneScheme(scheme);
  }
}
