import * as el from "esri-loader";
import Vue, { WatchOptions, } from "vue";
import { ArrayObserver } from "./Observers/ObservableArray";
import { Esri } from "./Esri";

declare let window: any;

export class Loader {
  static isloading: Promise<any>;

  static packageName: string = "esri";

  static remapPrefix(prefix: string, uri: string) {
    Loader.packageName = prefix;

    window.dojoConfig = {
      async: true,
      packages: [
        {
          name: prefix,
          location: uri
        }
      ],
      has: { "dojo-preload-i18n-Api": false }
    };
  }

  static initialize(url: string = "https://js.arcgis.com/4.15/") {
    if (!this.isloading) {
      this.isloading = new Promise((resolve, reject) => {
        if (!el.isLoaded())
          el.loadScript({ url: url }).then(() => { resolve(null); }).catch((err) => { throw (err); });
      });
    }
  }

  static async get(dep: string): Promise<any> {
    await this.isloading;
    return new Promise<any>((resolve, reject) => {
      el.loadModules([dep]).then((refs) => {
        resolve(refs[0]);
      });
    });
  }

  static async load(...deps: string[]): Promise<any> {
    await this.isloading;
    return new Promise((resolve, reject) => {
      el.loadModules(deps).then((refs) => {
        resolve(refs);
      });
    });
  }

  static async create<T>(dep: string, options?: any): Promise<T> {

    let ctor: any = await Loader.get(dep);
    if (!ctor) throw "Unable to create :" + dep;

    return (await new CreationResult<T>(new ctor(options))).result;
  }
}

export class CreationResult<T>{
  public result: T;

  constructor(item: T) {
    this.result = item;
  }
}

export function BindTo(vue: Vue, obj: any, propname: string, twoWay: boolean = false, esriprop?: string, options?: WatchOptions) {
  vue.$watch(propname, (n, o) => {
    if (n !== o)
      obj.set(esriprop || propname, n, options);
  });

  if (twoWay && obj.watch)
    obj.watch(esriprop || propname, (newvalue, old) => {
      if (newvalue !== old)
        vue.$set(vue, propname, newvalue);
    });
}

export function BindArrayToLayer<T>(from: T[], to: __esri.Collection<__esri.Graphic>, map: { (item: T): Promise<__esri.Graphic> }, deep: boolean = false) {
  function removeGraphic(_g) {
    let $g = _g._$graphic$_;
    // let idx = to.indexOf($g);
    // if (idx >= 0) (to as any).splice(idx, 1);
    to.remove($g);
    _g._$graphic$_ = null;
  }

  async function addGraphic(_g) {
    if (!_g) return;
    if ((_g as any)._$graphic$_) return; // doppio check -- prima per evitare il rendering di graphics già calcolati
    let $g = (await map(_g)) as __esri.Graphic;
    if ((_g as any)._$graphic$_) return; // doppio check -- dopo il mapping per evitare accavallamenti di richieste asincrone
    (_g as any)._$graphic$_ = $g;
    to.add($g);
  }

  async function changed(_g) {
    let old = (_g as any)._$graphic$_;
    let $g = (await map(_g)) as __esri.Graphic;
    (_g as any)._$graphic$_ = $g;
    if (old)
      to.remove(old);
    to.add($g);
  }

  let observer = new ArrayObserver<T>(from, deep);
  observer.Subscribe(async (operation, inserted, deleted) => {

    if (operation == 'changed') {
      for (const key in inserted) {
        const element = inserted[key];
        await changed(element);
      }
      // inserted.forEach(async (i) => await changed(i));
      return;
    }


    if (deleted)
      for (const key in deleted) {
        const i = deleted[key];
        if (i instanceof Array)
          i.forEach(element => removeGraphic(element));

        removeGraphic(i);
      };

    if (inserted)
      for (const key in inserted) {
        const element = inserted[key];
        await addGraphic(element);
      }
    // inserted.forEach(async i => {
    //   addGraphic(i);
    // });
  });

  (from).forEach(async i => {
    addGraphic(i);
  });
}
