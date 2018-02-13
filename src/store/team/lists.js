import { firebaseMutations, firebaseAction } from "vuexfire"

export default {
  namespaced: true,

  state: {
    lists: [],
  },

  mutations: {
    setRef(state, ref) { state.ref = ref },
    ...firebaseMutations,
  },

  getters: {
    all(state) {
      return state.lists
    },
  },

  actions: {
    setRef: firebaseAction(({ bindFirebaseRef, commit }, ref) => {
      bindFirebaseRef("lists", ref)
      commit("setRef",  ref.ref)
    }),

    async saveItem({ state }, { list, item }) {
      if (item[".key"]) {
        const key = item[".key"]
        delete item[".key"]

        await state.ref.child(list[".key"]).child("items").child(key).update(item)
      } else {
        await state.ref.child(list[".key"]).child("items").push({
          title: item.title,
        })
      }
    },

    removeItem({ state }, { list, key } ) {
      state.ref.child(list[".key"]).child("items").child(key).remove()
    },

    save({ state }, list) {
      if (list[".key"]) {
        const key = list[".key"]
        delete list[".key"]

        state.ref.child(key).update(list)
      } else {
        state.ref.push({
          title: list.title || "",
          items: [],
        })
      }
    },

    remove({ state }, key) {
      state.ref.child(key).remove()
    },
  },
}
