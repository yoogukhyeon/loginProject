const express = require('express');
const app = express();
//bcrypt 해쉬 비밀번호 사용
const bcrypt = require('bcrypt');
//body-parser
const bodyParser = require('body-parser');

//views setting
app.set('views' , 'views');
app.set('view engine' , 'ejs');

//body-parser 미들웨어 등록
app.use(bodyParser.urlencoded({extended: false}));

const users = [];

app.get('/' , (req , res) => {
    res.render('index' , {name: '유국현'});
})

//login
app.get('/login' , (req , res) => {
    res.render('login');
});

app.post('/login' , (req , res) => {

})

//register
app.get('/register' , (req , res) => {
    res.render('register');
});

//post
app.post('/register' , async (req , res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password , 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
});




const port = process.env.PORT || 5000;

app.listen(port , () => {
    console.log(`${port}포트 포트로 이동중....`)
})