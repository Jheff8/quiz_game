<template>
    <section ref="section">
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
                    v-for="(answers, index) in getAnswers" :key="index" type="button" :ref="`answerElements${index}`"
                    @click="toggleAnswerSelection(index)" :class="{ 'active': answers.isUserAnswer }">
                    {{ answers.text }}
                </button>
            </div>
            <base-button class="mt-5 mb-4" @click="processSelectedAnswer" id="mainButton" ref="baseButton">{{ loadButtonText
            }}</base-button>
        </div>
    </section>
</template>
<script>
export default {
    props: ['id'],
    data() {
        return {
            questions: null,
            currentQuestion: null,
            questionIndex: 1,
            answers: [],
            userPontuation: 0,
            isDialogVisible: false,
            dialogTitle: '',
            dialogSecondaryText: '',
            dialogCloseButtonText: '',
            dialogContinueButtonText: '',
            dialogTitleColor: '',
            isSecondaryButtonVisible: false,
            formatedQuizName: null
        }
    },
    watch: {
        questionIndex(value) {
            this.currentQuestion = this.questions[value]
        }
    },
    
        
    created() {
        this.formatedQuizName = this.id.toLowerCase().replaceAll(' ', '')
        if (!sessionStorage.getItem(`${this.formatedQuizName}QuestionIndex`)) {
            sessionStorage.setItem(`${this.formatedQuizName}QuestionIndex`, JSON.stringify(this.questionIndex))
        }
        const storedQuestions = this.$store.getters.questions
        if (storedQuestions) {
            this.questions = storedQuestions[this.id]
            this.currentQuestion = this.questions[this.questionIndex]
            sessionStorage.setItem(`${this.formatedQuizName}CurrentQuestion`, JSON.stringify(this.currentQuestion))
        }

        if (sessionStorage.getItem(`${this.formatedQuizName}Pontuation`)) {
            this.userPontuation = JSON.parse(sessionStorage.getItem(`${this.formatedQuizName}Pontuation`))
        } else {
            sessionStorage.setItem(`${this.formatedQuizName}Pontuation`, JSON.stringify(this.userPontuation))
        }
    },
    mounted() {
        this.$store.commit('showHeader', true)
        this.questionIndex = JSON.parse(sessionStorage.getItem(`${this.formatedQuizName}QuestionIndex`))
        this.userPontuation = JSON.parse(sessionStorage.getItem(`${this.formatedQuizName}Pontuation`))
        this.setSectionHeight()
    },
    methods: {
        nexQuestion() {
            if (this.questionIndex < 15) {
                this.questionIndex = Number(this.questionIndex) + 1
                this.currentQuestion = this.questions[this.questionIndex]
                sessionStorage.setItem(`${this.formatedQuizName}QuestionIndex`, JSON.stringify(this.questionIndex))
                sessionStorage.setItem(`${this.formatedQuizName}CurrentQuestion`, JSON.stringify(this.currentQuestion))
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
        toggleAnswerSelection(index) {
            this.answers.forEach((answer, i) => {
                answer.isUserAnswer = i === index ? !answer.isUserAnswer : false;
            })
        },
        processSelectedAnswer() {
            if (this.isMainButtonUnclickable()) {
                return
            }
            this.setButtonAndAnswersState(true)
            const userAnswer = this.answers.find(answer => answer.isUserAnswer)
            if (!userAnswer) {
                this.dialogTitle = 'Please, select an answer to proceed.'
                this.dialogSecondaryText = ''
                this.dialogTitleColor = ''
                this.dialogCloseButtonText = 'Close'
                this.isSecondaryButtonVisible = false
                this.isDialogVisible = true

                this.setButtonAndAnswersState(false)
                return
            }

            if (userAnswer.isCorrectAnswer) {
                this.addPoints()
            } else {
                this.highlightWrongAnswer()
            }

            this.highlightCorrectAnswer()
            setTimeout(() => {
                this.setButtonAndAnswersState(false)
                this.resetAnswerStyles()
                this.nexQuestion()
            }, 500);
        },
        highlightWrongAnswer() {
            for (let i = 0; i < this.answers.length; i++) {
                if (this.$refs[`answerElements${i}`][0].classList.contains('active')) {
                    const element = this.$refs[`answerElements${i}`][0]
                    element.classList.add('wrong-answer-styling')
                }
            }
        },
        resetAnswerStyles() {
            this.answers = this.answers.map((answer) => answer.isUserAnswer = false)

            for (let i = 0; i < this.answers.length; i++) {
                const element = this.$refs[`answerElements${i}`][0]
                element.classList.remove('wrong-answer-styling', 'correct-answer-styling')
            }
        },
        /** Toggle the state of the main button and answer buttons based on the provided boolean argument.
         * 
         * @param {boolean} shouldDisable - A boolean flag indicating whether to disable or enable the buttons.
         */
        setButtonAndAnswersState(shouldDisable) {
            const mainButton = this.$refs.baseButton.$refs.button
            !!shouldDisable ? mainButton.classList.add('unclickable') : mainButton.classList.remove('unclickable')

            for (let i = 0; i < this.answers.length; i++) {
                const element = this.$refs[`answerElements${i}`][0]
                element.disabled = !!shouldDisable
            }
        },
        highlightCorrectAnswer() {
            const correctAnswerIndex = this.answers.findIndex(answer => answer.isCorrectAnswer)
            if (correctAnswerIndex !== -1) {
                const element = this.$refs[`answerElements${correctAnswerIndex}`][0]
                element.classList.add('correct-answer-styling')
            }
        },
        isMainButtonUnclickable() {
            return this.$refs.baseButton.$refs.button.classList.contains('unclickable')
        },
        addPoints() {
            this.userPontuation = Number(this.userPontuation) + 1
            sessionStorage.setItem(`${this.formatedQuizName}Pontuation`, JSON.stringify(this.userPontuation))
        },
        closeOrHome() {
            this.closeDialog()
            if (this.dialogCloseButtonText.toLowerCase() != 'close') {
                localStorage.setItem(`${this.formatedQuizName}AchievedPoints`, JSON.stringify(this.userPontuation))
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
            sessionStorage.removeItem(`${this.formatedQuizName}QuestionIndex`)
            sessionStorage.setItem(`${this.formatedQuizName}Pontuation`, JSON.stringify(this.userPontuation))
        },
        playAgain() {
            setTimeout(() => {
                this.resetQuiz()
                this.closeDialog()
            }, 500)
        },
        setSectionHeight() {
            const section = this.$refs.section
            section.style.minHeight = `calc(${window.innerHeight}px - 6rem)`
        }
    },
    computed: {
        getQuestion() {
            return this.currentQuestion.question
        },
        getAnswers() {
            let listOfAnswers = []
            listOfAnswers.push({ text: this.currentQuestion.correctAnswer, isUserAnswer: false, isCorrectAnswer: true })
            for (let c in this.currentQuestion.wrongAnswers) {
                listOfAnswers.push({ text: this.currentQuestion.wrongAnswers[c], isUserAnswer: false, isCorrectAnswer: false })
            }
            listOfAnswers = this.shuffleArray(listOfAnswers)
            this.answers = listOfAnswers
            return this.answers
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