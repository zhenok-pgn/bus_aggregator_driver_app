<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="selectedDate"
          type="date"
          label="Выберите дату"
          density="comfortable"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" v-if="filteredTrips?.length">
        <v-card
          v-for="(trip, index) in filteredTrips"
          :key="index"
          class="mb-3"
          :to="{ name: 'trip-details', params: { tripIdParam: trip.id } }"
          hover
          color="blue-grey-lighten-5"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-subtitle-1 font-weight-medium">
              {{ trip.route.name }}
            </div>
          </v-card-title>

          <v-card-text>
            <div><strong>Дата:</strong> {{ trip.departureDate }}</div>
            <div><strong>Время отправления:</strong> {{ trip.schedule.departureTime }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" v-else-if="!loadingStore.loading">
        <v-alert type="info" border="start" variant="tonal" color="blue">
          Рейсы не найдены на выбранную дату.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useLoadingStore } from '@/stores/loadingStore'
import { tripsApi } from '../api/tripsApi'
import type { ITrip } from '../interfaces/trip'

export default {
  data() {
    return {
      selectedDate: null as string | null,
      trips: null as null | ITrip[],
      loadingStore: useLoadingStore(),
    }
  },
  computed: {
    filteredTrips(): ITrip[] | null {
      if (!this.trips) return null
      const today = new Date().toISOString().split('T')[0] // формат YYYY-MM-DD
      const actualTrips = this.trips.filter((trip) => trip.departureDate >= today)
      if (!this.selectedDate) return actualTrips
      return actualTrips.filter((trip) => trip.departureDate === this.selectedDate)
    },
  },
  async mounted() {
    this.trips = (await tripsApi.getMyTrips()).data
  },
}
</script>
