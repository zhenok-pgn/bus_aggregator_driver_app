<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>АвтоBus Водитель</v-toolbar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Главная" @click="navigate('/')"></v-list-item>
      <v-list-item
        prepend-icon="	mdi-timetable"
        title="Рейсы"
        @click="navigate('/trips')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account"
        title="Профиль"
        @click="navigate('/profile')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <v-container>
      <v-row class="ma-3">
        <!-- Кнопка "Назад" -->
        <v-col cols="auto">
          <v-btn v-if="backButton" @click="handleBackClick">
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

      <!-- Диалог подтверждения -->
      <v-dialog v-model="showConfirmDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">Подтверждение</v-card-title>
          <v-card-text
            >Вы действительно хотите выйти? Несохранённые данные могут быть потеряны.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showConfirmDialog = false">Отмена</v-btn>
            <v-btn color="primary" text @click="confirmBack">Выйти</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { headerButtonType, type IHeaderButton } from '@/interfaces/headerButton'
import { useTrackingStore } from '@/modules/trips/stores/tracking'

const drawer = ref(false)
const showConfirmDialog = ref(false)
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

// Обработка клика по кнопке "Назад"
const handleBackClick = () => {
  if (backButton.value.needDialog) {
    showConfirmDialog.value = true
  } else {
    router.push(backButton.value.to)
  }
}

// Подтверждение выхода
const confirmBack = () => {
  showConfirmDialog.value = false
  router.push(backButton.value.to)
}

onMounted(() => {
  const trackingStore = useTrackingStore()

  if (trackingStore.tracking && trackingStore.tripId) {
    trackingStore.startTracking(trackingStore.tripId)
  }
})
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
