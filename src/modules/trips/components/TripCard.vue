<template>
  <v-container>
    <v-card v-if="trip" class="pa-4">
      <v-card-title class="text-h6">
        <slot>Информация о рейсе</slot>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <strong>Название маршрута:</strong><br />
            {{ trip.route.name }}
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Дата отправления:</strong><br />
            {{ trip.departureDate }}
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Время отправления:</strong><br />
            {{ trip.schedule.departureTime }}
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Место отправления:</strong><br />
            {{ formatAddress(trip.schedule.routeSegment.from.address) }}
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Место назначения:</strong><br />
            {{ formatAddress(trip.schedule.routeSegment.to.address) }}
          </v-col>

          <v-col cols="12" sm="6">
            <strong>Автобус:</strong><br />
            {{ `${trip.bus.model} (${trip.bus.stateNumber})` }}
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="my-2" />

      <v-card-actions>
        <v-row align="center" class="w-100">
          <v-col cols="12" sm="auto">
            <v-btn color="primary" block :disabled="!canStartTrip" @click="startTrip">
              Начать поездку
            </v-btn>
          </v-col>
          <v-col cols="12" sm>
            <v-alert v-if="timeStatusMessage" :type="timeStatusType" dense outlined>
              {{ timeStatusMessage }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { th } from 'vuetify/locale'
import { tripsApi } from '../api/tripsApi'
import { TripStatusLocale, type ITrip } from '../interfaces/trip'
import { DateTime, Duration } from 'luxon'

export default {
  props: {
    tripIdParam: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      trip: null as null | ITrip,
      now: DateTime.now(),
      timeUpdateInterval: null as null | number,
      MINUTES_BEFORE_DEPARTURE: 500000,
    }
  },
  computed: {
    departureDateTime() {
      if (!this.trip) return null
      return DateTime.fromFormat(
        `${this.trip.departureDate} ${this.trip.schedule.departureTime}`,
        'yyyy-MM-dd HH:mm',
      )
    },
    timeUntilDeparture() {
      if (!this.departureDateTime) return null
      return this.departureDateTime.diff(this.now)
    },
    canStartTrip() {
      /*if (!this.timeUntilDeparture) return false
      const minutesUntil = this.timeUntilDeparture.as('minutes')
      return minutesUntil <= this.MINUTES_BEFORE_DEPARTURE && minutesUntil > 0*/
      return true
    },
    timeStatusMessage() {
      if (this.trip && this.trip.tripStatus !== 'Scheduled')
        return TripStatusLocale[this.trip.tripStatus]

      if (!this.departureDateTime) return ''

      const minutes = this.timeUntilDeparture?.as('minutes') || 0

      if (minutes > this.MINUTES_BEFORE_DEPARTURE) {
        const diff = this.timeUntilDeparture.minus({ minutes: this.MINUTES_BEFORE_DEPARTURE })
        return `Поездку можно будет начать через ${this.formatDuration(diff)}`
      } else if (minutes <= 0) {
        return 'Отправление рейса не состоялось'
      } else {
        return 'Можно начать поездку'
      }
    },
    timeStatusType() {
      if (this.trip && this.trip.tripStatus !== 'Scheduled') {
        const status = this.trip.tripStatus
        if (status === 'Cancelled') return 'error'
        if (status === 'InProgress') return 'warning'
        if (status === 'Finished') return 'success'
      }

      if (!this.departureDateTime) return 'info'
      const minutes = Math.floor(this.timeUntilDeparture?.as('minutes') || 0)

      if (minutes > this.MINUTES_BEFORE_DEPARTURE) return 'info'
      if (minutes <= 0) return 'error'
      return 'success'
    },
  },
  methods: {
    startTrip() {
      this.$emit('started', this.tripIdParam)
    },
    updateCurrentTime() {
      this.now = DateTime.now()
    },
    formatDuration(duration: Duration): string {
      const totalMinutes = Math.floor(duration.as('minutes'))
      const days = Math.floor(totalMinutes / (60 * 24))
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
      const minutes = totalMinutes % 60

      const parts = []
      if (days > 0) parts.push(`${days} дн.`)
      if (hours > 0) parts.push(`${hours} ч.`)
      if (minutes > 0 || parts.length === 0) parts.push(`${minutes} мин.`)

      return parts.join(' ')
    },
    formatAddress(address: string): string {
      const parts = address.split(',').map((part) => part.trim())
      if (parts.length <= 3) return ''
      return parts.slice(0, -3).join(', ')
    },
  },
  async mounted() {
    this.trip = (await tripsApi.getTripById(this.tripIdParam)).data
    this.timeUpdateInterval = setInterval(this.updateCurrentTime, 60000)
  },
  beforeUnmount() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval)
  },
}
</script>
