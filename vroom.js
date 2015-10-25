

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
    var temp = Classes.find({_id: this.params.id}).fetch()[0];
    return temp;
  }
});
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
    myTeacherClasses: function(){
      return Classes.find({teacher: Meteor.user()._id});
    },
    myStudentClasses: function(){
      var result = [];
      var allClasses = Classes.find();
      for(var i = 0; i < allClasses.length; i++){
        if(Meteor.user()._id in elem.members){
          result.push(elem);
        }
      }
      return result;
    },
    CSclasses: function(){
      return Classes.find({subject_category: "cs"}).fetch();
    },
    Mathclasses: function(){
      return Classes.find({subject_category: "math"}).fetch();
    },
    Sciclasses: function(){
      return Classes.find({subject_category: "sci"}).fetch()
    },

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
        Meteor.log('failed to create class');
      }

    }
  });
  Template.classPage.helpers({
    'shouldShowButton':function(){

      if(this &&Meteor.user() && Meteor.user().profile.accountType === 'student' && !(Meteor.user()._id in this.members))
        return true;
      else
        return false;
    }
  });
  Template.classPage.events({
    "click #join-button":function(){
      console.log(this.members);
      Classes.update({_id: this._id}, { $push: { members: Meteor.user()._id} });
      console.log(this.members);
      Materialize.toast('Successfully joined class!', 4000);
      Router.go('/account');
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
    _id: 'full_name',
    type: 'text',
    displayName: 'Full Name',
    required: true,
});

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
