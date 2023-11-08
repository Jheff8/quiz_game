<template>
    <section>
        <base-dialog :isDialogOpen="isDialogVisible" :title="dialogTitle" :secondaryText="secondaryText"
            :showSecondaryButton="isSecondaryButtonVisible" @continue="addQuestion(false)" @close="closeDialog">
        </base-dialog>
        <div class="row justify-content-center align-items-center m-auto my-4">
            <div class="container m-auto">
                <h1 class="lead primary-color text-center mb-0">Create Questions</h1>
                <div class="text-center text-color lead" style="margin-bottom: calc(1.5rem * 2) !important;">
                    <small>Question: {{ amountOfQuestion + 1 > 15 ? 15 : amountOfQuestion + 1 }}/15</small>
                </div>
                <form class="row">
                    <div class="col-12 col-sm-6 mb-4">
                        <label for="question"
                            :class="['form-label', { 'label-font-color': questionInputIsFocused }, { 'text-danger': !questionInput.isValid }]">Question</label>
                        <textarea id="question"
                            :class="['form-control', 'background-secondary-bg', { 'border-danger': !questionInput.isValid }, { 'text-color': questionInput.isValid }, { 'filled': questionInput.value !== '' }]"
                            rows="1" v-model="questionInput.value" @blur="clearValidity('questionInput')"
                            @focus="questionInputIsFocused = true" ref="questionInput"
                            placeholder="Type your question"></textarea>
                    </div>
                    <div class="col-12 col-sm-6">
                        <label for="correctAnswer"
                            :class="['form-label', { 'label-font-color': correctAnswerIsFocused }, { 'text-danger': !correctAnswer.isValid }]">Correct
                            Answer</label>
                        <input type="text" id="correctAnswer"
                            :class="['form-control', 'background-secondary-bg', { 'text-color': correctAnswer.isValid }, { 'filled': correctAnswer.value !== '' }, { 'border-danger': !correctAnswer.isValid }]"
                            v-model="correctAnswer.value" @blur="clearValidity('correctAnswer')"
                            @focus="correctAnswerIsFocused = true" placeholder="Type the correct answer"
                            ref="correctAnswerInput">
                    </div>
                    <div class="mt-4">
                        <label for="wrongAnswer"
                            :class="['form-label', 'secondary-text', { 'label-font-color': wrongAnswerIsFocused }, { 'text-danger': !wrongAnswer[1].isValid }]">Wrong
                            Answer(s):</label>
                        <input type="text"
                            :class="['form-control', 'wrongAnswer', 'mb-2', 'background-secondary-bg', 'text-color', { 'border-danger': !wrongAnswer[1].isValid }]"
                            id="wrongAnswer" placeholder="Wrong answer" v-model.trim="wrongAnswer[1].value"
                            @blur="clearValidity('wrongAnswer')" @focus="wrongAnswerIsFocused = true">

                        <transition>
                            <input type="text" class="form-control text-color background-secondary-bg mb-2 wrongAnswer"
                                id="wrongAnswer2" placeholder="Wrong answer" v-model.trim="wrongAnswer[2].value"
                                v-show="wrongAnswer[2].isVisible" @blur="clearValidity('wrongAnswer')"
                                @focus="wrongAnswerIsFocused = true">
                        </transition>
                        <transition>
                            <input type="text" class="form-control text-color background-secondary-bg mb-2 wrongAnswer"
                                id="wrongAnswer3" placeholder="Wrong answer" v-model.trim="wrongAnswer[3].value"
                                v-show="wrongAnswer[3].isVisible" @blur="clearValidity('wrongAnswer')"
                                @focus="wrongAnswerIsFocused = true">
                        </transition>
                        <transition>
                            <input type="text" class="form-control text-color background-secondary-bg wrongAnswer"
                                id="wrongAnswer4" placeholder="Wrong answer" v-model.trim="wrongAnswer[4].value"
                                v-show="wrongAnswer[4].isVisible" @blur="clearValidity('wrongAnswer')"
                                @focus="wrongAnswerIsFocused = true">
                        </transition>

                        <button class="mt-4 mb-0 btn d-block pointer m-auto addInput" type="button" @click="addNewInput"
                            v-if="!allInputsAreVisible">
                            <i class="bi bi-plus addAnswer"></i>
                        </button>
                    </div>
                    <span class="row justify-content-center align-items-center m-auto"
                        style="margin-top: calc(1.5rem * 2) !important;">
                        <base-button type="submit" @click.prevent="formValidity(false)" class="col-auto mb-2"
                            v-if="amountOfQuestion < 14">Next</base-button>
                        <base-button type="submit" class="col-auto" v-else @click.prevent="formValidity(true)">Create
                            Quiz</base-button>
                    </span>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    props: ['id'],
    data() {
        return {
            allQuestions: null,
            questionInput: { value: '', isValid: true },
            inputVisibility: null,
            correctAnswer: { value: '', isValid: true },
            wrongAnswer: {
                1: { value: '', isValid: true, isVisible: true },
                2: { value: '', isValid: true, isVisible: false },
                3: { value: '', isValid: true, isVisible: false },
                4: { value: '', isValid: true, isVisible: false }
            },
            isDialogVisible: false,
            dialogTitle: '',
            secondaryText: '',
            isSecondaryButtonVisible: false,
            correctAnswerIsFocused: false,
            questionInputIsFocused: false,
            wrongAnswerIsFocused: false
        }
    },
    beforeUnmount() {
        sessionStorage.removeItem('allQuestions')
        sessionStorage.removeItem('inputVisibility')
    },
    created() {
        this.allQuestions = JSON.parse(sessionStorage.getItem("allQuestions")) || []
        const allVisibleInput = JSON.parse(sessionStorage.getItem('inputVisibility')) || {}
        for (const key in allVisibleInput) {
            this.wrongAnswer[key].isVisible = allVisibleInput[key]

        }
    },
    mounted() {
        this.$store.commit('showHeader', true)

    },
    methods: {
        addQuestion(addToStore = false) {
            let answersList = []
            for (let i in this.wrongAnswer) {
                if (this.wrongAnswer[i].value) {
                    answersList.push(this.wrongAnswer[i].value)
                }
            }
            const obj = {
                question: this.questionInput.value,
                correctAnswer: this.correctAnswer.value,
                wrongAnswers: answersList
            }
            this.allQuestions.push(obj)
            sessionStorage.setItem('allQuestions', JSON.stringify(this.allQuestions))
            if (addToStore) {
                this.addToStore()
                return
            }
            this.closeDialog()
            this.clearInputs()
            this.$refs.questionInput.focus()
        },
        formValidity(addToStore = false) {
            let isFilled = false
            for (let i in this.wrongAnswer) {
                if (this.wrongAnswer[i].value !== '') {
                    isFilled = true
                }
            }
            if (this.questionInput.value == '' || this.correctAnswer.value == '' || !isFilled) {
                this.dialogTitle = 'You must fill the empty gaps to proceed.'
                this.secondaryText = ''
                this.isSecondaryButtonVisible = false
                this.isDialogVisible = true

                if (this.questionInput.value == '') {
                    this.questionInput.isValid = false
                }
                if (this.correctAnswer.value == '') {
                    this.correctAnswer.isValid = false
                }
                if (!isFilled) {
                    this.wrongAnswer[1].isValid = false
                }

                return
            }
            if (this.allQuestions.length == 0) {
                this.dialogTitle = 'Are you sure you want to continue ?'
                this.secondaryText = 'You will not be able to change it later.'
                this.isSecondaryButtonVisible = true
                this.isDialogVisible = true
                return
            }
            this.addQuestion(addToStore)
        },
        clearInputs() {
            this.correctAnswer.value = ''
            this.questionInput.value = ''

            for (let i in this.wrongAnswer) {
                this.wrongAnswer[i].value = ''
            }

            for (const key in this.wrongAnswer) {
                this.wrongAnswer[key].isVisible = false
            }
            sessionStorage.removeItem('inputVisibility')
        },
        addNewInput() {
            for (const key in this.wrongAnswer) {
                if (this.wrongAnswer[key].isVisible == false) {
                    this.wrongAnswer[key].isVisible = true
                    break
                }
            }
            let allVisibleInput = {}
            for (const key in this.wrongAnswer) {
                allVisibleInput[key] = this.wrongAnswer[key].isVisible
            }
            sessionStorage.setItem('inputVisibility', JSON.stringify(allVisibleInput))
        },
        addToStore() {
            let questions = {}
            for (let i in this.allQuestions) {
                questions[Number(i) + 1] = this.allQuestions[i]
            }
            const quizInfo = JSON.parse(sessionStorage.getItem('newQuizInformation'))
            this.$store.dispatch('registerQuiz', {
                name: quizInfo.name,
                description: quizInfo.description,
                imageName: quizInfo.imageName,
                imagePosition: quizInfo.imagePosition
            })

            this.$store.dispatch('registerQuestion', {
                name: quizInfo.name.toLowerCase(),
                data: questions
            })
            this.$router.replace('/home')
        },
        clearValidity(input) {
            if (this[input] == this.wrongAnswer) {
                for (const key in this.wrongAnswer) {
                    if (this.wrongAnswer[key].value !== '') {
                        this.wrongAnswer[1].isValid = true
                    }
                }
            } else {
                if (this[input].value !== '') {
                    this[input].isValid = true
                }
            }

            const focusedElementName = `${input}IsFocused`
            this[focusedElementName] = false
        },
        closeDialog() {
            this.dialogTitle = ''
            this.secondaryText = ''
            this.isSecondaryButtonVisible = false
            this.isDialogVisible = false
        },


    },
    computed: {
        allInputsAreVisible() {
            return Object.values(this.wrongAnswer).every(item => item.isVisible);
        },
        amountOfQuestion() {
            return this.allQuestions.length
        },

    }
}
</script>

