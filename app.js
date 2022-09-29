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
      { id: 'trigger_none', deprecated: true },
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
        const defer = new Defer();
        const debounceMs = args.debounce_ms || 1000;
        const r = state.name.name == args.name.name &&
          (trigger.id.startsWith('trigger__text' + state.textCount + '_number' + state.numberCount + '_boolean' + state.booleanCount) || args.overloadable == 'true');
        if (!r) return Promise.resolve(r);

        if (args.debounce && args.debounce != 'none') {
          const event = trigger.events[args.name.name];
          if (event) {
            if (!event.debouncers) event.debouncers = [];
            if (args.debounce === 'sequential' && event.promises && event.promises[trigger.id]) {
              if(event.promises[trigger.id].length>1) {
              //  if(event.promises[trigger.id].length) {
                  let debouncerIndex = _.findIndex(event.promises[trigger.id], d=>d!==null);
                  let promise = event.promises[trigger.id][debouncerIndex];
                  event.promises[trigger.id][debouncerIndex] = null;
                  promise.then(()=> {
                    //debouncers.shift();
                    defer.resolve(true);
                  }).catch(()=> { 
                    //debouncers.shift();
                    defer.resolve(true);
                  });
              //  }
              } else {
                //event.promises[trigger.id][0] = null;
                defer.resolve(true);
              }

            } else {
              const debouncers = event.debouncers;
              debouncers.push(defer);
              if (!event['debouncer_' + state.uniqueId]) event['debouncer_' + state.uniqueId] = [];
              event['debouncer_' + state.uniqueId].push(0);


              this.log('try debounce: event.timer', !!event.timer, "event[debouncer_id]:", event['debouncer_' + state.uniqueId], "event.arguments", event.arguments.length);
              if (!event.timer && event['debouncer_' + state.uniqueId].length == event.arguments.length) {
                delete event['debouncer_' + state.uniqueId];

                var setTimeFuntion = () => {
                  // if(args.debounce==='executestart' && debouncers.length) {
                  //     debouncers[0].resolve(true);
                  //     for (let i = 1; i < debouncers.length; i++) debouncers[i].resolve(false);
                  //     debouncers.length=0;
                  // } 
                  event.timer = setTimeout(x => {
                    this.log('Debounce Timer finished, debouncers.length = ', debouncers.length);
                    if (debouncers.length == 0) {
                      event.timer = null;
                      return;
                    }
                    // if(args.debounce.startsWith('executestart')) {
                    //   debouncers[0].resolve(true);
                    //   for (let i = 1; i < debouncers.length; i++) debouncers[i].resolve(false);
                    //   debouncers.length=0;
                    // } else 
                    if (args.debounce.endsWith('finish')) {
                      debouncers[debouncers.length - 1].resolve(true);
                      for (let i = 0; i < debouncers.length - 1; i++) debouncers[i].resolve(false);
                      debouncers.length = 0;
                      setTimeFuntion();
                    } else {
                      for (let i = 0; i < debouncers.length; i++) debouncers[i].resolve(false);
                      debouncers.length = 0;
                      event.timer = null;
                    }
                    // if(args.debounce!=='executestart') 
                    // else event.timer = null;
                  }, debounceMs);//timeoutMs);
                };
                setTimeFuntion();
                this.log('Execute the first one!');

                if (args.debounce.startsWith('executestart')) {
                  debouncers[0].resolve(true);
                  for (let i = 1; i < debouncers.length; i++) debouncers[i].resolve(false);
                  debouncers.length = 0;
                }
              } else {
                this.log('ELSE: ', args.text1);
                if (args.debounce.endsWith('finish')) {
                  for (let i = 0; i < debouncers.length - 1; i++) debouncers[i].resolve(false);
                  debouncers.splice(0, debouncers.length - 1);
                }
              }
            }
          }
        } else return Promise.resolve(r);

        return defer.promise;
      });


      triggerCard.getArgument('name').registerAutocompleteListener(async (query, args) => {

        try {
          trigger.lastName = query;
          return await this.getEventNames({ targetCard: trigger.actionCard, query: query, args: args });

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
      { id: 'action_none', deprecated: true },
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
      action.triggerCard = _.find(triggers, x => { return x.id == triggername; });
      action.triggerCard.actionCard = action;
      actionCard.registerRunListener(((args, state, more) => { //async
        var defer = new Defer();
        try {
          //console.log(action.id + '.registerRunListener args: ');
          //console.log(args);
          let newArgs = { name: args.name || { name: args.namebytag } };
          delete args.name;

          if (action.id == 'action_none') {
            if (args.number === undefined) args.number = 0;
            if (args.boolean === undefined) args.boolean = false;
            if (args.text === undefined) args.text = "";
            action.triggerCard.card.trigger(args, newArgs).then((x, y) => {
              defer.resolve(true);

            }).catch(err => { defer.reject(err); });
          } else if (action.id.startsWith('action__')) {
            if (!this.returns) this.returns = {};
            if (!this.returns[newArgs.name.name]) this.returns[newArgs.name.name] = { count: 0, list: {} };
            args.flowexecutionid = this.returns[newArgs.name.name].count += 1;
            let recievedTokens;
            if (args.waittofinish !== false) {
              this.returns[newArgs.name.name].list[this.returns[newArgs.name.name].count] = new Defer();
              this.returns[newArgs.name.name].list[this.returns[newArgs.name.name].count].then(x => { if (recievedTokens === undefined) recievedTokens = x; });

            }
            const event = action.triggerCard.events[newArgs.name.name];
            if (event && event.debounce==='sequential') {
              if (!event.promises) event.promises = [];
            }
            var promises = [];
            var triggerCards = _.filter(this.triggers, x => { return !x.deprecated && x.textCount >= action.triggerCard.textCount && x.numberCount >= action.triggerCard.numberCount && x.booleanCount >= action.triggerCard.booleanCount; });
            for (let i = 0; i < triggerCards.length; i++) {
              const triggerCard = triggerCards[i];
              for (let j = 1; j <= triggerCard.textCount; j++) if (args['text' + j.toString()] === undefined) args['text' + j.toString()] = "";
              for (let j = 1; j <= triggerCard.numberCount; j++) if (args['number' + j.toString()] === undefined) args['number' + j.toString()] = 0;
              for (let j = 1; j <= triggerCard.booleanCount; j++) if (args['boolean' + j.toString()] === undefined) args['boolean' + j.toString()] = false;
              const p = triggerCard.card.trigger(args, { name: newArgs.name, textCount: action.textCount, numberCount: action.numberCount, booleanCount: action.booleanCount, uniqueId: this.uniqueId++ });
              promises.push(p);
              if (event && event.promises) {
                if(!event.promises[triggerCard.id]) event.promises[triggerCard.id] = [];
                event.promises[triggerCard.id].push(p);
                p.then(()=> {event.promises[triggerCard.id].shift(); }).catch(()=> { event.promises[triggerCard.id].shift();} );              
              }
            }
            let tokens = {};
            for (let j = 1; j <= 10; j++) if (tokens['text' + j.toString()] === undefined) tokens['text' + j.toString()] = "";
            for (let j = 1; j <= 10; j++) if (tokens['number' + j.toString()] === undefined) tokens['number' + j.toString()] = 0;
            for (let j = 1; j <= 10; j++) if (tokens['boolean' + j.toString()] === undefined) tokens['boolean' + j.toString()] = false;

            if (args.waittofinish === false) {
              defer.resolve(tokens);
              delete this.returns[newArgs.name.name].list[this.returns[newArgs.name.name].count];
            }
            else {

              Promise.all(promises)
                .then(x => {
                  let a = recievedTokens;
                  defer.resolve(recievedTokens || tokens);
                  delete this.returns[newArgs.name.name].list[this.returns[newArgs.name.name].count];
                })
                .catch(err => {
                  defer.reject(err);
                  delete this.returns[newArgs.name.name].list[this.returns[newArgs.name.name].count];
                });
            }
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
          return await this.getEventNames({ targetCard: action.triggerCard, query: query, args: args, isAction: true });
        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });

      actionCard.on("update", async () => {
        this.setArgumentValues(action, actionCard);
      });
      this.setArgumentValues(action, actionCard);
    }

    //#endregion

    //#region Returncards
    var returns = this._returns = [
      { id: 'return__text1_number1_boolean1' },
      { id: 'return__text5_number5_boolean5' },
      { id: 'return__text3_number3_boolean3' },
      { id: 'return__text10_number10_boolean10' }
    ];
    for (let i = 0; i < returns.length; i++) {
      const _return = returns[i];
      const returnCard = this.homey.flow.getActionCard(_return.id);
      _return.card = returnCard;
      this.setCounts(_return);
      let triggername = _return.id.replace('return_', 'trigger_');
      _return.triggerCard = _.find(triggers, x => { return x.id == triggername; });
      _return.triggerCard.returnCard = _return;
      returnCard.registerRunListener(((args, state, more) => { //async
        var defer = new Defer();
        try {
          console.log(_return.id + '.registerRunListener args: ');
          console.log(args);
          //delete args.name;
          let tokens = args;
          // var newArgs = { name: args.name };
          for (let j = 1; j <= 10; j++) if (tokens['text' + j.toString()] === undefined) tokens['text' + j.toString()] = "";
          for (let j = 1; j <= 10; j++) if (tokens['number' + j.toString()] === undefined) tokens['number' + j.toString()] = 0;
          for (let j = 1; j <= 10; j++) if (tokens['boolean' + j.toString()] === undefined) tokens['boolean' + j.toString()] = false;
          if (args.flowexecutionid && this.returns[args.name.name] && this.returns[args.name.name].list[args.flowexecutionid]) this.returns[args.name.name].list[args.flowexecutionid].resolve(tokens);
          defer.resolve(tokens);

        } catch (error) {
          console.log('Error: ' + error);
          defer.reject(error);
        }
        return defer.promise;
      }).bind(this));

      returnCard.getArgument('name').registerAutocompleteListener(async (query, args) => {
        try {
          _return.lastName = query;
          return await this.getEventNames({ targetCard: _return.triggerCard, query: query, args: args, isAction: true });
        } catch (error) { this.error('trigger.name.registerAutocompleteListener.error :', error); throw error; }
      });

      returnCard.on("update", async () => {
        this.setArgumentValues(_return, returnCard);
      });
      this.setArgumentValues(_return, returnCard);
    }

    //#endregion
  }

  async setArgumentValues(cardObject, cardCard) {
    cardObject.argumentValues = await cardCard.getArgumentValues();
  }

  async setTrigger(trigger) {
    await this.setArgumentValues(trigger, trigger.card);
    if (!trigger.events) trigger.events = {};
    trigger.events = {};

    for (let i = 0; i < trigger.argumentValues.length; i++) {
      const argumentValue = trigger.argumentValues[i];
      if (!trigger.events[argumentValue.name.name]) trigger.events[argumentValue.name.name] = { name: argumentValue.name.name, arguments: [argumentValue], debounce: argumentValue.debounce};
      else {
        var event = trigger.events[argumentValue.name.name];
        if (argumentValue.debounce && argumentValue.debounce != 'none') {
          if (event.debounce); //ALERT that this will not work correctly.
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
      if (type.startsWith('text')) card.textCount = Number.parseInt(type.replace('text', ''));
      else if (type.startsWith('number')) card.numberCount = Number.parseInt(type.replace('number', ''));
      else if (type.startsWith('boolean')) card.booleanCount = Number.parseInt(type.replace('boolean', ''));
    }
  }

  async getEventNames({ targetCard, query, args, isAction = false } = {}) {
    var _return = query && query != '' && query.trim() != '' ? [{ name: query, description: this.homey.__("return_description_create") }] : [];
    var cards = [];
    if (isAction) cards = _.filter(this.triggers, x => { return !x.deprecated && x.textCount >= targetCard.textCount && x.numberCount >= targetCard.numberCount && x.booleanCount >= targetCard.booleanCount; });
    else if (!isAction && args.overloadable == 'true') cards = _.filter(this.actions, x => { return !x.deprecated && x.textCount <= targetCard.textCount && x.numberCount <= targetCard.numberCount && x.booleanCount <= targetCard.booleanCount; });
    else cards.push(targetCard);
    for (let iCards = 0; iCards < cards.length; iCards++) {
      const card = cards[iCards];
      if (card.lastName && (!isAction || card == targetCard)) {
        var o = null;
        if (!(o = _.find(_return, x => { return x.name == card.lastName; }))) _return.push({ name: card.lastName, description: this.homey.__("return_description_select") });
        else o.description = this.homey.__("return_description_select");
      }
    }
    for (let iCards = 0; iCards < cards.length; iCards++) {
      const card = cards[iCards];
      for (let i = 0; i < card.argumentValues.length; i++) {
        const element = card.argumentValues[i];
        if (!element.name) continue;
        if (isAction && (card.textCount > targetCard.textCount || card.numberCount > targetCard.numberCount || card.booleanCount > targetCard.booleanCount) && element.overloadable != 'true') continue;
        else if (!isAction && (card.textCount < targetCard.textCount || card.numberCount < targetCard.numberCount || card.booleanCount < targetCard.booleanCount) && (!args || args.overloadable != 'true')) continue;
        if (query && query != '') {
          if (element.name.name.indexOf(query) > -1) {
            let o = null;
            if (!(o = _.find(_return, x => { return x.name == element.name.name; })))
              _return.push({ name: element.name.name, description: this.homey.__("return_description_select") });
            else o.description = this.homey.__("return_description_select");
          }
        }
        else {
          let o = null;
          if (!(o = _.find(_return, x => { return x.name == element.name.name; })))
            _return.push({ name: element.name.name, description: this.homey.__("return_description_select") });
          else o.description = this.homey.__("return_description_select");
          //if(!_.find(_return, x=>{return x.name==element.name.name;})) _return.push({ name: element.name.name, description:this.homey.__("return_description_select") });
        }
      }
    }
    return _return;
  }
}

module.exports = MyApp;
