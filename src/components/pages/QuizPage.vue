<template>
    <section>
        <base-dialog :isDialogOpen="isDialogVisible" :title="dialogTitle" :secondaryText="dialogSecondaryText"
            :showSecondaryButton="isSecondaryButtonVisible" :continueBtnText="dialogContinueButtonText"
            :closeBtnText="dialogCloseButtonText" :titleColor="dialogTitleColor" @close="closeOrHome"
            @continue="playAgain"></base-dialog>
        <div class="row justify-content-center align-items-center m-auto my-4 d-block">
            <span class="text-center m-auto text-color mb-2 d-block">Question: {{ questionIndex }}/15</span>
            <div class="m-auto container question-container d-flex align-items-center mb-4">
                <p class="m-auto text-center text-colo lead">
                    {{ getQuestion }}
                </p>
            </div>
            <div class="answers-wrap row m-auto">
                <button class="container m-auto d-block mb-2 mb-lg-3  text-center text-color answer-containers lead"
                    v-for="answers in getAnswers" :key="answers" type="button" @click="activeButton($event)">
                    {{ answers }}
                </button>
            </div>
            <base-button class="mt-5 mb-4" @click="verifyAnswer">{{ loadButtonText }}</base-button>
        </div>
    </section>
</template>
<script>
export default {
    props: ['id'],
    data() {
        return {
            questions: null,
            questionsLength: null,
            currentQuestion: null,
            questionIndex: 1,
            answers: [],
            isAnswerRight: false,
            userPontuation: 0,
            isDialogVisible: false,
            dialogTitle: '',
            dialogSecondaryText: '',
            dialogCloseButtonText: '',
            dialogContinueButtonText: '',
            dialogTitleColor: '',
            isSecondaryButtonVisible: false
        }
    },
    watch: {
        questionIndex(value) {
            this.currentQuestion = this.questions[value]
        }
    },
    created() {
        if (!sessionStorage.getItem(`${this.id}QuestionIndex`)) {
            sessionStorage.setItem(`${this.id}QuestionIndex`, JSON.stringify(this.questionIndex))
        }
        const storedQuestions = this.$store.getters.questions
        if (storedQuestions) {
            this.questions = storedQuestions[this.id]
            this.currentQuestion = this.questions[this.questionIndex]
            sessionStorage.setItem(`${this.id}CurrentQuestion`, JSON.stringify(this.currentQuestion))
        }

        if (sessionStorage.getItem(`${this.id}Pontuation`)) {
            this.userPontuation = JSON.parse(sessionStorage.getItem(`${this.id}Pontuation`))
        } else {
            sessionStorage.setItem(`${this.id}Pontuation`, JSON.stringify(this.userPontuation))
        }
    },
    mounted() {
        this.$store.commit('showHeader', true)
        this.questionIndex = JSON.parse(sessionStorage.getItem(`${this.id}QuestionIndex`))
        this.userPontuation = JSON.parse(sessionStorage.getItem(`${this.id}Pontuation`))
        this.setSectionHeight()
    },
    methods: {
        nexQuestion() {
            if (this.questionIndex < 15) {
                this.questionIndex = Number(this.questionIndex) + 1
                this.currentQuestion = this.questions[this.questionIndex]
                sessionStorage.setItem(`${this.id}QuestionIndex`, JSON.stringify(this.questionIndex))
                sessionStorage.setItem(`${this.id}CurrentQuestion`, JSON.stringify(this.currentQuestion))
            } else {
                this.showResults()
            }
        },
        showResults() {
            this.isDialogVisible = true
            const percentageOfHits = Math.round((Number(this.userPontuation) / 15) * 100)
            this.dialogTitleColor = 'red'
            this.isSecondaryButtonVisible = true
            this.dialogCloseButtonText = 'Back to Home'
            this.dialogContinueButtonText = 'Try again'

            if (this.userPontuation == 0) {
                this.dialogTitle = 'Oops!'
                this.dialogSecondaryText = `You didn't get any of them right! But don't worry, you can try it again!!`

            } else if (percentageOfHits < 50) {
                this.dialogTitle = 'Needs Improvement'
                this.dialogSecondaryText = `You only got ${percentageOfHits}% right`

            } else if (percentageOfHits < 75) {
                this.dialogTitle = 'Not bad!'
                this.dialogSecondaryText = `You got ${percentageOfHits}% right`
                this.dialogContinueButtonText = 'Play Again'

            } else if (this.userPontuation < 15) {
                this.dialogTitle = 'Very good!'
                this.dialogTitleColor = 'green'
                this.dialogSecondaryText = `You did a great job! You got ${percentageOfHits}% right`
                this.dialogContinueButtonText = 'Play Again'

            } else {
                this.dialogTitle = 'Excelent!!'
                this.dialogTitleColor = 'green'
                this.dialogSecondaryText = `You nailed it! You got ${percentageOfHits}% right`
                this.dialogContinueButtonText = 'Play Again'
            }
        },
        shuffleArray(array) {
            let currentIndex = array.length, randomIndex
            while (currentIndex > 0) {
                // Pick a remaining element
                randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex--
                // And swap it with the current element
                [array[currentIndex], array[randomIndex]] =
                    [array[randomIndex], array[currentIndex]]
            }
            return array
        },
        activeButton(event) {
            const element = event.target, answerElements = document.querySelectorAll('.answer-containers')
            let updateValue = true

            if (element.classList.contains('active')) {
                updateValue = false
            }

            answerElements.forEach(currentElement => {
                currentElement.classList.remove('active')
            })

            if (updateValue) {
                element.classList.add('active')
            }
        },
        verifyAnswer() {
            const userAnswer = document.querySelector('.active') || false
            if (!userAnswer) {
                this.dialogTitle = 'Please, select an answer to proceed.'
                this.dialogSecondaryText = ''
                this.dialogTitleColor = ''
                this.dialogCloseButtonText = 'Close'
                this.isSecondaryButtonVisible = false
                this.isDialogVisible = true
                return
            }
            let correctAnswerElement
            const answerElements = document.querySelectorAll('.answer-containers')

            answerElements.forEach(element => {
                element.disabled = true
                if (element.innerText == this.currentQuestion.correctAnswer) {
                    correctAnswerElement = element
                }
            })
            if (userAnswer.innerText == this.currentQuestion.correctAnswer) {
                this.addPontuation()
            } else {
                userAnswer.classList.add('wrong-answer-styling')
            }
            correctAnswerElement.classList.add('correct-answer-styling')
            setTimeout(() => {
                answerElements.forEach(element => {
                    element.disabled = false
                })
                userAnswer.classList.remove('active')
                correctAnswerElement.classList.remove('correct-answer-styling')
                userAnswer.classList.remove('wrong-answer-styling')
                this.nexQuestion()
            }, 500);
        },
        addPontuation() {
            this.userPontuation = Number(this.userPontuation) + 1
            sessionStorage.setItem(`${this.id}Pontuation`, JSON.stringify(this.userPontuation))
        },
        closeOrHome() {
            this.closeDialog()
            if (this.dialogCloseButtonText.toLowerCase() != 'close') {
                localStorage.setItem(`${this.id}AchievedPoints`, JSON.stringify(this.userPontuation))
                this.resetQuiz()
                this.$router.replace('/home')
            }
        },
        closeDialog() {
            this.isDialogVisible = false
        },
        resetQuiz() {
            this.userPontuation = 0
            this.questionIndex = 1
            sessionStorage.removeItem(`${this.id}QuestionIndex`)
            sessionStorage.setItem(`${this.id}Pontuation`, JSON.stringify(this.userPontuation))
        },
        playAgain() {
            setTimeout(() => {
                this.resetQuiz()
                this.closeDialog()
            }, 500)
        },
        setSectionHeight() {
            const section = document.querySelector('section')
            section.style.minHeight = `calc(${window.innerHeight}px - 6rem)`
        }
    },
    computed: {
        getQuestion() {
            return this.currentQuestion.question
        },
        getAnswers() {
            let listOfAnswers = []
            listOfAnswers.push(this.currentQuestion.correctAnswer)

            for (let c in this.currentQuestion.wrongAnswers) {
                listOfAnswers.push(this.currentQuestion.wrongAnswers[c])
            }
            listOfAnswers = this.shuffleArray(listOfAnswers)
            return listOfAnswers
        },
        loadButtonText() {
            return this.questionIndex < 15 ? 'Submit Answer' : 'Finish Quiz'
        }
    }
}
</script>
<style scoped>
:disabled {
    opacity: 1;
    color: inherit;
}

