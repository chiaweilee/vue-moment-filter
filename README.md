# vue-moment-filter

[![Greenkeeper badge](https://badges.greenkeeper.io/chiaweilee/vue-moment-filter.svg)](https://greenkeeper.io/)

Vue moment filter

### Install
> npm install vue-moment-filter

### Usage
```javascript
/** moment **/
import moment from 'vue-moment-filter'
Vue.use(moment, 'en') // lang
```
```javascript
this.moment()
```
```javascript
{{ new Date() | moment("YYYY/M/D HH:mm") }}
```
