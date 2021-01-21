import { Loader } from "./esriUtils"

export class Support {
  Actions: Actions = new Actions();
}

export class Actions {
  public async ActionButton(options?: any): Promise<__esri.ActionButton> {
    return (await Loader.create<__esri.ActionButton>(Loader.packageName + "/support/actions/ActionButton", options));
  }

  public async ActionButtonConstructor(): Promise<__esri.ActionButtonConstructor> {
    return (await Loader.get(Loader.packageName + "/support/actions/ActionButton"));
  }

  public async ActionToggle(options?: any): Promise<__esri.ActionToggle> {
    return (await Loader.create<__esri.ActionToggle>(Loader.packageName + "/support/actions/ActionToggle", options));
  }

  public async ActionToggleConstructor(): Promise<__esri.ActionToggleConstructor> {
    return (await Loader.get(Loader.packageName + "/support/actions/ActionToggle"));
  }
}