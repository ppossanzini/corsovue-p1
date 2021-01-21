import { Loader, CreationResult } from "./esriUtils";

export class Widgets {

  public async AreaMeasurement2D(options?: any): Promise<any> {
    return (await Loader.create<any>(Loader.packageName + "/widgets/AreaMeasurement2D", options));
  }

  public async AreaMeasurement3D(options?: any): Promise<__esri.AreaMeasurement3D> {
    return (await Loader.create<__esri.AreaMeasurement3D>(Loader.packageName + "/widgets/AreaMeasurement3D", options));
  }

  public async Attribution(options?: any): Promise<__esri.Attribution> {
    return (await Loader.create<__esri.Attribution>(Loader.packageName + "/widgets/Attribution", options));
  }

  public async BasemapGallery(options?: any): Promise<__esri.BasemapGallery> {
    return (await Loader.create<__esri.BasemapGallery>(Loader.packageName + "/widgets/BasemapGallery", options));
  }

  public async BasemapToggle(options?: any): Promise<__esri.BasemapToggle> {
    return (await Loader.create<__esri.BasemapToggle>(Loader.packageName + "/widgets/BasemapToggle", options));
  }

  public async ColorSlider(options?: any): Promise<__esri.ColorSlider> {
    return (await Loader.create<__esri.ColorSlider>(Loader.packageName + "/widgets/ColorSlider", options));
  }

  public async Compass(options?: any): Promise<__esri.Compass> {
    return (await Loader.create<__esri.Compass>(Loader.packageName + "/widgets/Compass", options));
  }

  public async DistanceMeasurement2D(options?: any): Promise<any> {
    return (await Loader.create<any>(Loader.packageName + "/widgets/DistanceMeasurement2D", options));
  }

  public async Expand(options?: any): Promise<__esri.Expand> {
    return (await Loader.create<__esri.Expand>(Loader.packageName + "/widgets/Expand", options));
  }

  public async Home(options?: any): Promise<__esri.Home> {
    return (await Loader.create<__esri.Home>(Loader.packageName + "/widgets/Home", options));
  }

  public async LayerList(options?: any): Promise<__esri.LayerList> {
    return (await Loader.create<__esri.LayerList>(Loader.packageName + "/widgets/LayerList", options));
  }

  public async Legend(options?: any): Promise<__esri.Legend> {
    return (await Loader.create<__esri.Legend>(Loader.packageName + "/widgets/Legend", options));
  }

  public async Locate(options?: any): Promise<__esri.Locate> {
    return (await Loader.create<__esri.Locate>(Loader.packageName + "/widgets/Locate", options));
  }

  public async NavigationToggle(options?: any): Promise<__esri.NavigationToggle> {
    return (await Loader.create<__esri.NavigationToggle>(Loader.packageName + "/widgets/NavigationToggle", options));
  }

  public async Popup(options?: any): Promise<__esri.Popup> {
    return (await Loader.create<__esri.Popup>(Loader.packageName + "/widgets/Popup", options));
  }

  public async Print(options?: any): Promise<__esri.Print> {
    return (await Loader.create<__esri.Print>(Loader.packageName + "/widgets/Print", options));
  }

  public async ScaleBar(options?: any): Promise<__esri.ScaleBar> {
    return (await Loader.create<__esri.ScaleBar>(Loader.packageName + "/widgets/ScaleBar", options));
  }

  public async Search(options?: any): Promise<__esri.Search> {
    return (await Loader.create<__esri.Search>(Loader.packageName + "/widgets/Search", options));
  }

  public async SizeSlider(options?: any): Promise<__esri.SizeSlider> {
    return (await Loader.create<__esri.SizeSlider>(Loader.packageName + "/widgets/SizeSlider", options));
  }

  public async Sketch(options?: any): Promise<any> {
    return (await Loader.create<__esri.Sketch>(Loader.packageName + "/widgets/Sketch", options));
  }

  public async SketchViewModel(options?: any): Promise<any> {
    return (await Loader.create<__esri.SketchViewModel>(Loader.packageName + "/widgets/Sketch/SketchViewModel", options));
  }

  public async Track(options?: any): Promise<__esri.Track> {
    return (await Loader.create<__esri.Track>(Loader.packageName + "/widgets/Track", options));
  }

