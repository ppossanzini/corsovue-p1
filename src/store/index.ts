import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface ApeStoreModel {
  ape: { [id: string]: server.Ape }
}

interface ApeStoreActions {
  SetApe(context, model: server.Ape[]);
}

interface ApeStoreGetters {
  ape: (state: ApeStoreModel) => () => server.Ape[];
}

const store = {
  state: {
    ape: {} as { [id: string]: server.Ape }
  },
  getters: {
    ape: (state: ApeStoreModel) => (): server.Ape[] => Object.values(state.ape)
  },
  mutations: {
    SET_APE(state: ApeStoreModel, model: server.Ape[]) {

      // if (model)
      //   state.ape.push(...model);

      if (model)
        for (const item of model) {
          // Object.freeze(item);
          Vue.set(state.ape, item.id, item);
          // state[item.id] = item;
        }
    }
  },
  actions: {
    SetApe(context, model: server.Ape[]) {
      context.commit("SET_APE", model);
    }
  },
  modules: {

  }
}

export const actions = store.actions //as ApeStoreActions;
export const getters = store.getters 
export default new Vuex.Store(store);

