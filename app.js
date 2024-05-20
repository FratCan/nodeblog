const express=require('express')
const morgan=require('morgan')
const app=express();

app.set('view engine','ejs') //-->view engine bizim views klasorumuzu arayıp bulucak
app.listen(3000)

app.use(express.static('public'))
app.use(morgan('dev'))


app.get('/',(req,res)=>{
    res.render('index',{title:'Anasayfa'})
})
app.use((req,res,next)=>{
    console.log(req.path);
    next();
})

app.get('/about',(req,res)=>{
    res.render('about',{title:'Hakkımızda'})
})

app.get('/about-us',(req,res)=>{
    res.redirect('/about') // redirect ile yönlendirme yaptım about'a
})

app.get('/login',(req,res)=>{
    res.render('login',{title:'Login'})
})
//404 için ara katman yazıcaz hibir şartı karşılayamadığında bu çalışcak get post ların en altına yazmam lazım çünkü use ile yazdığım metodlar
//senkron olarak çalışır.Arkasından gelen bloğu engeller.

app.use((req,res)=>{
    res.status(404).render('404',{title:'Sayfa Bulunamadı'})
})
