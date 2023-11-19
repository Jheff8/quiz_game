<template>
    <section>
        <base-button :outline="true" @click="fetchQuizzes()">Refresh</base-button>
        <div class="row justify-content-center align-items-center m-auto gap-3">
            <base-component v-if="!isLoadingContent" v-for="quiz in loadQuizzes" :key="quiz.name" :name="quiz.name"
                :description="quiz.description" :imageName="quiz.imageName" :imagePosition="quiz.imagePosition">
            </base-component>
            <div v-else class="justify-content-center spinner-wrapper d-flex align-items-center">
                <base-spinner></base-spinner>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    data() {
        return {
            quizzes: null,
        }
    },
    mounted() {
        this.fetchQuizzes()
        this.$store.commit('showHeader', true)
    },
    computed: {
        loadQuizzes() {
            return this.$store.getters.quizzesList
        },
        isLoadingContent() {
            return this.$store.getters.isOnLoad
        }
    },
    methods: {
        async fetchQuizzes() {
            this.$store.commit('updateLoadingValue', true)
            try {
                await this.$store.dispatch('loadQuizzes')
                await this.$store.dispatch('loadQuestions')
            } catch {
                console.error('Something went wrong')
            }
            this.$store.commit('updateLoadingValue', false)
        }
    },
}

</script>
<style scoped>
section {
    max-width: 100vw;
}

.row {
    width: 95vw !important;
    margin-top: 1.5rem !important;
}

button {
    padding: .4rem 0 !important;
    width: 100px !important;
    margin: unset !important;
    margin-left: 1.5rem !important;
}

div.spinner-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

@media (min-width: 1440px) and (min-height: 1100px) {
    button {
        width: 150px !important;
    }
}
</style>