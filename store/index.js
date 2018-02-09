import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () => {
    return new Vuex.Store({
        state:{
            imageCDN: 'p2op7lrmc.bkt.clouddn.com/',
            user: null,
            users: [],
            problems: []
        },
        getters,
        actions,
        mutations
    })
};

export default createStore
