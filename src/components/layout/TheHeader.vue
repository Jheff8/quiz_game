<template>
    <header :class="['dominant-bg', { 'hide-header': isHeaderHidden }]">
        <nav :class="['container-fluid', 'd-flex', 'align-items-center', 'justify-content-end']">
            <router-link to="/home" title="Go to home page" class="navbar-brand">
                <img src="../../assets/quizduel-svgrepo-com.svg" alt="Page's logo" class="navbar-brand-icon">
            </router-link>
            <ul class="d-flex align-items-center justify-content-center gap-4 m-0 p-0">
                <li class="lead text-color" title="Go to home page">
                    <router-link to="/home" class="nav text-secondary" :tabindex="isHeaderHidden">home</router-link>
                </li>
                <li class="lead" title="Go to creation page">
                    <router-link to="/create" class="text-secondary nav" :tabindex="isHeaderHidden">create</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    computed: {
        isHeaderHidden() {
            return !this.$store.getters.isHeaderVisible
        }
    }
}
</script>

<style scoped>
header {
    padding: 1rem;
    width: 100%;
    min-height: 51.2px !important;
    background-color: var(--background-color);
    border-bottom: 1px solid rgb(255, 255, 255, .1);
    z-index: 99;
    transition: .5s ease;
}

.hide-header {
    display: none !important;
    visibility: none !important;
}

nav router-link:not(.navbar-brand),
nav a:not(.navbar-brand) {
    position: relative;
    font-size: 1.3rem;
    font-weight: 400;
    text-decoration: none;
    border-bottom: 0;
    z-index: 2;
    transition: .3s ease-out;
}

a:focus-visible,
router-link:focus-visible {
    border-radius: 5px;
    outline: 1px solid var(--primary-color);
}

ul {
    max-width: 50vw;
    font-size: .8rem;
    list-style: none;
}

router-link:not(.navbar-brand):hover,
a:not(.navbar-brand):hover,
.router-link-active:not(.navbar-brand) {
    color: var(--primary-color) !important;
}

router-link:not(.navbar-brand)::before,
a:not(.navbar-brand)::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 2px;
    transform: translate(-50%, 0);
    width: 0;
    height: .8px;
    background-color: var(--primary-color);
    transition: .3s ease-out;
}

nav .router-link-active:not(.navbar-brand)::before {
    width: 102%;
}

a:not(.navbar-brand),
router-link:not(.navbar-brand) {
    display: block;
    margin: auto;
    width: fit-content;
}

.navbar-brand {
    position: absolute;
    left: 1.5rem;
    top: 1rem;
    transition: .3s ease-out;
}

.navbar-brand-icon {
    height: 2.3rem;
    transition: .3s ease-out;
}

.navbar-brand-icon:hover {
    filter: drop-shadow(0 0 .6rem var(--primary-color));
}

.navbar-brand:active {
    transform: scale(.8);
}

@media (hover: none) {

    nav router-link:hover::after,
    a:hover::after {
        width: unset !important;
    }

    router-link:not(.router-link-active):hover,
    a:not(.router-link-active):hover {
        color: var(--secondary-text-color) !important;
    }

    router-link.router-link-active:hover,
    a.router-link-active:hover {
        color: var(--primary-color) !important;
    }

    .navbar-brand-icon:hover {
        filter: none !important;
    }
}</style>