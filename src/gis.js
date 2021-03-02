import { createApp } from 'vue'
import Gis from './Gis.vue'
import axios from 'axios';
import VueAxios from 'vue-axios';

createApp(Gis).use(VueAxios, axios).mount('#gis')