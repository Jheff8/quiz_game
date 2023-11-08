<template>
    <section class="d-flex align-items-center justify-content-center">
        <h2 class="lead text-light m-auto d-block ">
            The page {{ loadPageName }} was not found.<br>
            Click here to go to <router-link to="/home">home page</router-link> instead.
        </h2>
    </section>
</template>

<script>
export default {
    props: ['notFound'],
    mounted() {
        this.$store.commit('showHeader', true)

        if (this.notFound === 'quizNotFound') {
            notFound = this.$router.from.path
        }
    },
    computed: {
        loadPageName() {
            if (this.notFound.toLowerCase() == 'notfound') {
                return ''
            } else {
                return `"${this.notFound}"`

            }
        }

    }
}
</script>

<style scoped>
section {
    height: calc(100vh - 58px - 30px);
}

h2 {
    max-width: 95vw;
    font-size: xx-large !important;
    font-weight: 300 !important;
}

a,
router-link {
    font-size: xx-large !important;
}

a {
    position: relative;
    text-decoration: none;
    color: var(--primary-color);
}

a:before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 3px;
    transform: translate(-50%, 0);
    background-color: var(--primary-color);
    width: 0;
    height: 1px;
    transition: .3s ease-out;
}

a:hover::before {
    width: 100%;
}

@media (hover: none) {
    a:before {
        width: 100%;
    }
}

@media (min-width: 769px) {
    a:before {
        height: 1.2px !important;
    }
}</style>