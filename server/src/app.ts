import express, { Request, Response } from 'express'
import cors from 'cors'

const arr = [{
    email: "jim@gmail.com",
    number: "221122"
}, {
    email: "jam@gmail.com",
    number: "830347"
}, {
    email: "john@gmail.com",
    number: "221122"
}, {
    email: "jams@gmail.com",
    number: "349425"
}, {
    email: "jams@gmail.com",
    number: "141424"
}, {
    email: "jill@gmail.com",
    number: "822287"
}, {
    email: "jill@gmail.com",
    number: "822286"
}];

type User = {
    name: string;
    age: number;
};


let timer = null;

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const app = express();
app.use(cors()); // for local 
app.use(express.json()) // for easy json body parse

app.post('/search', async (req: Request, res: Response): Promise<any> => {
    if (timer !== null) {
        clearTimeout(timer);
    }

    let email: string = req.body.email;
    if (email === undefined || email.length <= 0 || !validateEmail(email)) {
        timer = setTimeout(() => {
            return res.json({ "error": "bad email" });
        }, 5000);
        return;
    };



    let number: string = req.body.number;
    number = number.replace("-", "");

    res.statusCode = 200;

    let search = arr.filter((e) => {
        return e.email === email && (number === "" || number === e.number);
    })

    timer = setTimeout(() => {
        return res.json({ "ok": 1, "data": search });
    }, 5000);

})

const port = 8080

app.listen(port, (): void => {
    console.log(`App is listening at http://localhost:${port}`)
})