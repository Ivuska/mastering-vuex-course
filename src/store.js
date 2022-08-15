import Vue from 'vue'
import Vuex from 'vuex'
import EventService from '@/services/EventService.js'

Vue.use(Vuex)
// Great article https://medium.com/dailyjs/mastering-vuex-zero-to-hero-e0ca1f421d45

export default new Vuex.Store({
  state: {
    user: { id: 'abc123', name: 'Adam Jahr' },
    categories: ['sustainability', 'nature', 'animal welfare', 'housing', 'education', 'food', 'community'],
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
      { id: 3, text: '...', done: true },
      { id: 4, text: '...', done: false }
    ],
    events: [],
    eventsTotal: 0,
    event: {}
  },
  // Mutations are synchronous, so we cannot run asynchronous operations such as API calls inside them.
  // This is the "pick up of the bread."
  // Always put them within Actions.
  // Set the data into state.
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event)
    },
    SET_EVENTS(state, events) {
      state.events = events
    },
    SET_EVENTS_TOTAL(state, eventsTotal) {
      state.eventsTotal = eventsTotal
    },
    SET_EVENT(state, event) {
      state.event = event
    }
  },
  // Actions are asynchronous.
  // Can wrap business logic around Mutations. Do not always commit their Mutations.
  // This is "asking for picking up the bread".
  actions: {
    createEvent({ commit }, event) {
      //We want to send the event to the mocked db.
      return EventService.postEvent(event).then(() => {
        commit('ADD_EVENT', event)
      })
    },
    // The payload (perPage, page in this example) in both Actions and Mutations can be a single variable OR an object.
    // In this example it is object with two properties so we need to use curly brackets.
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          commit(
            'SET_EVENTS_TOTAL',
            parseInt(response.headers['x-total-count'])
          )
          commit('SET_EVENTS', response.data)
        })
        .catch(error => {
          console.log('There was an error:', error.response)
        })
    },
    // Acces our getters.
    fetchEvent({ commit, getters }, id) {
      // Try to find this event.
      var event = getters.getEventById(id)

      // If we found, set it.
      if (event) {
        commit('SET_EVENT', event)
        // Else go fetch it.
      } else {
          EventService.getEvent(id)
        .then(response => {
          commit('SET_EVENT', response.data)
        })
        .catch(error => {
          console.log('There was an error:', error.response)
        })
      }
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id)
    }
  }
})
