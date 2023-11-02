<template>
    <section>
        <div class="row justify-content-center align-items-center m-auto my-4">
            <form class="form">
                <h1 class="text-center primary-color lead">Login</h1>
                <div class="mt">
                    <input type="email" :class="['form-control', 'text-color', 'background-secondary-bg','secondary-text', {'border-danger': isEmailWrong}]" id="email" placeholder="Email" v-model.trim="emailInput">
                    <span class="error text-danger lead" v-show="isEmailWrong">The email is invalid.</span>
                </div>
                <div class="mb" style="margin-top: 2rem;">
                    <input :type="inputType" id="password" :class="['form-control', 'text-color', 'background-secondary-bg', 'secondary-text', {'border-danger': isPasswordWrong} ]" placeholder="Password" v-model="passwordInput">
                    <i :class="['bi', eyeClass]" @click="toggleInputVisibility"></i>
                    <span class="error text-danger lead" v-sow="isPasswordWrong">Password must have 8 characters at least.</span>
                </div>
                <base-button class="" @click.prevent="login">Confirm</base-button>
            </form>
        </div>
    </section>
</template>
<script>
export default {
    data(){
        return {
            isInputVisible: false,
            inputType: 'password',
            emailInput: null,
            passwordInput: null,
            isPasswordWrong: false,
            isEmailWrong: false,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        }
    },
    mounted(){
        this.$store.commit('showHeader', true)
    },
    watch:{
        passwordInput(password){
            if (password == '' || password.length > 8 ) {
                this.isPasswordWrong = false
            }
        },
        emailInput(email){
            if (this.emailRegex.test(email) || email == '') {
                this.isEmailWrong = false
            }
            // to do
        }
    },
    methods:{
        toggleInputVisibility() {
            this.isInputVisible = !this.isInputVisible
        },
        login(){
            if (!this.emailInput || !this.emailRegex.test(this.emailInput)){
                this.isEmailWrong = true
                return
            }
            if (!this.passwordInput || this.passwordInput.length < 8) {
                this.isPasswordWrong = true
                return 
            }
            if (this.isPasswordWrong === false && this.isEmailWrong === false) {
                // to do
            }
        }
    },
    computed: {
        eyeClass(){
            if (this.isInputVisible) {
                this.inputType = 'text'
                return 'bi-eye'
            } else {
                this.inputType = 'password'
                return 'bi-eye-slash'

            }
        },
    }

}
</script>

<style scoped>
section{
    display: grid;
    place-items: center;
}
.row{
    width: 95vw !important;
    max-width: 1300px !important;
}
form{
    padding: 2rem 1rem;
    width: 1000px;
    max-width: 90vw;
    background-color: var(--secondary-background-color);
    border: 1px solid rgba(255, 255, 255, .1);
    border-radius: 15px;
}
h1{
    font-weight: 700;
    font-size: 2.8rem;
    
}
input{
    padding-top: .8rem;
    padding-bottom: .8rem;
    border-radius: 8px;
    transition: .5s ease-out;
}
input:not(.border-danger){
    border-color: rgba(255,255,255, .1);
}

input:focus{
    border-color: var(--accent-color);
    background-color: var(--secondary-background-color);
    box-shadow: none;
}
.error{
    position: absolute;
    left: 10px;
    bottom: -25px;   
    font-weight: 400;
    font-size: 1rem;
}

div{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
div.mb{
    margin-bottom: 2.8rem;
}
div.mt{
    margin-top: 2rem;
}

i{
    display: flex;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translate(0, -50%);
    font-size: 1.3rem;
    color: #979b9f;
    cursor: pointer;
}

</style>