const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

// Add your routes here - above the module.exports line


  router.get('/', function (req, res) {
    var axios = require('axios')
  
    var config = {
      method: 'get',
      url: `${process.env.cmsurl}api/teams?filters[enabled][\$eq]=true&populate=%2A`,
      headers: {
        Authorization: 'Bearer ' + process.env.apikey,
      },
    }

    var services = {
        method: 'get',
        url: `${process.env.cmsurl}api/services?&populate=%2A`,
        headers: {
          Authorization: 'Bearer ' + process.env.apikey,
        },
      }
  
    axios(config)
      .then(function (response) {
        var teams = response.data

        axios(services)
        .then(function (responses) {
          var services = responses.data
  
          
    
          res.render('index', { teams, services })
        })
        .catch(function (error) {
          console.log(error)
        })
        
      })
      .catch(function (error) {
        console.log(error)
      })




  })



router.get('/:service_slug/:post_slug', function (req, res) {
  var axios = require('axios')

  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/posts?filters[slug][\$eq]=${req.params.post_slug}&[service][slug][\$eq]=${req.params.service_slug}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  axios(config)
    .then(function (response) {
      var data = response.data

      res.render('post', { data })
    })
    .catch(function (error) {
      console.log(error)
    })
})


router.get('/:id', function (req, res) {
  var axios = require('axios')

  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/posts?filters[service][slug][\$eq]=${req.params.id}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  var service = {
    method: 'get',
    url: `${process.env.cmsurl}api/services?filters[slug][\$eq]=${req.params.id}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

axios(config)
  .then(function (response) {
    var posts = response.data

    axios(service)
    .then(function (responses) {
      var services = responses.data

      res.render('posts', { posts, services })
    })
    .catch(function (error) {
      console.log(error)
    })
    
  })
  .catch(function (error) {
    console.log(error)
  })
})

module.exports = router
