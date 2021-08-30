<template>
  <q-page class="flex flex-center">
    <div class="text-center" v-if="widgets.length===0">
      <h3>
        You have no widgets yet :(
      </h3>
      <h4>
        Quickly, add one ...
      </h4>
      <q-btn color="primary" size="35px" :icon="biPlusSquare" @click="addWidget"/>
    </div>
  </q-page>
</template>

<script>
import { biPlusSquare } from '@quasar/extras/bootstrap-icons'
export default {
  name: 'widgetList',

  data: () => {
    return {
      widgets: []
    }
  },

  methods: {
    addWidget: function() {
      this.widgets.push(window.windowAPI.newWidget())
    }
  },

  computed: {
    biPlusSquare: () => biPlusSquare
  }
}
</script>

<style>
</style>
