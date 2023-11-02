<template>
    <section class="d-flex align-items-center justify-content-center">
        <h1 class="lead text-light">
            The page {{ loadPageName }} was not found.<br>
            Click here to go to <router-link to="/home">home page</router-link> instead.
        </h1>
    </section>
</template>

<script>
export default {
    props: ['notFound'],
    mounted(){
        this.$store.commit('showHeader', true)

        if (this.notFound === 'quizNotFound') {
            notFound = this.$router.from.path
        }
    },
    computed:{
        loadPageName(){
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
section{
    /* height: calc(100vh - 7.5rem); */
    height: calc(100vh - 58px - 30px);
}
.lead{
    font-size: 1.5rem;
}
a{
    position: relative;
    text-decoration: none;
    color: var(--primary-color);
}
a:before{
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    background-color: var(--primary-color);
    width: 0;
    height: 1px;
    transition: .3s ease-out;
}
a:hover::before{
    width: 100%;
}
</style>