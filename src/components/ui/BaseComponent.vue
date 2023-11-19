<template >
    <div class="container mt-4 mt-lg-6 mb-4 mb-lg-5">
        <base-dialog :isDialogOpen="isDialogVisible" :title="`Your last score was ${lastScore} `" :titleColor="titleColor"
            :secondaryText="`${percentageOfHits}% of the questions were answered correctly.`"
            :continueBtnText="continueButtonText" :showSecondaryButton="true" @continue="startQuiz" @close="closeDialog">
        </base-dialog>
        <div :class="['image-block']"
            :style="{ backgroundImage: `url(${require(`../../assets/${imageName}`)})`, backgroundPosition: imagePosition }">
        </div>
        <h2 class="mt-3 mb-0 lead">{{ name }}</h2>
        <p class="lead text-color mt-2">{{ description }}</p>
        <div class="row justify-content-center align-items-center mt-0 mt-lg-3">
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
            isStillPlaying: false,
            formatedQuizName: null
        }
    },
    created() {
        this.formatedQuizName = this.name.toLowerCase().replaceAll(' ', '')
    },
    mounted() {
        if (localStorage.getItem(`${this.formatedQuizName}AchievedPoints`)) {
            this.hasPastScore = true
            this.lastScore = Number(JSON.parse(localStorage.getItem(`${this.formatedQuizName}AchievedPoints`)))
            this.percentageOfHits = Math.round((Number(this.lastScore) / 15) * 100)
        }
        if (sessionStorage.getItem(`${this.formatedQuizName}QuestionIndex`)) {
            this.isStillPlaying = true
        }
    },
    methods: {
        async startQuiz() {
            this.$store.commit('updateLoadingValue', true)
            await this.$router.replace(`/quiz/${this.name.toLowerCase()}`)
            this.$store.commit('updateLoadingValue', false)
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
    width: 320px;
    max-width: 85vw;
    background-color: var(--secondary-background-color);
    border-radius: 15px;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px;
    overflow: hidden;
}

h2 {
    padding: 0 1rem;
    margin: auto;
    max-width: 320px;
    font-weight: 700 !important;
    line-height: 1;
    letter-spacing: 0.78px;
    text-align: left;
    hyphens: auto;
    color: var(--primary-color);
}

p {
    display: block;
    padding: 0 1rem;
    margin: 0;
    margin: auto;
    width: 310px;
    max-width: 310px !important;
    min-height: 60px;
    max-height: 60px;
    overflow-wrap: break-word;
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
    height: 260px;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: inset 0 0px 12px -7px;
}

@media (max-width: 400px) {
    .container {
        padding-bottom: 1.5rem !important;
        width: 270px !important;
    }

    div.image-block {
        height: 225px !important;
    }

    button {
        max-width: 65% !important;
    }

    div.container {
        max-width: 80vw !important;
    }
}

@media (min-width: 400px) and (max-width: 450px) {
    div.image-block {
        height: 270px !important;
    }

    div.container {
        max-width: 75vw !important;
    }
}

@media (min-width: 1025px) {
    div.image-block {
        height: 280px;
    }
}

@media (min-width: 1440px) and (min-height: 1100px) {
    div.image-block {
        height: 440px;
    }

    .row {
        max-width: 90vw !important;
    }

    div.container {
        width: 500px;
    }

    h2,
    p {
        margin: unset;
        padding: 0 2.5rem !important;
    }

    h2 {
        max-width: 500px !important;
    }

    p {
        width: 490px !important;
        max-width: 490px !important;
    }

    button:first-child {
        margin-top: 2.5rem !important;
    }

    button {
        margin-top: 1.5rem !important;
    }

}
</style>