<style scoped>
.container {
    padding: 2rem 1rem;
    width: 1000px;
    max-width: 90vw;
    background-color: var(--secondary-background-color);
    border: 1px solid rgb(255, 255, 255, .1);
    border-radius: 1rem;
}

section {
    display: grid;
    place-items: center;
    overflow-x: hidden;
    height: unset;
    min-height: 100vh;
}

div.row {
    width: 95vw !important;
    max-width: 1300px !important;
}

small {
    font-weight: 200;
    font-size: 16px;
}

.addAnswer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: auto;
    font-size: 2rem;
    color: rgb(255, 255, 255, .4);
    border: 1px solid rgb(255, 255, 255, .4);
    border-radius: 50%;
    transition: .5s ease-out;
}

.addAnswer:hover {
    scale: 1.09;
    border-color: var(--accent-color);
    color: var(--accent-color);
}

.addAnswer:active {
    scale: .85;
    border-color: var(--accent-color) !important;
}

button:has(.addAnswer):focus-visible {
    border: .8px solid var(--accent-color);
}

button:has(.addAnswer):focus-visible>.addAnswer {
    border-color: var(--accent-color);
    color: var(--accent-color);
    scale: 1.09;
}

input,
textarea {
    border-color: rgb(255, 255, 255, .1);
    border-radius: 6px;
    transition: border .5s ease-out;
}

