(function () {
  
	// 固定祝日かどうか
	var _fixed = function(month, date, start, end, name) {
		if (!_isWithinYear(this, start, end)) return false;
		else if (this.month() !== month) return false;
		else if (this.date() != date) return false;
		return name;
  }
  
	// 移動祝日
	var _monday = function(month, week, start, end, name) {
		if (!_isWithinYear(this, start, end)) return false;
    else if (this.month() !== month) return false;
    
		// 第*月曜日の日付を求める
		var w = 1; // 月曜日固定
		var d1 = this.clone().startOf('month');
		var w1 = d1.day();
		let dx = (w - w1 < 0) ? 7 + w - w1 : w - w1;
		dx = ++dx + (7 * (week - 1));

		if (this.date() != dx) return false;
		return name;
  }
  
	// 春分の日
	var _spring = function(month, day, start, end, name) {
		if (!_isWithinYear(this, start, end)) return false;
    else if (this.month() !== month) return false;

		var year = this.year();
		let dx = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));

		if (this.date() != dx) return false;
		return name;
	}

	// 秋分の日
	var _autumn = function(month, day, start, end, name) {
		if (!_isWithinYear(this, start, end)) return false;
    else if (this.month() !== month) return false;

		var year = this.year();
		let dx = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));

		if (this.date() != dx) return false;
		return name;
  }
  
	// 年が祝日適用範囲内であるか
	var _isWithinYear = function(datetime, start, end) {
		return !(!moment.isMoment(datetime) || datetime.year() < start || end < datetime.year());
  }

	var HOLIDAYS = [
		// 種別, 月(-1), 日or週, 開始年, 終了年, 祝日名
		{method: _fixed,  month:  0, date:  1, startYear: 1949, endYear: 9999, label: '元日'},
		{method: _fixed,  month:  0, date: 15, startYear: 1949, endYear: 1999, label: '成人の日'},
		{method: _monday, month:  0, date:  2, startYear: 2000, endYear: 9999, label: '成人の日'},
		{method: _fixed,  month:  1, date: 11, startYear: 1967, endYear: 9999, label: '建国記念の日'},
		{method: _spring, month:  2, date:  0, startYear: 1949, endYear: 9999, label: '春分の日'},
		{method: _fixed,  month:  3, date: 29, startYear: 1949, endYear: 1989, label: '天皇誕生日'},
		{method: _fixed,  month:  3, date: 29, startYear: 1990, endYear: 2006, label: 'みどりの日'},
		{method: _fixed,  month:  3, date: 29, startYear: 2007, endYear: 9999, label: '昭和の日'},
		{method: _fixed,  month:  4, date:  3, startYear: 1949, endYear: 9999, label: '憲法記念日'},
		{method: _fixed,  month:  4, date:  4, startYear: 1988, endYear: 2006, label: '国民の休日'},
		{method: _fixed,  month:  4, date:  4, startYear: 2007, endYear: 9999, label: 'みどりの日'},
		{method: _fixed,  month:  4, date:  5, startYear: 1949, endYear: 9999, label: 'こどもの日'},
		{method: _monday, month:  6, date:  3, startYear: 2003, endYear: 9999, label: '海の日'},
		{method: _fixed,  month:  6, date: 20, startYear: 1996, endYear: 2002, label: '海の日'},
		{method: _fixed,  month:  7, date: 11, startYear: 2016, endYear: 9999, label: '山の日'},
		{method: _autumn, month:  8, date:  0, startYear: 1948, endYear: 9999, label: '秋分の日'},
		{method: _fixed,  month:  8, date: 15, startYear: 1966, endYear: 2002, label: '敬老の日'},
		{method: _monday, month:  8, date:  3, startYear: 2003, endYear: 9999, label: '敬老の日'},
		{method: _fixed,  month:  9, date: 10, startYear: 1966, endYear: 1999, label: '体育の日'},
		{method: _monday, month:  9, date:  2, startYear: 2000, endYear: 9999, label: '体育の日'},
		{method: _fixed,  month: 10, date:  3, startYear: 1948, endYear: 9999, label: '文化の日'},
		{method: _fixed,  month: 10, date: 23, startYear: 1948, endYear: 9999, label: '勤労感謝の日'},
		{method: _fixed,  month: 11, date: 23, startYear: 1989, endYear: 9999, label: '天皇誕生日'},
		// 以下、1年だけの祝日
		{method: _fixed,  month:  3, date: 10, startYear: 1959, endYear: 1959, label: '皇太子明仁親王の結婚の儀'},
		{method: _fixed,  month:  1, date: 24, startYear: 1989, endYear: 1989, label: '昭和天皇の大喪の礼'},
		{method: _fixed,  month: 10, date: 12, startYear: 1990, endYear: 1990, label: '即位礼正殿の儀'},
		{method: _fixed,  month:  5, date:  9, startYear: 1993, endYear: 1993, label: '皇太子徳仁親王の結婚の儀'}
  ];
  
  initialize = function (moment) {

	  // 祝日かどうか
    moment.fn.isJpnHolidayAndInLieu = function () {
      // 設定された休日
      let res = this.isJpnHoliday();
      if (res) return res;
  
      // 振替休日
      res = this.isJpnHolidayInLieu();
      if (res) return res;
  
      // 国民の休日
      res = this.isJpnNationalHoliday();
      return res;
    };

    // 設定された休日のみ
    // 国民の休日と振替休日はチェックしない
    moment.fn.isJpnHoliday = function () {
      
      let result = null;

      // 全ての祝日を判定
      HOLIDAYS.forEach(function(item) {
        if (result) return;
        res = item.method.apply(this, [item.month, item.date, item.startYear, item.endYear, item.label]);
        if (res) result = res;
      });

      return result;
    };

    // 振替休日
    moment.fn.isJpnHolidayInLieu = function () {
      let now = this.clone();

      // 施行日
      if (now.diff('1973-04-12') < 0) return null;

      // 当日が祝日の場合はfalse
      if (now.isJpnHoliday()) return null;

      let result = null;
      let num = (now.year() <= 2006) ? 1 : 7; //改正法なら最大7日間遡る

      now.add(-1, 'days');
      let lieu = false;

      for (let i = 0; i < num ; i++) {
        if (now.isJpnHoliday()) {
          // 祝日かつ日曜ならば振替休日
          if (now.day() === 0) {
            lieu = true;
            break;
          }
          now.add(-1, 'days');
        }
        else {
          break;
        }
      }

      return lieu ? '振替休日' : null;
    };

    // 国民の休日かどうか
    moment.fn.isJpnNationalHoliday = function () {
      let now = this.clone();
      
      // 施行日
      if (now.diff('2003-01-01') < 0) return null;

      before = this.clone().add(-1, 'day');
      if (!before.isJpnHoliday()) return null;

      after = this.clone().add(1, 'day');
      if (!after.isJpnHoliday()) return null;

      return '国民の休日';
    };

    moment.locale('ja');
    return moment;
  };

  if (typeof define === 'function' && define.amd) {
    define('moment-jpnholiday', ['moment'], function (moment) {
      return this.moment = initialize(moment);
    });
  } else if (typeof module !== 'undefined') {
    module.exports = initialize(require('moment'));
  } else if (typeof window !== "undefined" && window.moment) {
    this.moment = initialize(this.moment);
  }
}).call(this);
