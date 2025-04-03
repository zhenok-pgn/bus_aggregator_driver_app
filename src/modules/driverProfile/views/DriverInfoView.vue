<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Профиль водителя</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6"> <strong>Имя:</strong> {{ driver.name }} </v-col>
          <v-col cols="12" sm="6"> <strong>Возраст:</strong> {{ driver.age }} </v-col>
          <v-col cols="12" sm="6"> <strong>Стаж:</strong> {{ driver.experience }} лет </v-col>
          <v-col cols="12" sm="6"> <strong>Контактный номер:</strong> {{ driver.phone }} </v-col>
          <v-col cols="12">
            <strong>Описание:</strong>
            <p>{{ driver.description }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      driver: {
        name: 'Иван Иванов',
        age: 45,
        experience: 20,
        phone: '+7 900 123-45-67',
        description: 'Опытный водитель с многолетним стажем работы на дальних маршрутах.',
      },
    }
  },
  methods: {
    logout() {
      // Логика выхода из системы
      this.$router.push('/login') // Перенаправление на страницу входа
    },
  },
}
</script>
