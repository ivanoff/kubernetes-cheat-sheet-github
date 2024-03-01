import { Context, Hono, Next } from 'hono'

const db = {aaa: 11};

const app = new Hono();

app.use('*', async (c: Context, next: Next) => {
    c.set('db', db);
    if (c.env) c.env.db = db;
    console.log(1111);    
    await next()
    console.log(9999);
})

app.use('*', async (c, next) => {
    console.log(2222);    
    await next()
    console.log(8888);
})

app.get('/', async (c: Context, next: Next) => {
    console.log(c.env?.db);
    console.log(c.get('db'));
    await next()
    return c.text('Hello Hono2!');
})

app.get('/', async (_, next) => {
    console.log(555);
})

console.log(process.versions.bun);

export default app
