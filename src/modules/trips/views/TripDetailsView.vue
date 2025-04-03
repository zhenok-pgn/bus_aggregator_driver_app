<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Информация о рейсе</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6"> <strong>Название рейса:</strong> {{ trip.name }} </v-col>
          <v-col cols="12" sm="6"> <strong>Время отправления:</strong> {{ trip.time }} </v-col>
          <v-col cols="12" sm="6"> <strong>Дата:</strong> {{ trip.date }} </v-col>
          <v-col cols="12" sm="6"> <strong>Место отправления:</strong> {{ trip.departure }} </v-col>
          <v-col cols="12" sm="6">
            <strong>Место назначения:</strong> {{ trip.destination }}
          </v-col>
          <v-col cols="12">
            <strong>Описание:</strong>
            <p>{{ trip.description }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="goBack">Назад</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  props: {
    tripIdParam: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      trip: {
        name: 'Рейс 1',
        time: '10:00',
        date: '2025-04-03',
        departure: 'Москва',
        destination: 'Санкт-Петербург',
        description: 'Это описание рейса, включая детали маршрута и дополнительные сведения.',
      },
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1) // Возвращает пользователя на предыдущую страницу
    },
  },
}
</script>

<style scoped></style>
