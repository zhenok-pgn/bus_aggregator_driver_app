<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Профиль водителя</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6"><strong>Фамилия:</strong> {{ driver.lastName }}</v-col>
          <v-col cols="12" sm="6"><strong>Имя:</strong> {{ driver.firstName }}</v-col>
          <v-col cols="12" sm="6"><strong>Отчество:</strong> {{ driver.middleName }}</v-col>
          <v-col cols="12" sm="6"><strong>Табельный номер:</strong> {{ driver.staffNumber }}</v-col>
          <v-col cols="12" sm="6"
            ><strong>Вод. удостоверение:</strong> {{ driver.licenseNumber }}</v-col
          >
          <v-col cols="12" sm="6"><strong>Дата рождения:</strong> {{ driver.birthDate }}</v-col>
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
        lastName: 'Иванов',
        firstName: 'Иван',
        middleName: 'Иванович',
        staffNumber: '12345',
        licenseNumber: '7700999888',
        birthDate: '1980-01-15',
      },
    }
  },
  methods: {
    logout() {
      // Логика выхода из системы
      this.$router.push('/login')
    },
  },
}
</script>
