<template>
    <button
        :class="['primary-bg', { 'secondary-button': secondaryButton }, { 'accent-color': accentColor }, { 'danger-button': dangerButton }, { 'outline': outline }]"
        ref="button">
        <span>
            <slot></slot>
        </span>
    </button>
</template>
<script>
export default {
    props: ['secondaryButton', 'focusedButton', 'accentColor', 'dangerButton', 'outline'],
    mounted() {
        if (this.focusedButton) {
            this.$refs.button.focus()
        }
    },
}
</script>

<style scoped>
button {
    position: relative;
    display: block;
    padding: .6rem 0;
    margin: auto;
    width: 65%;
    max-width: 400px;
    border-radius: 8px;
    border: none;
    text-rendering: optimizeLegibility;
    overflow: hidden;
    scale: 1;
    transition: filter .1s ease-out, all .3s ease-out;
}

button:not(.secondary-button) span {
    color: var(--background-color) !important;
}

button:active {
    box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
    scale: .85;
}

span {
    font-size: 20px;
    z-index: 2;
    transition: .3s ease-in-out;
}

button.outline {
    background-color: transparent;
    border: 1px solid var(--secondary-text-color);
}

button.outline span {
    color: var(--secondary-text-color) !important;
}

button.secondary-button {
    background-color: var(--secondary-color) !important;
    border: 1px solid var(--secondary-color);
    transition: all .3s ease-out;
}

button.secondary-button span {
    color: var(--secondary-text-color) !important;
}

button.danger-button {
    border: 1px solid red !important;
}

button.danger-button span {
    color: red !important;
}

button.secondary-button:not(.accent-color):not(.danger-button):not(:disabled):hover span {
    color: var(--secondary-text-color) !important;
}

button.secondary-button:not(:disabled):hover {
    will-change: transform;
    transform-origin: center;
}

button.accent-color {
    background-color: var(--accent-color) !important;
    border: none;
}

button.accent-color span {
    color: var(--background-color) !important;
}

button:not(:disabled):hover {
    will-change: transform;
    transform: scale(1.05) translateY(-3px);
    transform-origin: center;
}

button:not(.secondary-button):not(.accent-color):not(.outline):not(:disabled):hover {
    filter: drop-shadow(0rem 0rem .1rem var(--primary-color));
}

button:disabled {
    opacity: .6;
    background-color: #262626 !important;
    color: var(--text-color);
    outline: none !important;
}

button:disabled span {
    text-decoration: line-through;
}

button:disabled:active {
    box-shadow: none;
}

button:focus-visible {
    transform: scale(1.05);
    border: none;
    outline: 4px solid var(--accent-color) !important;
}

@media (hover: none) {
    button:hover {
        filter: none !important;
        box-shadow: none !important;
        transform: scale(1) translateY(0) !important;
    }
}

@media (max-width: 400px) {
    button span {
        font-size: 18px !important;
    }
}

@media (min-width: 1440px) and (min-height: 1200px) {
    button {
        padding: 1rem 0 !important;
        max-width: unset;
    }

    button span {
        font-size: 36px !important;
        font-weight: 400;
    }

    button:not(.secondary-button) span {
        font-weight: 500;
    }

}
</style>