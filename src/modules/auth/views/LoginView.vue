<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field v-model="username" label="Логин" required></v-text-field>
      <v-text-field v-model="password" label="Пароль" type="password" required></v-text-field>
      <v-btn type="submit" color="primary">Войти</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    // Simulate an API call to get the token
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await response.json()
    authStore.setAccessToken(data)
    router.push('/')
  } catch (error) {
    alert('Неверный логин или пароль')
  }
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
