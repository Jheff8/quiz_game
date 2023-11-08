<template>
    <section>
        <base-dialog :isDialogOpen="isDialogVisible" :title="dialogTitle" :secondaryText="secondaryText"
            :showSecondaryButton="isSecondaryButtonVisible" @continue="addQuiz" @close="closeDialog">
        </base-dialog>
        <div class="row justify-content-center align-items-center m-auto">
            <div class="container" style="margin: calc(.8rem * 2) auto">
                <form class="m-auto">
                    <h1 class="text-ligh secondary-tex text-color text-center lead">Create a Quiz</h1>
                    <div class="mt-5" style="margin-bottom: .8rem;">
                        <div class="input-box">
                            <input type="text" id="name"
                                :class="['form-control', 'background-secondary-bg', { 'filled': isNameInputFilled }, { 'text-color': inputName.isValid }, { 'border-danger text-danger': !inputName.isValid }]"
                                v-model.trim="inputName.value" @input="filterSpecialCharacters"
                                @blur="clearValidity('inputName')" maxlength="15">
                            <label for="name" :class="['form-label', 'lead', 'label-font-color', 'text-secondary']">Quiz
                                name</label>
                        </div>
                        <small class="text-danger" v-show="isNameAlreadyInUse">This name is already in use; please choose a
                            different
                            one.</small>
                        <small class="secondary-text-color" v-show="isNameTooBig">You cannot exceed a name length of 15
                            characteres.</small>
                    </div>
                    <div class="input-container">
                        <div class="input-box">
                            <input type="text" id="description"
                                :class="['form-control', 'background-secondary-bg', { 'filled': isDescriptionInputFilled }, { 'text-color': inputDescription.isValid }, { 'border-danger text-danger': !inputDescription.isValid }]"
                                v-model.trim="inputDescription.value" @blur="clearValidity('inputDescription')"
                                maxlength="80">
                            <label for="description"
                                :class="['form-label', 'label-font-color', 'text-secondary']">Description</label>
                        </div>
                        <small class="secondary-text-color" v-show="isDescriptionTooBig">You cannot exceed a description
                            length of 80 characters.</small>
                    </div>
                    <div style="margin-bottom: calc(.8rem * 2);">
                        <the-gallery :showGallery="isGalleryVisible" :preSelectedImage="selectedImage.value"
                            @image="setImageName" @close="closeGallery"></the-gallery>
                        <base-button type="button" :secondaryButton="true" :accentColor="!!selectedImage.value"
                            :dangerButton="!selectedImage.isValid"
                            :class="['btn-select-image', { 'active-image': selectedImage.value }]" @click="showGallery">{{
                                loadSelectImageText }}</base-button>
                    </div>
                    <base-button type="submit" class="mt-5" @click.prevent="formValidity">Add Quiz</base-button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import TheGallery from '../layout/TheGallery';
export default {
    components: {
        TheGallery
    },
    data() {
        return {
            selectedImage: { value: '', isValid: true },
            imagePosition: null,
            inputName: { value: '', isValid: true },
            inputDescription: { value: '', isValid: true },
            isDialogVisible: false,
            isNameAlreadyInUse: false,
            dialogTitle: '',
            secondaryText: '',
            isSecondaryButtonVisible: false,
            isGalleryVisible: false
        }
    },
    mounted() {
        this.$store.commit('showHeader', true)
    },
    methods: {
        formValidity() {
            if (this.inputName.value == '' || this.inputDescription.value == '') {
                this.dialogTitle = 'You must fill the empty gaps to proceed.'
                this.secondaryText = ''
                this.isSecondaryButtonVisible = false
                this.isDialogVisible = true
                if (this.inputName.value == '') {
                    this.inputName.isValid = false
                }
                if (this.inputDescription.value == '') {
                    this.inputDescription.isValid = false
                }
                return
            }
            if (this.inputName.value !== '') {
                const allQuizzes = this.$store.getters.quizzesList
                for (let i in allQuizzes) {
                    let name = this.inputName.value.toLowerCase()
                    if (allQuizzes[i].name == name.charAt(0).toUpperCase() + name.slice(1)) {
                        this.isNameAlreadyInUse = true
                        this.inputName.isValid = false
                        return
                    }
                }
            }
            if (this.selectedImage.value == '') {
                this.dialogTitle = 'You must select an image to proceed.'
                this.secondaryText = ""
                this.selectedImage.isValid = false
                this.isDialogVisible = true
                return
            }

            this.addQuiz()
        },
        addQuiz() {
            const captalizedName = this.inputName.value.charAt(0).toUpperCase() + this.inputName.value.slice(1)
            const obj = {
                name: captalizedName,
                imageName: this.selectedImage.value + '.jpeg',
                description: this.inputDescription.value,
                imagePosition: this.imagePosition
            }
            sessionStorage.setItem('newQuizInformation', JSON.stringify(obj))

            this.$store.commit('showHeader', false)

            this.resetInputs()

            this.$router.replace(`/create/${captalizedName.toLowerCase()}`)

        },
        resetInputs() {
            this.inputName.value = ''
            this.inputName.isValid = true

            this.inputDescription.value = ''
            this.inputDescription.isValid = true

            this.selectedImage.value = ''
            this.selectedImage.isValid = true

        },

        closeDialog() {
            this.isDialogVisible = false
        },
        clearValidity(input) {
            if (this[input] == this.inputName && this.isNameAlreadyInUse == true) {
                this.isNameAlreadyInUse = false
            }
            if (this[input].value !== '') {
                this[input].isValid = true
            }
        },
        showGallery() {
            this.isGalleryVisible = true
        },
        closeGallery() {
            this.isGalleryVisible = false
        },
        setImageName(imageName, imagePosition) {
            this.selectedImage.value = imageName
            this.imagePosition = imagePosition
            this.selectedImage.isValid = true
        },
        filterSpecialCharacters() {
            this.inputName.value = this.inputName.value.replace(/[^\w\s]/g, '')
        }
    },
    computed: {
        isDescriptionTooBig() {
            if (this.inputDescription.value.length >= 80) {
                return true
            } else {
                return false
            }
        },
        isNameTooBig() {
            if (this.inputName.value.length >= 15) {
                return true
            } else {
                return false
            }
        },
        isNameInputFilled() {
            return this.inputName.value != '' ? true : false
        },
        isDescriptionInputFilled() {
            return this.inputDescription.value != '' ? true : false
        },
        loadSelectImageText() {
            return this.selectedImage.value ? 'Change Image' : 'Select an Image'
        }
    }

}
</script>

