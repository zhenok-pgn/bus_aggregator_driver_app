<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Bus Carrier</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-home" title="Главная" @click="navigate('/')"></v-list-item>
        <v-list-item prepend-icon="" title="Рейсы" @click="navigate('/trips')"></v-list-item>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="" title="Транспорт"></v-list-item>
          </template>
          <v-list-item prepend-icon="" title="Автобусы" @click="navigate('/buses')"></v-list-item>
          <v-list-item prepend-icon="" title="Водители" @click="navigate('/drivers')"></v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="" title="Настройки"></v-list-item>
          </template>
          <v-list-item prepend-icon="" title="Профиль" @click="navigate('/profile')"></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-row class="ma-3">
        <!-- Кнопка "Назад" -->
        <v-col cols="auto">
          <v-btn v-if="backButton" :to="backButton.to">
            <v-icon>mdi-arrow-left</v-icon>
            {{ backButton.name }}
          </v-btn>
        </v-col>
        <!-- Заголовок страницы -->
        <v-col cols="auto">
          <h2>{{ $route.meta.pageHeader }}</h2>
        </v-col>
        <!-- Группа дополнительных кнопок -->
        <v-col v-if="headerButtons" cols="auto">
          <v-btn v-for="button in headerButtons" :key="button.name" :to="button.to" class="ml-2">
            <v-icon v-if="button.type === headerButtonType.add">mdi-plus</v-icon>
            <v-icon v-else-if="button.type === headerButtonType.edit">mdi-pencil</v-icon>
            {{ button.name }}
          </v-btn>
        </v-col>
      </v-row>
      <v-divider thickness="2" color="primary"></v-divider>

      <RouterView :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { headerButtonType, type IHeaderButton } from '@/interfaces/headerButton'

const drawer = ref(false)
const router = useRouter()
const backButton = computed(
  () => (router.currentRoute.value.meta.backButton as IHeaderButton) ?? null,
)
const headerButtons = computed(
  () => (router.currentRoute.value.meta.headerButtons as IHeaderButton[]) ?? null,
)
const navigate = (route: string) => {
  router.push(route)
  drawer.value = false
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
