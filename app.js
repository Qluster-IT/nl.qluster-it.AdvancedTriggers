'use strict';

const Homey = require('homey');
const { Defer } = require('./lib/proto');
const _ = require('lodash');

class MyApp extends Homey.App {
  static get lastName() { return this._lastName; }
  static set lastName(value) { this._lastName = value; }
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
      { id: 'trigger_none' },
      { id: 'trigger__text1_number1_boolean1' },
      { id: 'trigger__text3_number3_boolean3' },
      { id: 'trigger__text5_number5_boolean5' },
      { id: 'trigger__text10_number10_boolean10' }
    ];
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      const triggerCard = this.homey.flow.getTriggerCard(trigger.id);
      trigger.card = triggerCard;
      //triggerCard.manifest
      triggerCard.registerRunListener(async (args, state, more) => { //async
        return state.name.name == args.name.name;
      });


      triggerCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        try {
          trigger.lastName = query;
          //return query && query!='' ? [{ name: query }] : [];
          return await this.getEventNames({targetCard:trigger.actionCard, query:query});

        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });
    }


    var actions = [
      { id: 'action_none' },
      { id: 'action__text1_number1_boolean1' },
      { id: 'action__text5_number5_boolean5' },
      { id: 'action__text3_number3_boolean3' },
      { id: 'action__text10_number10_boolean10' }
    ];
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const actionCard = this.homey.flow.getActionCard(action.id);
      action.card = actionCard;
      var triggername = action.id.replace('action_', 'trigger_');
      action.triggerCard = _.find(triggers, x=>{return x.id==triggername; });
      action.triggerCard.actionCard = action;
      actionCard.registerRunListener(((args, state, more) => { //async
        var defer = new Defer();
        try {
          console.log(action.id + '.registerRunListener args: ');
          console.log(args);
          var newArgs = { name: args.name };
          delete args.name;
          if(action.id=='action_none') {
            if (args.number === undefined) args.number = 0;
            if (args.boolean === undefined) args.boolean = false;
            if (args.text === undefined) args.text = "";
          } else if(action.id.startsWith('action__')) {
            var arrArgumentTypes = action.id.split('_');
            for (let i = 2; i < arrArgumentTypes.length; i++) {
              const type = arrArgumentTypes[i];
              if(type.startsWith('text')) {
                var count = Number.parseInt(type.replace('text',''));
                for (let j = 1; j <= count; j++) if (args['text'+j.toString()] === undefined) args['text'+j.toString()] = "";                
              } else if(type.startsWith('number')) {
                var countnumber = Number.parseInt(type.replace('number',''));
                for (let j = 1; j <= countnumber; j++) if (args['number'+j.toString()] === undefined) args['number'+j.toString()] = 0;         
              } else if(type.startsWith('boolean')) {
                var countboolean = Number.parseInt(type.replace('boolean',''));
                for (let j = 1; j <= countboolean; j++) if (args['boolean'+j.toString()] === undefined) args['boolean'+j.toString()] = false;                
              }              
            }
          }
          action.triggerCard.card.trigger(args, newArgs).then((x, y) => {
            defer.resolve(true);

          }).catch(err => { defer.reject(err); });
        } catch (error) {
          console.log('Error: ' + error);
        }
        return defer.promise;
      }).bind(this));

      actionCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        try {
          action.lastName = query;
          return await this.getEventNames({targetCard:action.triggerCard, query:query});
          // var _return = [];          
          // if (action.triggerCard.lastName) _return.push({ name: action.triggerCard.lastName });
          // var a = await action.triggerCard.card.getArgumentValues();
          // for (let i = 0; i < a.length; i++) {
          //   const element = a[i];
          //   if (!query || query == '' || element.name.name.indexOf(query) > -1) _return.push({ name: element.name.name });
          // }
          // return _return;
        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });
    }
  }

  async getEventNames({targetCard, query} = {}) {
    var _return = query && query!='' && query.trim()!='' ? [{ name: query }] : [];
    if (targetCard.lastName && targetCard.lastName!=query) _return.push({ name: targetCard.lastName });
    var a = await targetCard.card.getArgumentValues();
    for (let i = 0; i < a.length; i++) {
      const element = a[i];
      if ((!query || query == '' || element.name.name.indexOf(query) > -1) && element.name.name!=query && (!targetCard.lastName || element.name.name!=targetCard.lastName) && !_.find(_return, x=>{return x.name==element.name.name;})) _return.push({ name: element.name.name });
    }
    return _return;//_.uniqBy(_return,'name');
  }
}

module.exports = MyApp;
