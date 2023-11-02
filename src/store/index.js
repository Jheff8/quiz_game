import { createStore } from "vuex";

export default createStore({
  state: {
      showHeader: true,
      quizzes: [],
      questions: {}
  },
  getters: {
    quizzesList(state){
      return state.quizzes
    },
    questions(state) {
      return state.questions
    },
    isHeaderVisible(state) {
      return state.showHeader
    }
  },
  mutations: {
    setQuizzes(state, payload) {
      state.quizzes = payload
    },
    addNewQuiz(state, payload){
      state.quizzes.push(payload)
    },
    setQuestions(state, payload){
      state.questions[payload.name] = payload.questions
    },
    showHeader(state, payload) {
      state.showHeader = payload
    }
  },
  actions: {
    async loadQuizzes(context){

      const response = await fetch(
        `https://quiz-fa99f-default-rtdb.firebaseio.com/quizzes.json`
      )

      const responseData = await response.json()

      if (!response.ok) {
          const error = new Error(responseData.message || 'Failed to load Quizzes!')
          throw error
      }
      let allQuiz = []
      for (const key in responseData) {
          const quiz = {
              name: responseData[key].name,
              description: responseData[key].description,
              imageName: responseData[key].imageName,
              imagePosition: responseData[key].imagePosition,
          }
          allQuiz.push(quiz)
      }
      context.commit('setQuizzes', allQuiz)
    },
    async registerQuiz(context, payload){
       const obj = {
            [payload.name]: {
              name: payload.name,
              description: payload.description,
              imageName: payload.imageName,
              imagePosition: payload.imagePosition
            }
        }     
      const response = await fetch('https://quiz-fa99f-default-rtdb.firebaseio.com/quizzes.json', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = new Error('Failed to register Quiz!')
        throw error
    }

      for (let key in obj) {
        context.commit('addNewQuiz', obj[key])
      }
    },
    async loadQuestions(context){
      const response = await fetch(
        `https://quiz-fa99f-default-rtdb.firebaseio.com/questions.json`
      )
      const responseData = await response.json()
      if (!response.ok) {
          const error = new Error(responseData.message || 'Failed to load Questions!')
          throw error
      }
  
      const allQuestionsNames = []
  
      for (const key in responseData) {
        allQuestionsNames.push(key)
      }  
      allQuestionsNames.forEach(element => {
        context.commit('setQuestions', { name: element, questions: responseData[element] })
      })
    },
    async registerQuestion(context, payload){
      const response = await fetch(
        `https://quiz-fa99f-default-rtdb.firebaseio.com/questions/${payload.name}.json`, {
          method: 'PUT',
          body: JSON.stringify(payload.data)
        }
      )
      if (!response.ok) {
        const error = new Error ('Failed to register question!')
        throw error
    }
      context.commit('setQuestions', { name: payload.name, questions: payload.data })
    },
  },
  
  modules: {},
});
