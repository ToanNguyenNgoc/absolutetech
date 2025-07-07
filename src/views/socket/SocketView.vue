<template>
  <main class="login-page">
    <h1>SocketView</h1>
    <div>
      <input type="text" v-model="state.device_id" placeholder="Device id" />
      <button @click="onConnectSocket">Fetch data</button>
      <div>
        {{ state.response }}
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { baseURL } from '@/api/axios';
import axios from 'axios';

const state = reactive({
  device_id: '',
  response: ''
});

const socket = io(baseURL.replace('/api', ''), {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('✅ WebSocket connected');

  if (state.device_id) {
    socket.emit('sync_data_device', state.device_id);
    console.log('📤 Sent device_id:', state.device_id);
    socket.on(`sync_data_device_${state.device_id}`, (data) => {
      console.log(data)
      state.response = JSON.stringify(data);
    })
  }
});

socket.on('disconnect', () => {
  console.log('❌ WebSocket disconnected');
});


const onConnectSocket = () => {
  state.response = '';
  axios.post(`${baseURL}/synchronization/sync-json`, { device_id: state.device_id });
  if (!state.device_id) return alert('Vui lòng nhập device_id');
  if (!socket.connected) {
    socket.connect();
  } else {
    socket.emit('sync_data_device', state.device_id);
  }
};
</script>

<style scoped></style>
