const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build (){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'],
        });

        const page = await browser.newPage();
        await page.setBypassCSP(true);
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || browser[property] || page[property]

            }
        })
    }
    constructor(page) {
        this.page = page;
    }

   async login (){
       const user = await userFactory();
       const {session, sig} = sessionFactory(user);

       await this.setCookie({name: 'session', value: session});
       await this.setCookie({name: 'session.sig', value: sig});
       await this.goto('http://localhost:3000/blogs');
       await this.waitFor('a[href="/auth/logout"]');
   }

   async getContentsOf(selector){
      return  await this.page.$eval(selector, el => el.innerHTML);

   }

  async get(path){

     return  await this.page.evaluate(async (_path) => {
               return   await fetch(_path,{
                   method: 'GET',
                   credentials: 'same-origin',
                   headers: {
                       'Content-Type' : 'application/json'
                   }
               }).then(res => res.json());
           }, path);
   }

 async  post(path, data){
     return  await  this.page.evaluate(
            async   ( _path, _data ) => {
               return await  fetch(_path,{
                   method: 'POST',
                   credentials: 'same-origin',
                   headers: {
                       'Content-Type' : 'application/json'
                   },
                   body: JSON.stringify(_data)
               }).then(res => res.json());
           }, path, data );

   }
    execRequests (actions){
      return Promise.all(actions.map(({method, path, data})=> {
          return  this[method](path, data);
       })
       );


   }
}
module.exports = CustomPage;