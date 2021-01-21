import { CreationResult, Loader } from "./esriUtils";

export class Tasks {
  public async ClosestFacilityTask(options?: any): Promise<__esri.ClosestFacilityTask> {
    return (await Loader.create<__esri.ClosestFacilityTask>(Loader.packageName + "/tasks/ClosestFacilityTask", options));
  }

  public async FindTask(options?: any): Promise<__esri.FindTask> {
    return (await Loader.create<__esri.FindTask>(Loader.packageName + "/tasks/FindTask", options));
  }

  public async GeometryService(options?: any): Promise<__esri.GeometryService> {
    return (await Loader.create<__esri.GeometryService>(Loader.packageName + "/tasks/GeometryService", options));
  }

  public async Geoprocessor(options?: any): Promise<__esri.Geoprocessor> {
    return (await Loader.create<__esri.Geoprocessor>(Loader.packageName + "/tasks/Geoprocessor", options));
  }

  public async IdentifyTask(options?: any): Promise<__esri.IdentifyTask> {
    return (await Loader.create<__esri.IdentifyTask>(Loader.packageName + "/tasks/IdentifyTask", options));
  }

  public async ImageServiceIdentifyTask(options?: any): Promise<__esri.ImageServiceIdentifyTask> {
    return (await Loader.create<__esri.ImageServiceIdentifyTask>(Loader.packageName + "/tasks/ImageServiceIdentifyTask", options));
  }

  public async Locator(options?: any): Promise<__esri.Locator> {
    return (await Loader.create<__esri.Locator>(Loader.packageName + "/tasks/Locator", options));
  }

  public async PrintTask(options?: any): Promise<__esri.PrintTask> {
    return (await Loader.create<__esri.PrintTask>(Loader.packageName + "/tasks/PrintTask", options));
  }

  public async QueryTask(options?: any): Promise<__esri.QueryTask> {
    return (await Loader.create<__esri.QueryTask>(Loader.packageName + "/tasks/QueryTask", options));
  }

  public async RouteTask(options?: any): Promise<__esri.RouteTask> {
    return (await Loader.create<__esri.RouteTask>(Loader.packageName + "/tasks/RouteTask", options));
  }

  public async ServiceAreaTask(options?: any): Promise<__esri.ServiceAreaTask> {
    return (await Loader.create<__esri.ServiceAreaTask>(Loader.packageName + "/tasks/ServiceAreaTask", options));
  }

  public Support: Support = new Support();
}


export class Support {
  public async Query(options?: any): Promise<__esri.Query> {
    return (await Loader.create<__esri.Query>(Loader.packageName + "/tasks/support/Query", options));
  }

  public async PrintParameters(options?: any): Promise<__esri.PrintParameters> {
    return (await Loader.create<__esri.PrintParameters>(Loader.packageName + "/tasks/support/PrintParameters", options));
  }

  public async PrintTemplate(options?: any): Promise<__esri.PrintTemplate> {
    return (await Loader.create<__esri.PrintTemplate>(Loader.packageName + "/tasks/support/PrintTemplate", options));
  }
}
