import FullScreen from './components/FullScreen.vue';
import App from './App.vue';

export const routes = [
  {
    path: '/fullscreen', components: {
      default: FullScreen,
      'fullscreen': FullScreen
    }
  },
  {
    path: '/', redirect: '/fullscreen'
  },
  { path: '*', redirect: '/' }
];
