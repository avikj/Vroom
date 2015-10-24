/*Routing*/
Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/account', {
    name: 'account',
    template: 'account'
});
/*/Routing*/

/*Main meteor code*/
if (Meteor.isClient) {
  Template.account.helpers({
    currentUserEmail: function(){
      return Meteor.user().emails[0].address;
    }
  });
  Template.account.events({
    "click #logout":function(){
      Meteor.logout();
    }
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
/*/Main meteor code*/

/*Useraccounts code*/
AccountsTemplates.addField({
    _id: 'account-type',
    type: 'radio',
    displayName: 'Account Type',
    select: [
      {
        value: 'educator',
        text: 'Educator'
      },
      {
        value: 'student',
        text: 'Student'
      }
    ],
    required: true,
});

Accounts.onCreateUser(function(options, user){
  user.profile.classList = [];
  if(options.account-type)
    user.profile.account-type = options.account-type;
});

AccountsTemplates.configure({
    onSubmitHook: function(error, state){
      if (!error) {
        if (state === "signIn") {
          // Successfully logged in
          // ...
        }
        if (state === "signUp") {
          // Successfully registered
          // ...
        }
      }
    }
});
