<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-electron-drag">
      <q-bar>
        <!--q-btn dense flat round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        /-->

        <q-toolbar-title>
          {{ package.description }}
        </q-toolbar-title>

        <!-- q-btn dense flat icon="minimize" @click="minimize"/ -->
        <!-- q-btn dense flat icon="crop_square" @click="toggleMaximize"/ -->
        <q-btn dense flat :icon="biClose" @click="closeApp"/>
      </q-bar>
    </q-header>

    <!--q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon name="forum" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer-->

    <q-page-container>
      <widgetList />
    </q-page-container>
  </q-layout>
</template>

<script>
import { biXLg } from '@quasar/extras/bootstrap-icons'
import { ref } from 'vue'
import widgetList from './components/WidgetList.vue'

export default {
  name: 'LayoutDefault',

  components: {
    widgetList
  },

  computed: {
    package: () => window.package,
    biClose: () => biXLg
  },

  setup () {
    return {
      minimize: window.windowAPI.minimize,
      toggleMaximize: window.windowAPI.toggleMaximize,
      closeApp: window.windowAPI.close,
      leftDrawerOpen: ref(false)
    }
  }
}
</script>
