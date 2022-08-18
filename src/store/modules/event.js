import EventService from '@/services/EventService.js'
// Actions, Mutations and Getters are always registered under the golbal namespace (aka . the root which is $store) evnwhen using Modules.
// No matter where they're declared, they're called without their module name.
// this.$store.dispatch('someAction')
// this.$store.getters.filteredList
// We can have multiple Actions/Mutations using the same name. But we can then ended in naming collision.


// All Mutations, Actions and Getters will be namespaced under 'event'.
export const namespaced = true

export const state = {

	events: [],
	eventsTotal: 0,
	event: {}
	// Mutations are synchronous, so we cannot run asynchronous operations such as API calls inside them.
	// This is the "pick up of the bread."
	// Always put them within Actions.
	// Set the data into state.
}
export const mutations = {
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
}
	// Actions are asynchronous.
	// Can wrap business logic around Mutations. Do not always commit their Mutations.
	// This is "asking for picking up the bread".
export const actions = {
	createEvent({ commit, dispatch }, event) {
	//We want to send the event to the mocked db.
		return EventService.postEvent(event).then(() => {
			commit('ADD_EVENT', event)
			const notification = {
				type: 'success',
				message: 'Your event has been created.'
			}
			dispatch('notification/add', notification, { root: true })
	  })
			.catch(error => {
				const notification = {
					type: 'error',
					message: 'There was a problem with creating your event:' + error.message
				}
				dispatch('notification/add', notification, { root: true })
				throw error
			})
		},
	// The payload (perPage, page in this example) in both Actions and Mutations can be a single variable OR an object.
	// In this example it is object with two properties so we need to use curly brackets.
	fetchEvents({ commit, dispatch }, { perPage, page }) {
		EventService.getEvents(perPage, page)
			.then(response => {
			commit(
					'SET_EVENTS_TOTAL',
					parseInt(response.headers['x-total-count'])
			)
			commit('SET_EVENTS', response.data)
			})
			.catch(error => {
				const notification = {
					type: 'error',
					message: 'There was a problem fetching events:' + error.message
				}
				//'notification/add' is the module/action, 'notification' is the object and '{ root: true } allows the dispatcher
				// to go to the root state'
				dispatch('notification/add', notification, { root: true })
			})
	},
	// Acces our getters.
	fetchEvent({ commit, getters, dispatch }, id) {
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
					const notification = {
						type: 'error',
						message: 'There was a problem fetching event:' + error.message
					}
					dispatch('notification/add', notification, { root: true })
				})
			}
		}
}
export const	getters = {
			getEventById: state => id => {
			return state.events.find(event => event.id === id)
			}
	}
