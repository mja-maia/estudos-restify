import { Server }  from './server/server'

const server = new Server()

server.bootstrap()
  .then(server=> {
    console.log(`Server is litening on ${server.application.address().port}`)
  }).catch(error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
  })