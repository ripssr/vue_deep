'use strict';


const store = new Vuex.Store({
  state: {
    deepStream: null,
    connectionState: 'INITIAL',
    firstName: '',
    lastName: '',
    record: null
  },
  mutations: {
    initRecord: state => (state.record = state.ds.record.getRecord('test/johndoe')) &&
      state.record.subscibe(values => {
        state.firstName = values.firstname,
        state.lastName = values.lastname
      }),
    setDs: state => state.deepStream = 
      deepstream('wss://154.deepstreamhub.com?apiKey=97a397bd-ccd2-498f-a520-aacc9f67373c')
        .login()
          .on('connectionStateChange', connectionState => {
            state.connectionState = connectionState;
          }),
    setFirstName: (state, value) => (state.firstName = value) &&
      state.record.set('firstname', value),
    setLastName: (state, value) => (state.lastName = value) &&
      state.record.set('lastname', value),
  },
  actions: {
    initRecord: ({commit}) => commit('initRecord'),
    setDs: ({commit}) => commit('setDs'),
    setName: ({commit}, value, name) => name &&
      commit('setFirstName', value) || commit('setLastName', value),
  }
});


const component1 = {
  props: ['ds'],
  computed: Vuex.mapState({
    firstName: state => state.firstName,
    lastName: state => state.lastName,
    record: state => state.record
  }),
  created() {
    this.$store.dispatch('initRecord');
  },
  methods: Vuex.mapActions([
    'setName'
  ]),
  template: `
    <div class="group realtimedb">
      <h2>Realtime Datastore</h2>
      <div class="input-group half left">
        <label>Firstname</label>
        <input
          type="text"
          @input="setName($event.target.value, true)"
          :value="firstName" />
      </div>
      <div class="input-group half">
        <label>Lastname</label>
        <input type="text"
          @input="setName($event.target.value)"
          :value="lastName" />
      </div>
    </div>
  `
};


const component2 = {
  template: `
    <div>
    </div>
  `
};


const component3 = {
  template: `
    <div>
    </div>
  `
};


const app = new Vue({
  el: '#app',
  store,
  components: {
    'deepRecord': component1,
    'deepEvents': component2,
    'deepRpc': component3
  },
  created () {
    this.$store.dispatch('setDs');
  }, 
  computed: Vuex.mapState({
    ds: state => state.deepStream,
    connectionState: state => state.connectionState
  }),
  template: `
    <div id="app">
      <div class="group connectionState">
        Connection-State is: 
        <em id="connection-state">{{ connectionState }}</em>
      </div>
      <deepRecord :ds="ds" />
      <deepEvents :ds="ds" />
      <deepRpc :ds="ds" />
    </div>
  `
});
