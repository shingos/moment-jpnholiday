Japanese Holiday
==================================================

### Usage

Works with AMD, CommonJS and browser environments.

```js
// AMD
define(['moment-jpnholiday'], function(moment) { moment().short() });
```

```js
// CommonJS
var moment = require('moment-jpnholiday');
moment().isJpnHolidayAndInLieu()
```

```html
<!-- Browser -->
<script type="text/javascript" src="/moment.js"></script>
<script type="text/javascript" src="/moment-jpnholiday.js"></script>
<script type="text/javascript">
    moment().isJpnHolidayAndInLieu();
</script>
```

Works on both past and future dates.

### Methods

#### `moment().isJpnHolidayAndInLieu()`

日本の祝日かどうか(振替休日や国民の休日を含む)を返します。
祝日の場合は祝日の名称を、そうでなければnullとなります。

__Examples:__

```js
moment(new Date('2018-02-11')).isJpnHolidayAndInLieu() // "建国記念の日"
moment(new Date('2018-02-12')).isJpnHolidayAndInLieu() // "振替休日"
moment(new Date('2018-02-13')).isJpnHolidayAndInLieu() // null
```

#### `moment().isJpnHoliday()`

日本の祝日かどうか(振替休日や国民の休日は含まない)を返します。
祝日の場合は祝日の名称を、そうでなければnullとなります。

__Examples:__

```js
moment(new Date('2018-02-11')).isJpnHoliday() // "建国記念の日"
moment(new Date('2018-02-12')).isJpnHoliday() // null
moment(new Date('2018-02-13')).isJpnHoliday() // null
```

