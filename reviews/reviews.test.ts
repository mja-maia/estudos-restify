import 'jest'
import * as request from 'supertest'

let address = (<any>global).address;
test('get /review', ()=>{
  return request(address)
     .get('/users')
     .then(response=>{
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
     }).catch(fail)
})