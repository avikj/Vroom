

//Class stuff
Classes = new Mongo.Collection('classes');

/*Routing*/
Router.route('/', {
    name: 'home',
    template: 'home'
});
Router.route('create-class');
Router.route('/account', {
    name: 'account',
    template: 'account'
});

Router.route('/class/:id', {
  name: 'classPage',
  template: 'classPage',
  data: function(){
    var temp = Classes.findOne({_id: this.params.id});
    Meteor.call('log', temp.className);
    return temp;
  }
})
/*/Routing*/

/*Main meteor code*/
if (Meteor.isClient) {
  Template.account.helpers({
    currentUserEmail: function(){
      return Meteor.user().emails[0].address;
    },
    isEducator: function(){
      console.log("called isEducator");
      if(Meteor.user().profile.accountType === "educator"){
        return true;
      }else{
        return false;
      }
    },
    myClasses: function(){
      return Classes.find({teacher: Meteor.user()._id});
    }
  });
  Template.account.events({
    "click #logout":function(){
      Meteor.logout();
    }
  });
  Template.createClass.helpers({
    isEducator: function(){
      if(Meteor.user().profile.accountType === "educator"){
        return true;
      }else{
        return false;
      }
    },

  });
  Template.createClass.events({
    "click #submitForm": function(){
      console.log('submitForm clicked');
      if($("#class-name").val() && $("#description").val() && $("#target-grade").val() && $("#target-grade").val()){
          var id = Classes.insert({
          teacher: Meteor.userId(),
          members: [],
          className: $("#class-name").val(),
          description: $("#description").val(),
          targetGrade: $("#target-grade").val(),
          subject_category: $("#subject_category").val()
        });
        Router.go('/class/'+id);
      }else{
        Meteor.call('failed to create class');
      }

    }
  });
}
if (Meteor.isServer) {
  Meteor.methods({
    'log': function(data){
      console.log(data);
    }
  });
}
/*/Main meteor code*/

/*Useraccounts code*/
AccountsTemplates.addField({
    _id: 'accountType',
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
  if(!user.profile)
    user.profile = {};
  user.profile.classList = [];
  user.profile.accountType = options.profile.accountType;
  return user;
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
