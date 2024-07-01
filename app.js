const express=require('express')
const morgan=require('morgan')
const mongoose=require('mongoose')
const Blog=require('./models/blogs');

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

app.get('/',(req,res)=>{
    Blog.find().sort({createdAt:-1}).then((result=>{
        res.render('index',{title:'Anasayfa',blogs:result})
    })).catch((err=>{
        console.log(err);
    }))
})

app.get('/blog/:id',(req,res)=>{ //: den sonra gelenler değişkendir.
    const id=req.params.id
    Blog.findById(id).then((result)=>{
        res.render('blog',{title:'Detay',blog:result})
    }).catch((err=>{
        res.status(404).render('404',{title:'Sayfa Bulunamadı'})
    }))
})


app.get('/admin',(req,res)=>{
    Blog.find().sort({createAt:1}).then((result=>{
        res.render('admin',{title:'Admin',blogs:result})
    })).catch((err=>{
        console.log(err);
    }))
})

app.get('/admin/add',(req,res)=>{
    res.render('add',{title:'Yeni yazı'})
})

app.post('/admin/add',(req,res)=>{
    const blog=new Blog(req.body)
    blog.save()
    .then((result=>{
        res.redirect('/admin')
    })).catch((err=>{
        console.log(err);
    }))
})

app.delete('/admin/delete/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({link:'/admin'})
    })
    .catch((err)=>{
        console.log(err);
    })
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
