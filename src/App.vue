<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
const visible = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

//устранение мерцания загрузки
watch(
  () => loadingStore.loading,
  (newVal) => {
    if (newVal) {
      // Показываем сразу
      if (hideTimeout) clearTimeout(hideTimeout)
      visible.value = true
    } else {
      // Скрываем с задержкой
      hideTimeout = setTimeout(() => {
        visible.value = false
      }, 300) // 300 мс
    }
  },
  { immediate: true },
)
</script>

<template>
  <v-app>
    <v-overlay :model-value="visible" persistent class="align-center justify-center">
      <v-progress-circular indeterminate size="64" width="6" color="primary" />
    </v-overlay>
    <RouterView />
  </v-app>
</template>
