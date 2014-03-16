window.App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'thingstore'
});

// Define the Thing Model
App.Thing = DS.Model.extend({ name: DS.attr() });

// Define an index route
App.Router.map(function() {
  this.route('about', { path: '/about' });
});

// Set up a route for things
App.ThingsRoute = Ember.Route.extend({
  model: function() {
    this.store.find('thing');
  }
});

App.Router.map(function() {
  this.resource('things', function() {
    this.route('new');
  });
});

// Define the Application route
App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    this.store.push('thing', {
      id: 1,
      name: 'Apples'
    });

    this.store.push('thing', {
      id: 2,
      name: 'Oranges'
    });
  }
});