<style scoped>
section {
    display: grid;
    place-items: center;
    max-width: 100vw;
}

.row {
    width: 95vw !important;
    max-width: 1300px !important;
}

.container {
    padding: 2rem 1rem;
    max-width: 900px;
    width: 85vw;
    background-color: var(--secondary-background-color);
    border: 1px solid rgb(255, 255, 255, .1);
    border-radius: 16px;
}

form {
    padding: 0 .3rem;
}

label {
    font-weight: 600;
    font-size: .98rem;
    cursor: text;
}

small {
    display: block;
    padding: 0 .5rem;
    margin: auto;
    font-weight: 200;
    font-size: 1rem;
}

h1 {
    margin-bottom: 3.5rem;
    color: var(--primary-color) !important;
}

input {
    padding: .6rem .625rem;
    /* padding-top: .6rem;
    padding-bottom: .6rem; */
    border-color: rgba(255, 255, 255, .1);
    transition: all .5s ease-out !important;
}

input,
.btn-select-image {
    border-radius: 6px;
}

input:focus:not(.border-danger) {
    border-color: var(--accent-color);
}

input:focus {
    background-color: var(--secondary-background-color);
    border-color: var(--accent-color);
    box-shadow: none;
}

.input-box {
    position: relative;
    height: max-content;
}

.input-box label {
    position: absolute;
    left: .625rem;
    top: 50%;
    transform: translate(0, -50%);
    transition: .5s ease-out;
}

.input-box input:focus+label {
    left: 0;
    top: -40%;
    scale: .95;
}

.input-box input:not(.border-danger):focus+.label-font-color {
    color: var(--accent-color) !important;
}

input.filled+.label-font-color {
    left: 0 !important;
    top: -40% !important;
    color: var(--secondary-text-color) !important;
    scale: .9;
    cursor: pointer;
}

.input-container input:focus,
.input-container input.filled {
    margin-top: 2.5rem;
}

.input-container {
    margin-bottom: .8rem;
}

input.border-danger+.label-font-color {
    color: var(--bs-danger) !important;
}

.btn-select-image {
    width: max-content;
    padding-right: 10px;
    padding-left: 10px;
    margin: 0;
    transition: .3s ease-out;
}

.active-image {
    border-color: var(--primary-color) !important;
    color: var(--primary-color) !important;
}

.gallery-enter-from,
.gallery-leave-to {
    opacity: 0;
    scale: 0;
}

.gallery-enter-active {
    transition: opacity .5s ease-out, scale .5s ease-in;
}

.gallery-leave-active {
    transition: opacity .5s ease-in, scale .2s ease-out;
}

.gallery-enter-to,
.gallery-leave-from {
    opacity: 1;
    scale: 1;
}

@media (min-width: 769px) {

    .input-container input.filled,
    .input-container input:focus {
        margin-top: 3rem;
    }

    .input-container {
        margin-bottom: 1rem !important;
    }
}

@media (min-width: 1440px) and (min-height: 1200px) {

    .input-container input.filled,
    .input-container input:focus {
        margin-top: 5.5rem;
    }

    h1 {
        margin-bottom: 7rem;
    }

    .input-box label {
        left: 1.5rem;
    }

    .input-container {
        margin-top: 2rem;
        margin-bottom: 2rem !important;
    }

    .container {
        border-radius: 20px;
        padding: 3rem 2rem;
        max-width: 1800px;

    }

    .btn-select-image {
        width: 340px !important;
        margin-bottom: 5em !important;
    }

    small {
        font-size: 35px;
        font-weight: 300;
    }
}</style>