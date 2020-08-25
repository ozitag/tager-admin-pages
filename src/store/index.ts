import Vuex from 'vuex';
import { Nullable } from '@tager/admin-services';

import { PagesModuleConfigType } from '../typings/model';

type State = {
  config: Nullable<PagesModuleConfigType>;
};

const store = new Vuex.Store<State>({
  state: {
    config: null,
  },
  mutations: {
    updateConfig(state, payload: PagesModuleConfigType) {
      state.config = payload;
    },
  },
  actions: {
    loadModuleConfig(context) {
      // this._vm;
    },
  },
});

export default store;
