const users = [
  {name: 'Peter Parker', email: 'peter@marvel.com'},
  {name: 'Tony Stark', email: 'tony@marvel.com'},
  {name: 'Bruce Benner', email: 'bruce@marvel.com'},
]


export class User {
  static findAll(): Promise<any[]>{
    return Promise.resolve(users)
  }
}