if( process.env.SESSION_SCRIPT !== 'production'){
    require('dotenv').config();
};


const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const methodOverride = require('method-override')
//passport
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config');

initializePassport(passport , email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);
//bcrypt 해쉬 비밀번호 사용
const bcrypt = require('bcrypt');
//body-parser
const bodyParser = require('body-parser');

//override 미들웨어
app.use(methodOverride('_method'));

//views setting
app.set('views' , 'views');
app.set('view engine' , 'ejs');

//body-parser 미들웨어 등록
app.use(bodyParser.urlencoded({extended: false}));

//flash , session 미들웨어등록
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SCRIPT,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//데이터 값을 넣기 위해서 배열 만들기
const users = [];

app.get('/' , checkAuthenticated , (req , res) => {
    res.render('index' , {name: req.user.name});
})

//login
app.get('/login' ,checkNotAuthenticated, (req , res) => {
    res.render('login');
});

app.post('/login' , checkNotAuthenticated,  passport.authenticate('local' , {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}))

//register
app.get('/register', checkNotAuthenticated, (req , res) => {
    res.render('register');
})
//post
app.post('/register' ,checkNotAuthenticated, async (req , res) => {
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

app.delete('/login' , (req , res) => {
    req.logOut();
    res.redirect('/login');
})


function checkAuthenticated(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login')
}
function checkNotAuthenticated(req , res , next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next();
}



app.listen(port , () => {
    console.log(`${port}포트 포트로 이동중....`)
})