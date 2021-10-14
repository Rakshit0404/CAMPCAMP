const express = require('express');
const app = express();
const path = require('path');
const methodOverride=require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate=require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connection setup');
    })
    .catch(err => {
        console.log('error encountered');
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await Campground.find();
    res.render('campgrounds/index',{campgrounds});
})

app.post('/campgrounds',async(req,res)=>{
    const campground=new Campground({...req.body.campground});
    console.log(campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id',async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    console.log(campground.title);
    res.render('campgrounds/show',{campground});
})

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
})

app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id',async (req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})

app.get('/campground/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.get('/makecampground',async (req,res)=>{
    const Camp=new Campground({title:'My Backyard'});
    await Camp.save();
    res.send(Camp);
});

app.listen('8000', () => {
    console.log('yelpcamp');
})