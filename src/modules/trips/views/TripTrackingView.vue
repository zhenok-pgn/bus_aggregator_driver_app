<template>
  <!-- Заголовок карточки рейса -->
  <v-card elevation="2" class="mb-4">
    <v-card-item>
      <v-card-title class="text-h6 text-truncate">
        Рейс #{{ tripExecution?.trip.id }}: {{ tripExecution?.trip.route.name }}
      </v-card-title>
      <v-card-subtitle class="text-caption">
        {{ formatDate(tripExecution?.trip.departureDate) }} •
        {{ tripExecution?.trip.schedule.departureTime }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-chip size="small" :color="statusColor" variant="flat" class="mb-2">
        {{ currentStatus }}
      </v-chip>
      <div v-if="activeStop">
        <div class="text-body-2">
          Текущая остановка: <strong>{{ activeStop.name }}</strong>
        </div>
        <div class="text-caption">
          {{
            `${activeStop.isFirst ? activeStop.plannedDeparture : activeStop.isLast ? activeStop.plannedArrival : activeStop.plannedArrival + ' – ' + activeStop.plannedDeparture}`
          }}
        </div>
      </div>
    </v-card-text>
  </v-card>

  <!-- Список остановок -->
  <v-expansion-panels v-model="expandedStop" elevation="0" density="compact">
    <template v-for="(stop, index) in stops" :key="`stop-${stop.id}-${index}`">
      <!-- Прошедшие остановки -->
      <v-expansion-panel v-if="index < currentStopIndex!" :disabled="true">
        <v-expansion-panel-title>
          <v-icon
            start
            :icon="extendedStopsInfo[index].stopIcon"
            :color="extendedStopsInfo[index].stopColor"
          />
          <div>
            <div class="text-body-2">{{ stop.name }}</div>
            <div class="text-caption">
              Приб: {{ stop.actualArrival || stop.plannedArrival }}, Отпр:
              {{ stop.actualDeparture || stop.plannedDeparture }}
            </div>
          </div>
        </v-expansion-panel-title>
      </v-expansion-panel>

      <!-- Текущая остановка -->
      <v-expansion-panel v-else-if="index === currentStopIndex">
        <v-expansion-panel-title>
          <v-icon
            start
            :icon="extendedStopsInfo[index].stopIcon"
            :color="extendedStopsInfo[index].stopColor"
          />
          <div>
            <div class="text-body-2">{{ stop.name }}</div>
            <div class="text-caption">
              План:
              {{
                `${stop.isFirst ? stop.plannedDeparture : stop.isLast ? stop.plannedArrival : stop.plannedArrival + ' – ' + stop.plannedDeparture}`
              }}
              <span v-if="stop.actualArrival"> | Факт: {{ stop.actualArrival }}</span>
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense class="pa-1" align="center">
            <v-col cols="auto">
              <v-btn
                size="small"
                variant="outlined"
                :color="extendedStopsInfo[index].stopActionColor"
                @click.stop="handleStopActionTestWithPauses"
                :disabled="!extendedStopsInfo[index].canPerformAction"
              >
                {{ stopActionText(stop) }}
              </v-btn>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-btn size="small" variant="text" color="warning" @click="reportProblem(stop)">
                <v-icon start icon="mdi-alert-circle-outline" />
                Проблема
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Будущие остановки -->
      <v-expansion-panel v-else :disabled="true">
        <v-expansion-panel-title>
          <v-icon
            start
            :icon="extendedStopsInfo[index].stopIcon"
            :color="extendedStopsInfo[index].stopColor"
          />
          <div>
            <div class="text-body-2">{{ stop.name }}</div>
            <div class="text-caption">
              {{
                `${stop.isLast ? stop.plannedArrival : stop.plannedArrival + ' – ' + stop.plannedDeparture}`
              }}
            </div>
          </div>
        </v-expansion-panel-title>
      </v-expansion-panel>
    </template>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import {
  TripStatusColor,
  TripStatusLocale,
  type IStop,
  type ITripExecution,
} from '../interfaces/trip'
import { tripsApi } from '../api/tripsApi'
import { useTrackingStore } from '../stores/tracking'
import { busLocationApi } from '../api/busLocationApi'
import type { IBusLocation } from '../interfaces/busLocation'

export default defineComponent({
  props: {
    tripIdParam: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    tripExecution: null as ITripExecution | null,
    /*stops: [] as {
      stop: IStop
      stopIcon: string
      stopColor: string
      stopActionColor: string
      stopActionText: string
      canPerformAction: boolean
    }[],*/
    stops: [] as IStop[],
    currentStopIndex: null as number | null,
    expandedStop: 0,
    trackingStore: useTrackingStore(),
  }),

  computed: {
    activeStop(): IStop | null {
      return this.stops[this.currentStopIndex!] ?? null
    },
    currentStatus(): string {
      if (!this.tripExecution) return 'Загрузка...'
      const status = this.tripExecution.trip.tripStatus
      return TripStatusLocale[status]
    },
    statusColor(): string {
      if (!this.tripExecution) return 'Загрузка...'
      const status = this.tripExecution.trip.tripStatus
      return TripStatusColor[status]
    },
    extendedStopsInfo() {
      const extended = this.stops.map((s, index) => {
        return {
          stop: s,
          stopIcon: this.stopIcon(index),
          stopColor: this.stopColor(index),
          stopActionColor: this.stopActionColor(s),
          stopActionText: this.stopActionText(s),
          canPerformAction: this.canPerformAction(s),
        }
      })
      console.log(extended)
      return extended
    },
  },

  methods: {
    async loadTripData() {
      try {
        const response = await tripsApi.getTripExecutionInfo(this.tripIdParam)
        this.tripExecution = response.data
        this.currentStopIndex = null
        this.processStops()
        console.log(this.stops)
      } catch (error) {
        console.error('Ошибка при загрузке данных рейса:', error)
        this.$router.push('/trips')
      }
    },

    processStops() {
      if (!this.tripExecution?.segmentExecutions?.length) return

      this.stops = this.tripExecution.segmentExecutions.flatMap((seg, i, arr) => {
        if (this.currentStopIndex === null) {
          if (seg.status === 'InProgress') this.currentStopIndex = i + 1
          if (seg.status === 'Planned') this.currentStopIndex = i
          this.expandedStop =
            this.currentStopIndex != null
              ? this.currentStopIndex
              : this.tripExecution!.segmentExecutions.length + 1
        }
        const isLast = i === arr.length - 1
        const baseStop = {
          id: `stop_${seg.segment.routeSegment.to.id}`,
          name: seg.segment.routeSegment.to.name,
          segmentId: seg.segment.id,
          isFirst: false,
          isLast,
          status: seg.status,
          plannedArrival: seg.segment.arrivalTime,
          actualArrival: seg.arrival,
          plannedDeparture: isLast ? null : arr[i + 1].segment.departureTime,
          actualDeparture: isLast ? null : arr[i + 1].departure,
        }

        return i === 0
          ? [
              {
                ...baseStop,
                id: `stop_${seg.segment.routeSegment.from.id}`,
                name: seg.segment.routeSegment.from.name,
                isFirst: true,
                isLast: false,
                plannedArrival: null,
                actualArrival: null,
                plannedDeparture: seg.segment.departureTime,
                actualDeparture: seg.departure,
              },
              baseStop,
            ]
          : [baseStop]
      })
    },

    stopIcon(stopIndex: number): string {
      if (stopIndex < this.currentStopIndex!) {
        return 'mdi-check-circle-outline'
      } else if (stopIndex === this.currentStopIndex) {
        return 'mdi-bus'
      } else {
        return 'mdi-clock-outline'
      }
    },

    stopColor(stopIndex: number): string {
      if (stopIndex < this.currentStopIndex!) {
        return 'green'
      } else if (stopIndex === this.currentStopIndex) {
        return 'primary'
      } else {
        return 'grey'
      }
    },

    stopActionColor(stop: IStop): string {
      return !stop.isFirst && !stop.actualArrival
        ? 'primary'
        : !stop.actualDeparture && !stop.isLast
          ? 'success'
          : 'grey'
    },

    stopActionText(stop: IStop): string {
      return !stop.isFirst && !stop.actualArrival
        ? 'Подтвердить прибытие'
        : !stop.actualDeparture && !stop.isLast
          ? 'Подтвердить отправление'
          : 'Завершено'
    },

    canPerformAction(stop: IStop): boolean {
      return (!stop.isFirst && !stop.actualArrival) || (!stop.actualDeparture && !stop.isLast)
    },

    // Тестовая функция для имитации остановок
    async handleStopActionTest() {
      const res = await fetch('/bus_route.json')
      const data = await res.json()
      console.log('Данные маршрута:', data)

      let stopsCount = 0
      const segmentIds = this.tripExecution!.segmentExecutions.map((seg) => seg.segment.id)
      for (let i = 1; i < data.length; i++) {
        if (data[i].is_stop && data[i].event === 'departure') {
          const segmentId = segmentIds[stopsCount]
          const timestamp = DateTime.fromISO(data[i].timestamp).toUTC()
          console.log(`Остановка, Время отправления: ${data[i].timestamp}`, segmentId)
          await tripsApi.confirmDeparture(this.tripExecution!.trip.id, segmentId, timestamp)
        } else if (data[i].is_stop && data[i].event === 'arrival') {
          const segmentId = segmentIds[stopsCount]
          const timestamp = DateTime.fromISO(data[i].timestamp).toUTC()
          console.log(`Остановка, Время прибытия: ${data[i].timestamp}`, segmentId)
          await tripsApi.confirmArrival(this.tripExecution!.trip.id, segmentId, timestamp)
          stopsCount++
        } else {
          console.log(`Маршрут, Время: ${data[i].timestamp}`)
          const busLocation: IBusLocation = {
            latitude: data[i].lat,
            longitude: data[i].lon,
            timestamp: data[i].timestamp,
            tripId: this.tripExecution!.trip.id,
          }
          await busLocationApi.updateLocation(busLocation)
        }

        // Задержка
        //await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    },

    async handleStopActionTestWithPauses() {
      const res = await fetch('/bus_route_85(delay_in_start).json')
      const data = await res.json()
      console.log('Данные маршрута:', data)

      // Чтение индекса из localStorage
      const currentIndex = Number(localStorage.getItem('routeProgressIndex') || '1')
      let stopsCount = Number(localStorage.getItem('stopsCount') || '0')

      const segmentIds = this.tripExecution!.segmentExecutions.map((seg) => seg.segment.id)

      for (let i = currentIndex; i < data.length; i++) {
        const entry = data[i]

        if (entry.is_stop && entry.event === 'departure') {
          const segmentId = segmentIds[stopsCount]
          const timestamp = DateTime.fromISO(entry.timestamp).toUTC()
          console.log(`Остановка, Время отправления: ${entry.timestamp}`, segmentId)
          await tripsApi.confirmDeparture(this.tripExecution!.trip.id, segmentId, timestamp)
          await this.loadTripData() // обновление данных поездки
        }
        if (entry.is_stop && entry.event === 'arrival') {
          const segmentId = segmentIds[stopsCount]
          const timestamp = DateTime.fromISO(entry.timestamp).toUTC()
          console.log(`Остановка, Время прибытия: ${entry.timestamp}`, segmentId)
          await tripsApi.confirmArrival(this.tripExecution!.trip.id, segmentId, timestamp)
          stopsCount++
          localStorage.setItem('stopsCount', stopsCount.toString())
          await this.loadTripData()
          localStorage.setItem('routeProgressIndex', (i + 1).toString())
          return
        }

        console.log(`Маршрут, Время: ${entry.timestamp}`)
        const busLocation: IBusLocation = {
          latitude: entry.lat,
          longitude: entry.lon,
          timestamp: entry.timestamp,
          tripId: this.tripExecution!.trip.id,
        }
        await busLocationApi.updateLocation(busLocation)

        // Запоминаем текущий индекс перед переходом к следующему шагу
        localStorage.setItem('routeProgressIndex', (i + 1).toString())

        // Задержка, если нужно имитировать интервал
        // await new Promise((resolve) => setTimeout(resolve, 3000))
      }

      console.log('Маршрут полностью пройден')
      localStorage.removeItem('routeProgressIndex')
      localStorage.removeItem('stopsCount')
    },

    handleStopAction(index: number) {
      if (this.stops[index].isFirst && !this.stops[index].actualDeparture) {
        this.confirmDeparture(this.stops[index])
      } else if (!this.stops[index].isFirst && !this.stops[index].actualArrival) {
        this.confirmArrival(this.stops[index])
      } else if (!this.stops[index].actualDeparture && !this.stops[index].isLast) {
        this.confirmDeparture(this.stops[index + 1])
      }
    },

    confirmArrival(stop: IStop) {
      const timestamp = DateTime.utc()
      tripsApi
        .confirmArrival(this.tripExecution!.trip.id, stop.segmentId, timestamp)
        .then(() => {
          this.trackingStore.stopTracking()
          stop.actualArrival = timestamp.toFormat('HH:mm')
          if (stop.isLast) {
            this.tripExecution!.trip.tripStatus = 'Finished'
          }
        })
        .catch((error) => {
          console.error('Ошибка при подтверждении прибытия:', error)
          alert('Не удалось подтвердить прибытие. Попробуйте позже.')
        })
    },

    confirmDeparture(stop: IStop) {
      const timestamp = DateTime.utc()
      tripsApi
        .confirmDeparture(this.tripExecution!.trip.id, stop.segmentId, timestamp)
        .then(() => {
          this.trackingStore.startTracking(this.tripExecution!.trip.id)
          stop.actualDeparture = timestamp.toFormat('HH:mm')
          this.tripExecution!.trip.tripStatus = 'InProgress'
          if (this.currentStopIndex! < this.stops.length) {
            this.currentStopIndex!++
            this.expandedStop = this.currentStopIndex!
          }
        })
        .catch((error) => {
          console.error('Ошибка при подтверждении отправления:', error)
          alert('Не удалось подтвердить отправление. Попробуйте позже.')
        })
    },

    reportProblem(stop: IStop) {
      alert(`Проблема на остановке ${stop.name} зарегистрирована!`)
    },

    formatDate(date?: string): string {
      return date ? DateTime.fromISO(date).toFormat('dd.MM.yyyy') : ''
    },
  },

  async mounted() {
    localStorage.setItem('routeProgressIndex', '1')
    localStorage.setItem('stopsCount', '0')

    await this.loadTripData()
  },
})
</script>
