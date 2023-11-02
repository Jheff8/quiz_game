<template>
  <the-header></the-header>
  <main>
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
  data(){
    return {
      showHeader: false
    }
  },
  mounted(){
    this.showHeader = this.$store.getters.isHeaderVisible
    this.$store.dispatch('loadQuizzes')
    this.$store.dispatch('loadQuestions')
  },
}
</script>

<style>
:root {
  --text-color: #e6f6fe;
  --secondary-text-color: rgb(255,255,255, .6);
  --primary-color: #4558BA;
  --secondary-color: #1A1A19;
  --accent-color: #f6d013;
  --background-color: #1b1b1b;
  --secondary-background-color:rgb(30, 30, 35);  
}

.text-color{
  color: var(--text-color) !important;
}

.secondary-text-color{
  color: var(--secondary-text-color) !important;
}

.background-bg{
  background-color: var(--background-color);
}
.background-secondary-bg{
  background-color: var(--secondary-background-color);
}

.primary-bg{
  background-color: var(--primary-color);
}
.primary-color{
  color: var(--primary-color);
}
.secondary-bg{
  background-color: var(--secondary-color);
}
.secondary-color{
  color: var(--secondary-color);
}
.accent-bg{
  background-color: var(--accent-color)
}
.accent-color{
  color: var(--accent-color) !important;
}
.accent-border{
  border-color: var(--accent-color) !important;
}

body {
  max-width: 100vw;
  min-height: 100vh;
  background-color: var(--background-color);
}
section{
  height: calc(100vh - 58px);
  padding-top: 30px;
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
@keyframes fade{
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>