  // public async UnivariateColorSizeSlider(options?: any): Promise<__esri.UnivariateColorSizeSlider> {
  //   return (await Loader.create<__esri.UnivariateColorSizeSlider>(Loader.packageName + "/widgets/UnivariateColorSizeSlider", options));
  // }

  public async Zoom(options?: any): Promise<__esri.Zoom> {
    return (await Loader.create<__esri.Zoom>(Loader.packageName + "/widgets/Zoom", options));
  }

}

export class WidgetsFactory {

  public async Search(mapView: __esri.View, position: string = "top-left"): Promise<__esri.Search> {
    let search: __esri.Search = await new Widgets().Search({ view: mapView } as __esri.SearchProperties);
    // mapView.ui.add(search, { position: position, index: 0 });
    mapView.ui.add([{ component: search, position: position, index: 0 }]);
    return search;
  }

  public async Home(mapView: __esri.View, position: string = "top-left"): Promise<__esri.Home> {
    let home = await new Widgets().Home({ view: mapView } as __esri.HomeProperties);
    mapView.ui.add(home, { position: position } as any);
    return home;
  }

  public async Locate(mapView: __esri.View, position: string = "top-left"): Promise<__esri.Locate> {
    let result = await new Widgets().Locate({ view: mapView } as __esri.LocateProperties);
    mapView.ui.add(result, { position: position } as any);
    return result;
  }

  public async Track(mapView: __esri.View, position: string = "top-left"): Promise<__esri.Track> {
    let result = await new Widgets().Track({ view: mapView } as __esri.TrackProperties);
    mapView.ui.add(result, { position: position } as any);
    return result;
  }

  public async LayerList(mapView: __esri.View, position: string = "top-right", withLegendPerLayer: boolean = false): Promise<__esri.LayerList> {
    let _widgets = new Widgets();
    let legendFunction = function (event) {
      let item = event.item;
      if (item.layer.customActions) {
        item.actionsSections = [item.layer.customActions];
      }

      if (item.layer.legendEnabled && item.layer.customLegend)
        item.panel = {
          content: event.item.layer.customLegend,
          open: true
        };
    }
    let result = await _widgets.LayerList({
      view: mapView,
      container: document.createElement("div"),
      listItemCreatedFunction: withLegendPerLayer ? legendFunction : null
    } as __esri.LayerListProperties);
    let resultbutton = await _widgets.Expand({ content: (result as any).domNode, view: mapView, expandIconClass: "esri-icon-layer-list", autoCollapse: true } as __esri.ExpandProperties);
    mapView.ui.add(resultbutton, { position: position } as any);
    return result;
  }

  public async Legend(mapView: __esri.View, position: string = "bottom-right"): Promise<__esri.Legend> {
    let result = await new Widgets().Legend({ view: mapView });
    mapView.ui.add(result, { position: position } as any);
    return result;
  }

  public async LegendWithExpander(mapView: __esri.View, position: string = "bottom-right", iconClass: string = "esri-icon-notice-round"): Promise<__esri.Legend> {
    let result = await new Widgets().Legend({ view: mapView, container: document.createElement("div"), style: "card" });
    let expand = await new Widgets().Expand({ view: mapView, content: result, expandIconClass: iconClass });

    mapView.ui.add(expand, { position: position } as any);
    return result;
  }

  public async BasemapGallery(mapView: __esri.View, position: string = "top-right"): Promise<__esri.BasemapGallery> {
    let _widgets = new Widgets();
    let result = await _widgets.BasemapGallery({
      view: mapView, container: document.createElement("div"), source: {
        portal: {
          url: "https://www.arcgis.com",
          useVectorBasemaps: true, // Load vector tile basemap group
        },
      }
    });
    let resultbutton = await _widgets.Expand({ content: (result as any).domNode, view: mapView, expandIconClass: "esri-icon-basemap", autoCollapse: true } as __esri.ExpandProperties);
    mapView.ui.add(resultbutton, { position: position } as any);
    return result;
  }

  public async DistanceMeasure(mapView: __esri.View, position: string = "top-right"): Promise<any> {
    let _widgets = new Widgets();
    let result = await _widgets.AreaMeasurement2D({})
    mapView.ui.add(result, { position: position } as any);
  }

}
