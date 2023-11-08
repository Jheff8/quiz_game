<template>
  <the-header ref="header"></the-header>
  <main ref="mainElement" class="padding-top">
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </main>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'
import CreateQuiz from './components/pages/CreateQuiz'
export default {
  components: {
    TheHeader,
    CreateQuiz
  },
  data() {
    return {
      showHeader: false
    }
  },
  mounted() {
    this.showHeader = this.$store.getters.isHeaderVisible
    this.$store.dispatch('loadQuizzes')
    this.$store.dispatch('loadQuestions')
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

:root {
  --text-color: rgb(231, 246, 254, .7);
  --secondary-text-color: rgb(255, 255, 255, .6);
  --primary-color: #4558BA;
  --secondary-color: #1A1A19;
  --accent-color: #f6d013;
  --background-color: #1b1b1b;
  --secondary-background-color: rgb(30, 30, 35);
}

.text-color {
  color: var(--text-color) !important
}

.padding-top {
  padding-top: 3rem !important;
}

.secondary-text-color {
  color: var(--secondary-text-color) !important;
}

.background-bg {
  background-color: var(--background-color);
}

.background-secondary-bg {
  background-color: var(--secondary-background-color);
}

.primary-bg {
  background-color: var(--primary-color);
}

.primary-color {
  color: var(--primary-color);
}

.secondary-bg {
  background-color: var(--secondary-color);
}

.secondary-color {
  color: var(--secondary-color);
}

.accent-bg {
  background-color: var(--accent-color)
}

.accent-color {
  color: var(--accent-color) !important;
}

.accent-border {
  border-color: var(--accent-color) !important;
}

body {
  max-width: 100vw;
  min-height: 100vh;
  background-color: var(--background-color);
  font-family: Poppins, sans-serif !important;
}

section {
  height: calc(100vh - 58px);
  padding-top: 30px;
}

h1 {
  font-size: 51.96px !important;
  line-height: .95;
  font-weight: 700 !important;
  letter-spacing: -1px !important;
}

p,
span,
a,
router-link {
  font-size: 20px !important;
  line-height: 1.4 !important;
}

h2 {
  font-size: 41.05px !important;
  font-weight: 600 !important;
  letter-spacing: -1px !important;
}


.router-enter-from {
  opacity: 0;
}

.route-leave-to {
  opacity: 0;
}

.route-enter-active {
  transition: all .5s ease-out;
}

.route-leave-active {
  transition: all .5s ease-out;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;

}

@keyframes fade {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (max-width: 400px) {
  h1 {
    font-size: 39.06px !important;
  }

  h2 {
    font-size: 35.25px !important;
  }

  p,
  span,
  a,
  router-link {
    font-size: 16px !important;
  }
}

@media (min-width: 769px) {

  input,
  textarea {
    font-size: 18px !important;
  }

  h1 {
    font-size: 56.09px !important;
  }

  h2 {
    font-size: 48.83px !important;
  }

  label {
    font-size: 18px !important;
  }
}

@media (min-width: 1440px) and (min-height: 1200px) {
  h1 {
    font-size: 105.29px !important;
  }

  h2 {
    font-size: 81.29px !important;
  }

  p,
  span,
  a,
  router-link,
  label {
    font-size: 39.06px !important;
  }

  .padding-top {
    padding-top: 5rem !important;
  }

  input,
  textarea {
    padding: 1.5rem 1.5rem !important;
    border-radius: 12px !important;
    border-width: 2px !important;
    font-size: 36.06px !important;
  }
}</style>

