import Vue from "vue";

export class ArrayObserver<T>{

  private _watchers: Array<ObservableArrayChanged<T>> = []
  private _deep: boolean = false;
  private _deepObserver: Vue = new Vue();

  constructor(arr: T[], deep: boolean) {

    this._deep = deep;
    var obj = arr as any;
    if (obj.__isObserved) return;

    var observer = this;
    obj.__isObserved = true;
    // redefine functions
    obj._push = arr.push;
    obj._pop = arr.pop;
    obj._shift = arr.shift;
    obj._unshift = arr.unshift;
    obj._splice = arr.splice;

    arr.push = function (items) {
      obj._push(items);

      let _items: any[] = items instanceof Array ? items : [items];
      if (_items && deep)
        _items.forEach(e => observer.deepWatch(e));
      observer.notify("push", _items, null);
      return arr.length;
    }

    arr.pop = function () {
      let result = obj._pop();
      observer.unWatch(result);
      observer.notify("pop", null, [result]);
      return result;
    }

    arr.shift = function () {
      let result = obj._shift();
      observer.unWatch(result);
      observer.notify("shift", null, [result]);
      return result;
    }

    arr.unshift = function (items) {
      obj._unshift(items);
      observer.notify("unshift", items instanceof Array ? items : [items], null);
      return arr.length;
    }

    arr.splice = function (start: number, deletecount?: number, ...items) {
      let toadd = items instanceof Array ? items : [items];

      let deleted = null;
      if (toadd.length > 0)
        deleted = obj._splice(start, deletecount, toadd);
      else
        deleted = obj._splice(start, deletecount);

      deleted = deleted instanceof Array ? deleted : [deleted];

      deleted.forEach(e => observer.unWatch(e));

      let _items = items instanceof Array ? items : [items];
      if (_items && deep)
        _items.forEach(e => observer.deepWatch(e));
      observer.notify("splice", _items, deleted);
      return deleted;
    }

    if (deep)
      arr.forEach(element => observer.deepWatch(element));
    observer.notify("init", arr, null);
  }

  private unWatch(object) {
    if (object.__unwatch) object.__unwatch();
  }

  private deepWatch(object) {
    var observer = this;
    if (object)
      object.__unwatch = this._deepObserver.$watch(() => object, (n, o) => { observer.notify("changed", [n], [o]) }, { deep: false });
  }

  private notify(operation: string, inserted: T[], deleted: T[]) {
    this._watchers.forEach(w => {
      w(operation, inserted, deleted);
    });
  }

  public Subscribe(watcher: ObservableArrayChanged<T>): Function {
    this._watchers.push(watcher);
    return () => this.UnSubscribe(watcher);
  }

  public UnSubscribe(watcher: ObservableArrayChanged<T>) {
    var idx = this._watchers.indexOf(watcher);
    this._watchers.splice(idx, 1);
  }
}

export interface ObservableArrayChanged<T> { (operation: string, inserted: T[], deleted: T[]) }
