const Page = require('./helpers/page');
let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
})


describe('when logged in ', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('can see blog create form', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('And using valud inputls', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'my titulo');
            await page.type('.content input', 'mi contenido');
            await page.click('form button');
        });
        test('submiting takes user to review screen', async () => {
            const text = await page.getContentsOf('h5');
            // console.log('****************************************'+ text);
            expect(text).toEqual('Please confirm your entries');
        });
        test('submiting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('my titulo');
            expect(content).toEqual('mi contenido');


        });
    });

    describe('And using invalud inputls', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('the form shows an error menssage', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');

        });
    });

})


describe('User is not log in ', async () => {

    const actions = [
        {
            method: 'get',
            path: 'api/blogs'
        },
        {
            method: 'post',
            path: 'api/blogs',
            data: {
                title: 't',
                content: 'c'
            }
        }
    ];
    test('Blog related action esta prohibidas', async () => {
        const results = await page.execRequests(actions);

        for (let result of results) {
            console.log(result);
            expect(result).toEqual({error: 'You must log in!'});
        }

    });


});


