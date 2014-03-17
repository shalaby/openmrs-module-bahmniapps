'use strict';

Bahmni.Common.Util.DateUtil = {
	diffInDays: function (dateFrom, dateTo) {
		return Math.floor((dateTo - dateFrom) / (60 * 1000 * 60 * 24));
	},

	getDayNumber: function (referenceDate, date) {
		return this.diffInDays(this.getDate(referenceDate), this.getDate(date))  + 1;
	},

	getDate: function (dateTime) {
		return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
	},

	getCurrentDate: function(){
		return moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss") + "Z";
	},

	now: function(){
	    return new Date();
	},

	diffInYearsMonthsDays: function (dateFrom, dateTo) {
	    var from = {
	        d: dateFrom.getDate(),
	        m: dateFrom.getMonth() + 1,
	        y: dateFrom.getFullYear()
	    };

	    var to = {
	        d: dateTo.getDate(),
	        m: dateTo.getMonth() + 1,
	        y: dateTo.getFullYear()
	    };

	    var daysFebruary = to.y % 4 != 0 || (to.y % 100 == 0 && to.y % 400 != 0)? 28 : 29;
	    var daysInMonths = [0, 31, daysFebruary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	    if (to.d < from.d) {
	        to.d   += daysInMonths[parseInt(to.m - 1)];
	        from.m += 1;
	    }
	    if (to.m < from.m) {
	        to.m   += 12;
	        from.y += 1;
	    }

	    return {
	        days:   to.d - from.d,
	        months: to.m - from.m,
	        years:  to.y - from.y
	    };
	}
}