h1.lead {
    font-weight: 700;
    font-size: 3rem;
    text-transform: capitalize;
}

section {
    display: grid;
    place-items: center;
}

span {
    color: rgba(255, 255, 255, .6) !important;
    font-size: medium !important;
}

.row {
    width: 95vw !important;
    max-width: 1500px !important;
}

.container {
    background-color: var(--secondary-background-color);
    border: 1px solid rgb(255, 255, 255, .1);
    border-radius: 12px;
}

.question-container {
    position: relative;
    padding: 1.5rem;
    width: 1000px;
    max-width: 85vw;
    color: #fff !important;
    background-color: var(--primary-color);
}

.question-container p {
    font-weight: 500;
    font-size: 22px;
    line-height: 1.4;
    hyphens: auto;
}

.answer-containers {
    width: 800px;
    max-width: 80vw;
    font-size: 17px;
    font-weight: 400;
    padding: 1.5rem 0;
    transition: all .4s ease-out, scale .3s ease-out;
}

.answer-containers:focus-visible {
    outline: 1px solid var(--accent-color);
}

.answer-containers:hover,
.answer-containers:focus-visible {
    transform: scale(1.03) translateY(-2px);
}

.answer-containers:active {
    transform: scale(.85);
}

.active {
    color: #fff !important;
    background-color: var(--primary-color);
    outline: 3px solid var(--accent-color) !important;
}

button.correct-answer-styling {
    color: #fff !important;
    background-color: var(--bs-success) !important;
    outline: 2px solid var(--bs-success) !important;
}

button.wrong-answer-styling {
    color: #fff !important;
    background-color: var(--bs-danger) !important;
    outline: 2px solid var(--bs-danger) !important;
}

@media (hover: none) {
    .answer-containers:hover {
        transform: scale(none) translateY(0) !important;
    }
}

@media (max-width: 768px) {
    .question-container p {
        text-align: left !important;

    }
}

@media (min-width: 1440px) and (min-height: 1200px) {
    .question-container {
        padding: 3rem 2rem;
        width: 1800px;
    }

    .row {
        max-width: 1800px !important;
    }

    .container {
        border-radius: 16px;
    }

    .answer-containers {
        padding: 3rem 2rem;
        font-size: 42px;
        width: 1400px;
        margin-top: 1rem !important;
    }

    button {
        max-width: unset;
    }

    p {
        font-size: 52px !important;
    }

    span {
        font-size: xx-large !important;
    }
}
</style>