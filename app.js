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
    this.uniqueId = 0;


    try {
      if (process.env.DEBUG === '1') require('inspector').open(9222, '0.0.0.0', false);
    } catch (error) {

    }

    //#region Triggercards
    var triggers = this.triggers = [
      { id: 'trigger_none', deprecated:true },
      { id: 'trigger__text1_number1_boolean1' },
      { id: 'trigger__text3_number3_boolean3' },
      { id: 'trigger__text5_number5_boolean5' },
      { id: 'trigger__text10_number10_boolean10' }
    ];
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      const triggerCard = this.homey.flow.getTriggerCard(trigger.id);
      trigger.card = triggerCard;
      this.setCounts(trigger);
      
      triggerCard.registerRunListener((args, state, more) => { //async
        var defer = new Defer();
        var debounceMs = args.debounce_ms || 1000;
        var r= state.name.name == args.name.name && 
          (trigger.id.startsWith('trigger__text' + state.textCount + '_number' + state.numberCount + '_boolean' + state.booleanCount) || args.overloadable=='true');
          if(!r) return Promise.resolve(r);

          if(args.debounce && args.debounce!='none') {
            var event = trigger.events[args.name.name];
            if(event) {              
              //this.log('event.timer', event.timer);
              if(!event.debouncers) event.debouncers = [];
              var debouncers = event.debouncers;
              debouncers.push(defer);

              if(!event['debouncer_' + state.uniqueId]) event['debouncer_' + state.uniqueId] = [];
              event['debouncer_' + state.uniqueId].push(0);
              
              if(!event.timer && event['debouncer_' + state.uniqueId].length==event.arguments.length) {
                delete event['debouncer_' + state.uniqueId];

                var setTimeFuntion = ()=> {
                  event.timer = setTimeout(x=> {
                    this.log('Debounce Timer finished');
                    if(debouncers.length==0) {                        
                      event.timer = null;
                      return;
                    }
                    if(args.debounce.endsWith('finish')) {                      
                      debouncers[debouncers.length-1].resolve(true);
                      for (let i = 0; i < debouncers.length-1; i++) debouncers[i].resolve(false);
                      debouncers.length=0;
                    } else  {
                      for (let i = 0; i < debouncers.length; i++) debouncers[i].resolve(false);
                      debouncers.length=0;
                    }
                    setTimeFuntion();
                  }, debounceMs);//timeoutMs);
                };
                setTimeFuntion();    

                if(args.debounce.startsWith('executestart')) {
                  debouncers[0].resolve(true);
                  for (let i = 1; i < debouncers.length; i++) debouncers[i].resolve(false);
                  debouncers.length=0;
                }
              } else {
                if (args.debounce.endsWith('finish')) {
                  for (let i = 0; i < debouncers.length-1; i++) debouncers[i].resolve(false);
                  debouncers.splice(0,debouncers.length-1);
                }
              }
            }
          } else return Promise.resolve(r);// defer.resolve(r);
          //return r;
          //return Promise.resolve(r);//defer.promise;

          return defer.promise;
      });


      triggerCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        
        try {
          trigger.lastName = query;
          return await this.getEventNames({targetCard:trigger.actionCard, query:query, args:args});

        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });

      triggerCard.on("update", async () => {
        await this.setTrigger(trigger);
      });      
      
      await this.setTrigger(trigger);
    }
    //#endregion

    //#region Actioncards
    var actions = this.actions = [
      { id: 'action_none', deprecated:true },
      { id: 'action__text1_number1_boolean1' },
      { id: 'action__text5_number5_boolean5' },
      { id: 'action__text3_number3_boolean3' },
      { id: 'action__text10_number10_boolean10' }
    ];
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const actionCard = this.homey.flow.getActionCard(action.id);
      action.card = actionCard;
      this.setCounts(action);
      var triggername = action.id.replace('action_', 'trigger_');
      action.triggerCard = _.find(triggers, x=>{return x.id==triggername; });
      action.triggerCard.actionCard = action;
      actionCard.registerRunListener(((args, state, more) => { //async
        var defer = new Defer();
        try {
          console.log(action.id + '.registerRunListener args: ');
          console.log(args);
          var newArgs = { name: args.name };
          //var overloadable = args.overloadable;
          delete args.name;
          //delete args.overloadable;
          
          if(action.id=='action_none') {
            if (args.number === undefined) args.number = 0;
            if (args.boolean === undefined) args.boolean = false;
            if (args.text === undefined) args.text = "";
            action.triggerCard.card.trigger(args, newArgs).then((x, y) => {
              defer.resolve(true);
  
            }).catch(err => { defer.reject(err); });
          } else if(action.id.startsWith('action__')) {
            var promises = [];
            var triggerCards = _.filter(this.triggers, x=>{return !x.deprecated && x.textCount>=action.triggerCard.textCount && x.numberCount>=action.triggerCard.numberCount && x.booleanCount>=action.triggerCard.booleanCount;});
            for (let i = 0; i < triggerCards.length; i++) {
              const triggerCard = triggerCards[i];              
              for (let j = 1; j <= triggerCard.textCount; j++) if (args['text'+j.toString()] === undefined) args['text'+j.toString()] = "";
              for (let j = 1; j <= triggerCard.numberCount; j++) if (args['number'+j.toString()] === undefined) args['number'+j.toString()] = 0;
              for (let j = 1; j <= triggerCard.booleanCount; j++) if (args['boolean'+j.toString()] === undefined) args['boolean'+j.toString()] = false;
              // if((action.textCount>triggerCard.textCount || action.numberCount>triggerCard.numberCount || action.booleanCount>triggerCard.booleanCount) && args.overloadable!='true') ;
              //   else 
              promises.push(triggerCard.card.trigger(args, {name:newArgs.name, textCount:action.textCount, numberCount:action.numberCount, booleanCount:action.booleanCount, uniqueId:this.uniqueId++}));
            }
            if(args.waittofinish===false) defer.resolve(true);
            else Promise.all(promises)
              .then(x=> {defer.resolve(true);})
              .catch(err=> { defer.reject(err);});
          }
          
        } catch (error) {
          console.log('Error: ' + error);
          defer.reject(error);
        }
        return defer.promise;
      }).bind(this));

      actionCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        try {
          action.lastName = query;
          return await this.getEventNames({targetCard:action.triggerCard, query:query, args:args, isAction:true});
        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });
      
      actionCard.on("update", async () => {
        this.setArgumentValues(action, actionCard);
      });
      this.setArgumentValues(action, actionCard);
    }

    //#endregion
  }

  async setArgumentValues(cardObject, cardCard) {
    cardObject.argumentValues = await cardCard.getArgumentValues(); 
  }

  async setTrigger(trigger) {
    await this.setArgumentValues(trigger, trigger.card);
    if(!trigger.events) trigger.events = {};
    trigger.events = {};
      
    for (let i = 0; i < trigger.argumentValues.length; i++) {
      const argumentValue = trigger.argumentValues[i];
      if(!trigger.events[argumentValue.name.name]) trigger.events[argumentValue.name.name] = {name : argumentValue.name.name, arguments : [argumentValue]};
      else {
        var event = trigger.events[argumentValue.name.name];
        if(argumentValue.debounce && argumentValue.debounce!='none') {
          if(event.debounce) ; //ALERT that this will not work correctly.
          event.debounce = argumentValue.debounce;
        } 
        event.arguments.push(argumentValue);
      }
    }
  }

  setCounts(card) {
    card.textCount = card.numberCount = card.booleanCount = 0;
      var arrArgumentTypes = card.id.split('_');
      for (let i = 2; i < arrArgumentTypes.length; i++) {
        const type = arrArgumentTypes[i];
        if(type.startsWith('text')) card.textCount = Number.parseInt(type.replace('text',''));
        else if(type.startsWith('number')) card.numberCount = Number.parseInt(type.replace('number',''));
        else if(type.startsWith('boolean')) card.booleanCount = Number.parseInt(type.replace('boolean',''));    
      }
  }

  async getEventNames({targetCard, query, args, isAction=false} = {}) {
    var _return = query && query!='' && query.trim()!='' ? [{ name: query, description:this.homey.__("return_description_create") }] : [];
    var cards = [];
    if(isAction)cards = _.filter(this.triggers, x=>{return !x.deprecated && x.textCount>=targetCard.textCount && x.numberCount>=targetCard.numberCount && x.booleanCount>=targetCard.booleanCount;});
    else if(!isAction && args.overloadable=='true') cards = _.filter(this.actions, x=>{return !x.deprecated && x.textCount<=targetCard.textCount && x.numberCount<=targetCard.numberCount && x.booleanCount<=targetCard.booleanCount;});
    else cards.push(targetCard);
    for (let iCards = 0; iCards < cards.length; iCards++) {
      const card = cards[iCards];      
      if (card.lastName && (!isAction || card==targetCard)) {
        var o = null;
        if(!(o=_.find(_return, x=>{return x.name==card.lastName;}))) _return.push({ name: card.lastName, description:this.homey.__("return_description_select") });
        else o.description = this.homey.__("return_description_select");
      }
    }
    for (let iCards = 0; iCards < cards.length; iCards++) {
      const card = cards[iCards];      
      for (let i = 0; i < card.argumentValues.length; i++) {
        const element = card.argumentValues[i];
        if(isAction && (card.textCount>targetCard.textCount || card.numberCount>targetCard.numberCount || card.booleanCount>targetCard.booleanCount) && element.overloadable!='true') continue;
        else if(!isAction && (card.textCount<targetCard.textCount || card.numberCount<targetCard.numberCount || card.booleanCount<targetCard.booleanCount) && (!args || args.overloadable!='true')) continue;
        if(query && query!='') {
          if(element.name.name.indexOf(query) > -1) {
            var o = null;          
            if(!(o =_.find(_return, x=>{return x.name==element.name.name;})))
              _return.push({ name: element.name.name, description:this.homey.__("return_description_select") });
            else o.description = this.homey.__("return_description_select");
          }
        } 
        else {
          var o = null;          
          if(!(o =_.find(_return, x=>{return x.name==element.name.name;})))
              _return.push({ name: element.name.name, description:this.homey.__("return_description_select") });
            else o.description = this.homey.__("return_description_select");
          //if(!_.find(_return, x=>{return x.name==element.name.name;})) _return.push({ name: element.name.name, description:this.homey.__("return_description_select") });
        }
      }
    }
    return _return;
  }
}

module.exports = MyApp;
