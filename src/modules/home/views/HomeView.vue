<template>
  <v-container>
    <v-card v-if="nextTrip" :to="{ name: 'trip-details', params: { tripIdParam: 1 } }">
      <v-card-title>
        <span class="text-h5">Предстоящий рейс</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6"> <strong>Название рейса:</strong> {{ nextTrip.name }} </v-col>
          <v-col cols="12" sm="6"> <strong>Время отправления:</strong> {{ nextTrip.time }} </v-col>
          <v-col cols="12" sm="6"> <strong>Дата:</strong> {{ nextTrip.date }} </v-col>
          <v-col cols="12" sm="6">
            <strong>Место отправления:</strong> {{ nextTrip.departure }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Место назначения:</strong> {{ nextTrip.destination }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-alert v-else type="info"> Ближайших рейсов не найдено. </v-alert>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      trips: [
        {
          name: 'Рейс 1',
          time: '10:00',
          date: '2025-04-03',
          departure: 'Москва',
          destination: 'Санкт-Петербург',
        },
        {
          name: 'Рейс 2',
          time: '12:00',
          date: '2025-04-03',
          departure: 'Москва',
          destination: 'Казань',
        },
        {
          name: 'Рейс 3',
          time: '14:00',
          date: '2025-04-04',
          departure: 'Москва',
          destination: 'Сочи',
        },
      ],
    }
  },
  computed: {
    nextTrip() {
      const now = new Date()
      const tripsWithDate = this.trips.map((trip) => {
        const [hours, minutes] = trip.time.split(':').map(Number)
        const tripDate = new Date(trip.date)
        tripDate.setHours(hours, minutes, 0, 0)
        return { ...trip, tripDate }
      })

      const upcomingTrips = tripsWithDate.filter((trip) => trip.tripDate > now)

      upcomingTrips.sort((a, b) => a.tripDate - b.tripDate)

      return upcomingTrips.length > 0 ? upcomingTrips[0] : null
    },
  },
}
</script>
