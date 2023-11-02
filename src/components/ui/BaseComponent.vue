<template >
    <div class="container mt-4 mt-lg-6 mb-4 mb-lg-5">
        <base-dialog :isDialogOpen="isDialogVisible" :title="`Your last score was ${lastScore} `" :titleColor="titleColor"
            :secondaryText="`${percentageOfHits}% of the questions were answered correctly.`"
            :continueBtnText="continueButtonText" :showSecondaryButton="true" @continue="startQuiz" @close="closeDialog">
        </base-dialog>
        <!-- <slot></slot> -->
        <div :class="['image-block']"
            :style="{ backgroundImage: `url(${require(`../../assets/${imageName}`)})`, backgroundPosition: imagePosition }">
        </div>
        <h1 class="mt-3 mb-0 lead">{{ name }}</h1>
        <span class="lead text-color mt-0">{{ description }}</span>
        <div class="row justify-content-center align-items-center mt-3">
            <base-button @click="startQuiz" class="col-auto">{{ mainButtonText }}</base-button>
            <base-button :disabled="!hasPastScore" :title="hasPastScore ? '' : 'You have no scores yet'"
                :secondaryButton="true" @click="showLastScore" class="col-auto">Last Score</base-button>
        </div>
    </div>
</template>
<script>
export default {
    props: ['name', 'description', 'imageName', 'imagePosition'],
    data() {
        return {
            hasPastScore: false,
            isDialogVisible: false,
            lastScore: null,
            percentageOfHits: null,
            isStillPlaying: false
        }
    },
    mounted() {
        if (localStorage.getItem(`${this.name.toLowerCase()}AchievedPoints`)) {
            this.hasPastScore = true
            this.lastScore = Number(JSON.parse(localStorage.getItem(`${this.name.toLowerCase()}AchievedPoints`)))
            this.percentageOfHits = Math.round((Number(this.lastScore) / 15) * 100)
        }
        if (sessionStorage.getItem(`${this.name.toLowerCase()}QuestionIndex`)) {
            this.isStillPlaying = true
        }
    },
    methods: {
        startQuiz() {
            this.$router.replace(`/quiz/${this.name.toLowerCase()}`)
        },
        showLastScore() {
            this.isDialogVisible = true
        },
        closeDialog() {
            this.isDialogVisible = false
        }
    },
    computed: {
        titleColor() {
            return this.percentageOfHits < 75 ? 'red' : 'green'
        },
        continueButtonText() {
            return this.isStillPlaying ? 'Continue Playing' : 'Play again'
        },
        mainButtonText() {
            return this.isStillPlaying ? 'Continue Playing' : this.hasPastScore ? 'Play again' : 'Start Quiz'
        }
    }
}
</script>

<style scoped>
div.container {
    padding: 0;
    padding-bottom: 2rem;
    margin: auto;
    width: 380px;
    max-width: 90vw;
    min-height: 593px;
    background-color: var(--secondary-background-color);
    border-radius: 15px;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px;
    overflow: hidden;
}

h1 {
    padding: 0 1rem;
    margin: auto;
    max-width: 380px;
    font-weight: 700;
    line-height: 1.2;
    font-size: 42.83px;
    letter-spacing: 0.78px;
    text-align: left;
    hyphens: auto;
    color: var(--primary-color);
}

span {
    display: block;
    padding: 0 1rem;
    margin: 0;
    margin: auto;
    max-width: 380px;
    min-height: 56px;
    max-height: 90px;
    font-weight: 400;
    font-size: 20px;
    line-height: 1.4;
    text-align: left;
    hyphens: auto;
}

button {
    margin-top: 1rem !important;
}

div.image-block {
    width: 100%;
    height: 360px;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: inset 0 0px 12px -7px;
}
</style>