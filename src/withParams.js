/* istanbul ignore next */
const withParams ={}

  if(import.meta.env.BUILD === 'web'){
    import('./withParamsBrowser').then((response) => {
      withParams = response.withParams
    })
  }else{
    import('./params').then((response) => {
      withParams = response.withParams
    })
  }
    
export default withParams
