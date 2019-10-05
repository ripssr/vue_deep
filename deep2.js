const Record = {
  template: '#record-template',
  props: ['ds'],
  data () {
    return {
      firstname: '',
      lastname: '',
    }
  },
  created () {
    this.record = this.ds.record.getRecord('test/johndoe')

    this.record.subscribe(values => {
      this.firstname = values.firstname
      this.lastname = values.lastname
    })
  },
  methods: {
    handleFirstNameUpdate () {
      this.record.set('firstname', this.firstname)
    },
    handleLastNameUpdate () {
      this.record.set('lastname', this.lastname)
    }
  }
}

const Events = {
  template: '#events-template',
  props: ['ds'],
  data () {
    return {
      eventsReceived: [],
      value: '',
    };
  },
  created () {
    this.event = this.ds.event;
    this.event.subscribe('test-event', value => {
      this.eventsReceived.push(value)
    })
  },
  methods: {
    handleClick () {
      this.event.emit('test-event', this.value)
    }
  }
}

const RPC = {
  template: '#rpc-template',
  props: ['ds'],
  data () {
    return {
      responseValue: '7',
      requestValue: '3',
      displayResponse: '-'
    }
  },
  created () {
    this.rpc = this.ds.rpc;
    this.rpc.provide('multiply-number', (data, response) => {
      response.send(data.value * parseFloat(this.responseValue))
    })
  },
  methods: {
    handleClick () {
      const data = {
        value: parseFloat(this.requestValue)
      }

      this.rpc.make('multiply-number', data, (err, resp) => {
        this.displayResponse = resp || err.toString()
      })
    }
  }
}

new Vue({
  el: '#app',
  components: {
    'my-record': Record,
    'my-events': Events,
    'my-rpc': RPC
  },
  data: {
    connectionState: 'INITIAL'
  },
  created () {
    this.ds = deepstream('wss://154.deepstreamhub.com?apiKey=97a397bd-ccd2-498f-a520-aacc9f67373c')
      .login()
      .on('connectionStateChanged', connectionState => {
        this.$data.connectionState =  connectionState
      })
  }
})