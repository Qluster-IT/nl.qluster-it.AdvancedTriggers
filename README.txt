Trigger and action cards with eventname for Advanced Flows

Very lightweight app for adding multiple triggers with tags on a single flow, by adding an event name.
The flows can be triggered using optional arguments.
Just add a triggercard (When), set the name, and select it in the actioncard (Then).
Or add and actioncard (Then), set the name, and select it in the triggercard (When).

You can use overloading, meaning: A 5-Argument-When card can be selected and triggered with a 1-Argument-Then card.

Debounce can be set on triggers (When cards): meaning you can manage how many times and in what way flows get executed within a certain periode.
- Execute last one waiting after each [number of] ms.
- Execute at start, then allow execution after each [number of] ms.
- Execute at start, then allow execution after each [number of] ms, finish with last one waiting.

(Please note the extra delays during testing in Advanced Flows.)

These cards execute almost instantly, as suppose to the default Start-A-Flow cards half a second delay.