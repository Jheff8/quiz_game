<template>
    <teleport to="body">
        <div class="backdrop" @click="close" v-show="isDialogOpen"></div>
        <transition name="dialog">
            <div class="dialog" v-show="isDialogOpen">
                <div class="m-auto text-center">
                    <h2 :class="['lead', 'mb-0', titleColorClass]"> {{ title }}</h2>
                    <p class="text-secondary">{{ secondaryText }}</p>
                </div>
                <div class="row buttons mt-5 gap-3 row-12">
                    <base-button :focusedButton="true" class="col" v-show="shouldShowSecondaryButton"
                        @click="tryContinue">{{ loadContinueButtonText }}</base-button>
                    <base-button :secondaryButton="showSecondaryButton" class="col" @click="close">{{ loadCloseButtonText
                    }}</base-button>
                </div>
            </div>
        </transition>
    </teleport>
</template>
<script>
export default {
    emits: ['continue', 'close'],
    props: ['title', 'secondaryText', 'showSecondaryButton', 'continueBtnText', 'closeBtnText', 'titleColor', 'isDialogOpen'],
    methods: {
        tryContinue() {
            this.$emit('continue')
        },
        close() {
            this.$emit('close')
        }
    },
    computed: {
        titleColorClass() {
            switch (this.titleColor) {
                case 'red':
                    return 'text-danger'
                case 'green':
                    return 'text-success'
                default:
                    return 'text-color'
            }
        },
        shouldShowSecondaryButton() {
            return !!this.showSecondaryButton
        },
        loadCloseButtonText() {
            return this.closeBtnText ? this.closeBtnText : 'Close'
        },
        loadContinueButtonText() {
            return this.continueBtnText ? this.continueBtnText : 'Continue'
        }

    }
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, .85);
    z-index: 99;
}

.dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    padding: 1rem 1.5rem;
    width: 600px;
    max-width: 90vw;
    background-color: var(--secondary-background-color);
    border: 1px solid rgb(64, 67, 68);
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    z-index: 999;
}

h2.lead {
    font-weight: 600;
    hyphens: auto;
}

p {
    font-size: 16px !important;
}

button {
    max-width: 85% !important;
}

.dialog-enter-active {
    animation: fade .4s ease-out;
}

.dialog-leave-active {
    animation: fade .3s ease-out reverse;
}

span {
    font-size: large !important;
}

@media (max-width: 430px) {
    .buttons button {
        flex: 0 auto !important;
        width: 80vw !important;
    }
}

@media (min-width: 1440px) and (min-height: 1200px) {
    .dialog {
        width: 1300px !important;
        padding: 2rem 3rem !important;
    }

    p {
        font-size: 32px !important;
    }

    h2 {
        font-size: 85.37px !important;
    }

    .buttons button {
        margin-top: 2.5rem !important;
    }
}
</style>