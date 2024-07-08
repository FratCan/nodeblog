const express=require('express')
const morgan=require('morgan')
const mongoose=require('mongoose')
const adminRoutes=require('./routes/adminRoutes')
const blogRoutes=require('./routes/blogRoutes')
const authRoutes=require('./routes/authRoutes')
const cookieParser=require('cookie-parser')
const {requireAuth,checkUser}=require('./middlewares/authMiddleware')

const app=express();

const dburl='mongodb+srv://can6240:firat6242@blog.hitovrd.mongodb.net/node-blog?retryWrites=true&w=majority&appName=blog'
mongoose.connect(dburl)
.then((result)=>console.log("bağlantı kuruldu")) //bağlantı kuruldu demeye gerek yok direkt sunucumu dinlemeye başlayabilirim.
.catch((err)=>console.log(err))

app.set('view engine','ejs') //-->view engine bizim views klasorumuzu arayıp bulucak
app.listen(3000)

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cookieParser())
/*
app.get('/add',(req,res)=>{
    const blog=new Blog({
        title:'yeni yazı5',
        short:'kısa açıklama',
        long:'uzun açıklama5'
    })

    blog.save().then((result)=>{
        res.send(result)
    })
    .catch((err=>{
        console.log(err);
    }))
})
*/
/*
app.get('/all',(req,res)=>{
    Blog.find().then((result=>{
        res.send(result)
    })).catch((err=>{
        console.log(err)
    }))
})

app.get('/single',(req,res)=>{
    Blog.findById('6682656db6e3e54bdfe64353').then((result=>{
        res.send(result)
    })).catch((err=>{
        console.log(err)
    }))
})
*/
app.get('*',checkUser) // * checkUser'ın tüm istekler üzerinde çalışmasını sağlar
app.get('/',(req,res)=>{
    /*
    Blog.find().sort({createdAt:-1}).then((result=>{
        res.render('index',{title:'Anasayfa',blogs:result})
    })).catch((err=>{
        console.log(err);
    }))
        */
       res.redirect('/blog')
})



/*
app.use((req,res,next)=>{
    console.log(req.path);
    next();
})
*/

app.use('/',authRoutes);
app.use('/blog',blogRoutes);
app.use(requireAuth,adminRoutes);





app.get('/about',(req,res)=>{
    res.render('about',{title:'Hakkımızda'})
})

app.get('/about-us',(req,res)=>{
    res.redirect('/about') // redirect ile yönlendirme yaptım about'a
})
/*
app.get('/login',(req,res)=>{
    res.render('login',{title:'Login'})
})
    */
//404 için ara katman yazıcaz hibir şartı karşılayamadığında bu çalışcak get post ların en altına yazmam lazım çünkü use ile yazdığım metodlar
//senkron olarak çalışır.Arkasından gelen bloğu engeller.

app.use((req,res)=>{
    res.status(404).render('404',{title:'Sayfa Bulunamadı'})
})
