<template>
  <v-container>
    <!--<v-card v-if="nextTrip" :to="{ name: 'trip-details', params: { tripIdParam: nextTrip.id } }">
      <v-card-title>
        <span class="text-h5">Предстоящий рейс</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <strong>Название рейса:</strong> {{ nextTrip.route.name }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Время отправления:</strong> {{ nextTrip.schedule.departureTime }}
          </v-col>
          <v-col cols="12" sm="6"> <strong>Дата:</strong> {{ nextTrip.departureDate }} </v-col>
          <v-col cols="12" sm="6">
            <strong>Место отправления:</strong> {{ nextTrip.schedule.routeSegment.from.address }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Место назначения:</strong> {{ nextTrip.schedule.routeSegment.to.address }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-alert v-else-if="!loadingStore.loading" type="info"> Ближайших рейсов не найдено. </v-alert>-->
    <TripCard v-if="nextTrip" :trip-id-param="nextTrip.id" @started="handleTripStart"
      >Ближайший рейс</TripCard
    >
    <v-alert v-else-if="!loadingStore.loading" type="info"> Ближайшего рейса не найдено. </v-alert>
  </v-container>
</template>

<script lang="ts">
import { tripsApi } from '@/modules/trips/api/tripsApi'
import type { ITrip } from '@/modules/trips/interfaces/trip'
import { useLoadingStore } from '@/stores/loadingStore'
import TripCard from '@/modules/trips/components/TripCard.vue'

export default {
  components: { TripCard },
  data() {
    return {
      trips: null as null | ITrip[],
      loadingStore: useLoadingStore(),
    }
  },
  computed: {
    nextTrip() {
      if (!this.trips || this.trips.length === 0) return null
      const now = new Date()
      const tripsWithDate = this.trips.map((trip) => {
        const [hours, minutes] = trip.schedule.departureTime.split(':').map(Number)
        const tripDate = new Date(trip.departureDate)
        tripDate.setHours(hours, minutes, 0, 0)
        return { ...trip, tripDate }
      })
      console.log('Trips with date:', tripsWithDate)
      // Сортируем по разнице во времени
      const upcomingTrips = tripsWithDate
        .filter((trip) => trip.tripDate > now)
        .sort((a, b) => a.tripDate.getTime() - b.tripDate.getTime())
      console.log('Upcoming trips:', upcomingTrips)
      return upcomingTrips.length > 0 ? upcomingTrips[0] : null
    },
  },
  async mounted() {
    this.trips = (await tripsApi.getMyTrips()).data
  },
  methods: {
    handleTripStart(tripId: string) {
      this.$router.push(`/trips/${tripId}/tracking`)
    },
  },
}
</script>