input:focus,
textarea:focus,
input:focus-visible,
textarea:focus-visible {
    background-color: var(--secondary-background-color);
    border-color: var(--accent-color);
    box-shadow: none;
    color: var(--text-color);
}

label {
    font-size: 17px;
    color: var(--secondary-text-color);
}

input.filled~.label-font-color {
    color: var(--accent-color);
}

.label-font-color {
    color: var(--accent-color);
}

label[for="correctAnswer"]:focus~#correctAnswer {
    color: var(--accent-color) !important;
}

input:focus+label {
    color: var(--accent-color) !important;
}

.input-box,
.input-box-textarea {
    position: relative;
    height: max-content;
}

.input-box label,
.input-box-textarea label {
    position: absolute;
    left: 10px;
    transition: .5s ease-out;
}

.input-box label {
    top: 50%;
    transform: translate(0, -50%);
}

.input-box input:focus+label {
    left: 0;
    top: -40%;
    scale: .95;
}

.input-box input:not(.border-danger):focus+.label-font-color,
.input-box-textarea textarea:not(.border-danger):focus+.label-font-color {
    color: var(--accent-color) !important;
}

input.filled+.label-font-color {
    left: 0 !important;
    top: -40% !important;
    color: var(--text-color) !important;
    scale: .95;
    cursor: pointer;
}

input.border-danger+.label-font-color,
textarea.border-danger+.label-font-color {
    color: var(--bs-danger) !important;
}

.input-box-textarea label {
    top: 20px;
    transform: translate(0, -50%);
}

.input-box-textarea textarea:focus+label {
    top: -20px;
    left: 0;
    scale: .95;
}

textarea.filled+.label-font-color {
    left: 0;
    top: -20px;
    color: var(--text-color) !important;
    scale: .95;
}

.input-box-textarea input:focus+label {
    left: 0;
    top: 0;
}

.input-margin input:focus,
.input-margin textarea:focus {
    margin-top: 2.5rem;
}

.input-margin input.filled,
.input-margin textarea.filled {
    margin-top: 2.5rem;
}

.input-margin {
    margin: .8rem 0;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.v-enter-to,
.v-leave-from {
    opacity: 1;
}

.v-enter-active {
    transition: .3s ease-in;
}

.v-leave-active {
    transition: .3s ease-out;
}

@media (hover: none) {
    .addAnswer:hover {
        scale: 1;
        border-color: var(--secondary-text-color);
        color: var(--secondary-text-color);
    }
}

@media (min-width: 1440px) and (min-height: 1200px) {
    .addAnswer {
        width: 90px;
        height: 90px;
        border-width: 2px;
        font-size: 70px;
    }

    .container {
        width: 1800px;
        padding: 3rem 2rem;
    }

    button {
        max-width: unset;
    }

    small {
        font-size: 30px;
    }
}</style>