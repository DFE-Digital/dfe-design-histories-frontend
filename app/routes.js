const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const axios = require('axios')
const e = require('express')

// Add your routes here - above the module.exports line\

router.get('/home', function (req, res) {
  req.session.data = {}

  res.redirect('/')

})

router.get('/auth/:id', function (req, res) {
  var service = {
    method: 'get',
    url: `${process.env.cmsurl}api/services?filters[slug][\$eq]=${req.params.id}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }
  axios(service)
    .then(function (responses) {
      var services = responses.data

      res.render('auth', { services })
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.post('/auth/:id', function (req, res) {
  var service = {
    method: 'get',
    url: `${process.env.cmsurl}api/services?filters[slug][\$eq]=${req.params.id}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }
  axios(service)
    .then(function (responses) {
      var services = responses.data

      // is the password valid?

      if (req.body.password === services.data[0].attributes.Password) {
        // set password into session

        req.session.data['auth-' + services.data[0].attributes.Slug] = true

        // redirect to the service

        console.log('Authenticated - redirecting to service')
        res.redirect('/' + services.data[0].attributes.Slug)
      } else {
        console.log('Not authenticated - redirecting to password page')

        req.session.data['auth-' + services.data[0].attributes.Slug] = false
        var error = "You've entered an incorrect password"
        req.session.data['error'] = error;
        res.redirect('/auth/' + services.data[0].attributes.Slug)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.get('/roadmap', function (req, res) {
  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/service-pages/3`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  axios(config)
    .then(function (response) {
      var data = response.data

      console.log(data.error)

      res.render('generic-page', { data })
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.get('/accessibility-statement', function (req, res) {
  console.log('accessibility-statement')

  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/service-pages/1`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  axios(config)
    .then(function (response) {
      var data = response.data

      console.log(data.error)

      res.render('generic-page', { data })
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.get('/get-a-design-history', function (req, res) {
  console.log('accessibility-statement')

  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/service-pages/2`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  axios(config)
    .then(function (response) {
      var data = response.data

      console.log(data.error)

      res.render('generic-page', { data })
    })
    .catch(function (error) {
      console.log(error)
    })
})

router.get('/team/:id', function (req, res) {
  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/teams?filters[slug][\$eq]=${req.params.id}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  axios(config)
    .then(function (response) {
      var services = response.data

      res.render('services', { services })
    })
    .catch(function (error) {
      console.log(error)
    })
})




router.get('/', function (req, res) {

  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/teams?filters[Enabled][\$eq]=true&populate=%2A`,
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
  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/posts?filters[slug][\$eq]=${req.params.post_slug}&[service][slug][\$eq]=${req.params.service_slug}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  var service = {
    method: 'get',
    url: `${process.env.cmsurl}api/services?filters[slug][\$eq]=${req.params.service_slug}&populate=%2A`,
    headers: {
      Authorization: 'Bearer ' + process.env.apikey,
    },
  }

  axios(config)
    .then(function (response) {
      var data = response.data

      axios(service)
        .then(function (responses) {
          var services = responses.data

          if (
            req.session.data['auth-' + services.data[0].attributes.Slug] === true
          ) {
            res.render('post', { data, services })
          } else {
            if (services.data[0].attributes.Password) {
              res.redirect('/auth/' + services.data[0].attributes.Slug)
            } else {
              res.render('post', { data, services })
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })
    .catch(function (error) {
      console.log(error)
    })
})



router.get('/:id', function (req, res) {

  var config = {
    method: 'get',
    url: `${process.env.cmsurl}api/posts?filters[service][slug][\$eq]=${req.params.id}&sort=Publication_date%3Adesc&populate=%2A`,
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

      if (
        req.session.data['auth-' + services.data[0].attributes.Slug] === true
      ) {
        res.render('posts', { posts, services })
      } else {
        if (services.data[0].attributes.Password) {
          res.redirect('auth/' + services.data[0].attributes.Slug)
        } else {
          res.render('posts', { posts, services })
        }
      }
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
