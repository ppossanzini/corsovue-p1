import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Esri } from "./esriMap";
import { apeServices } from "./services/ape.services";
import store, { getters } from "./store";

@Component({})
export default class App extends Vue {

  @Prop({ default: null })
  mydata: {
    p1?: string,
    p2?: number
  }

  item: server.Ape = null;

  get ape(): server.Ape[] {
    return getters.ape(store.state)();
  }

  get columns(): string[] {
    // if (this.ape.length) {
    //   let a = this.ape[0];
    //   return Object.keys(a);
    // }
    return ["id", "scEmail"]
  }

  async mounted() {
    // await apeServices.GetApe();

    let map = await Esri.Map({
      basemap: "hybrid",
    } as __esri.MapProperties);

    let mapview = await Esri.Views.MapView({
      container: 'map',
      map: map, center: [12, 42],
      zoom: 12
    } as __esri.MapViewProperties)

    let gl = await Esri.Layers.GraphicsLayer({


    } as __esri.GraphicsLayerProperties)

    map.layers.add(gl);
    Esri.WidgetsFactory.BasemapGallery(mapview);
    Esri.WidgetsFactory.LayerList(mapview);

    let fl = await Esri.Layers.FeatureLayer({url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0"})
    map.layers.add(fl);
  }
}