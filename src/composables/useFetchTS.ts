import { createFetch } from '@vueuse/core'

export const useFetchTS = createFetch({
  baseUrl: 'http://localhost:8080',
  options: {
    async beforeFetch({ options }) {
      // const myToken = await getMyToken()
      // options.headers.Authorization = `Bearer ${myToken}`
      return { options }
    },
    async afterFetch(ctx) {
      // ✅ Parser la réponse en JSON
      let data = ctx.data

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          console.error('Erreur parsing JSON:', e)
        }
      }

      return { ...ctx, data }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

