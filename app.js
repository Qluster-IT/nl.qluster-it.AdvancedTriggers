'use strict';

const Homey = require('homey');
const { Defer } = require('./lib/proto');
//const _ = require('lodash');

class MyApp extends Homey.App {
  static get lastName() { return this._lastName;}
  static set lastName(value) { this._lastName = value;}
  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('AdvancedTriggers has been initialized');
    this.lastName = null;
    

    try {
      if (process.env.DEBUG === '1') require('inspector').open(9222, '0.0.0.0', false);
    } catch (error) {

    }

    var triggers = [
      { id: 'trigger_none' }
    ];
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      const triggerCard = this.homey.flow.getTriggerCard(trigger.id);
      trigger.card = triggerCard;
      //triggerCard.manifest
      triggerCard.registerRunListener(async (args, state, more) => { //async
        return state.name.name==args.name.name;
      });


      triggerCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        try {
          this.lastName = query;
          return [{ name: query }];

        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });
    }
    

    var actions = [
      { id: 'action_none' }
    ];
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const actionCard = this.homey.flow.getActionCard(action.id);
      action.card = actionCard;
      actionCard.registerRunListener(((args, state, more) => { //async
        var defer = new Defer();
        try {
          //if(!args.device || !args.text) return false;
          console.log(action.id + '.registerRunListener args: ');
          console.log(args);
          var newArgs = {name:args.name};
          delete args.name;
          if(args.number===undefined) args.number=0;
          if(args.boolean===undefined) args.boolean=false;
          if(args.text===undefined) args.text="";
          triggers[0].card.trigger(args, newArgs).then((x,y)=> {
            defer.resolve(true);
          
          }).catch(err=> {defer.reject(err);});

          // var a = arguments;
          // var b = a.callee();
        } catch (error) {
          console.log('Error: ' + error);
        }
        return defer.promise;
      }).bind(this));

      actionCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        try {
          var _return = [];
          var a = await triggers[0].card.getArgumentValues();
          for (let i = 0; i < a.length; i++) {
            const element = a[i];
            if(!query || query=='' || element.name.name.indexOf(query)>-1)_return.push({name:element.name.name});
          }
          if(this.lastName) _return.push({name:this.lastName});


          return _return;
        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });
    }
  }

}

module.exports = MyApp;
