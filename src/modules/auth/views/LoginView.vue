<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-0 pa-sm-4 mx-auto" max-width="500" elevation="2">
          <v-card-title class="text-h6 px-auto d-flex align-center justify-space-between">
            <span class="text-h6 font-weight-medium"> Вход </span>
          </v-card-title>

          <!-- Форма -->
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="username" label="Логин" required />
              <v-text-field v-model="password" label="Пароль" type="password" required />
              <v-btn type="submit" color="primary" class="mt-4" block> Войти </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth'

const username = ref(null)
const password = ref(null)
const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  router.push('/') // Возврат на предыдущую страницу
}

const login = async () => {
  if (!username.value || !password.value) {
    return // Проверка на пустые поля
  }

  authStore.login(username.value, password.value).then(() => {
    goBack()
  })
}
</script>
