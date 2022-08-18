import Vue from 'vue'
import Vuex from 'vuex'
// Import all public items into user namespace.
import * as user from '@/store/modules/user.js'
import * as event from '@/store/modules/event.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)
// Great article https://medium.com/dailyjs/mastering-vuex-zero-to-hero-e0ca1f421d45

export default new Vuex.Store({
  // Use this module 'user'.
  modules: {
    user,
    event,
    notification
  },
  state: {
    categories: ['sustainability', 'nature', 'animal welfare', 'housing', 'education', 'food', 'community'],
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
      { id: 3, text: '...', done: true },
      { id: 4, text: '...', done: false }
    ]
  }
  })
