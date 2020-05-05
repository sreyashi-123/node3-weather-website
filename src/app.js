const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{ 
        title: 'Weather',
        name: 'Sreyashi'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{ 
        title: 'About me',
        name: 'Sreyashi'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{ 
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Sreyashi'
        
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address){
        res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude, location} = {} ) => {
       if(error){
           return res.send( {error: error})
       }
       forecast(latitude, longitude, (error, forecastData) => {
        if(error){
            return res.send( {error})
        }
     res.send({
        forecast: forecastData,
        location,
        address: req.query.address
    })

       })
    })
    // res.send({
    //     forecast: 'It is snowing',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        res.send({
            error: 'You must provide a search term.'
        })
    }
    res.send({
        products:[]
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sreyashi',
        errormessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sreyashi',
        errormessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})