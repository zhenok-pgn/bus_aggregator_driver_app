<template>
  <v-container>
    <TripCard :trip-id-param="tripIdParam" @started="handleTripStart">Информация о рейсе</TripCard>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TripCard from '../components/TripCard.vue'

export default defineComponent({
  components: { TripCard },
  props: {
    tripIdParam: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleTripStart(tripId: string) {
      this.$router.push(`/trips/${tripId}/tracking`)
    },
  },
})
</script>
