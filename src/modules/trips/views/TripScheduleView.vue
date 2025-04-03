<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="selectedDate"
              label="Выберите дату"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="props"
            ></v-text-field>
          </template>
          <v-date-picker v-model="selectedDate" @input="menu = false"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item
            v-for="(trip, index) in filteredTrips"
            :key="index"
            :to="{ name: 'trip-details', params: { tripIdParam: index } }"
          >
            <v-list-item-title>{{ trip.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ trip.time }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      menu: false,
      selectedDate: null,
      trips: [
        { name: 'Рейс 1', time: '10:00', date: '2025-04-03' },
        { name: 'Рейс 2', time: '12:00', date: '2025-04-03' },
        { name: 'Рейс 3', time: '14:00', date: '2025-04-04' },
      ],
    }
  },
  computed: {
    filteredTrips() {
      if (!this.selectedDate) return this.trips
      return this.trips.filter((trip) => trip.date === this.selectedDate)
    },
  },
}
</script>

<style scoped></style>
