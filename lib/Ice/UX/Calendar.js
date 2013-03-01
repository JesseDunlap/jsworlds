var Calendar = function(year, month, options) {
	this.year			=	(year === undefined) ? new Date().getFullYear() : year;
	this.month			=	(month === undefined) ? new Date().getMonth() : month;
	this.options		=	(options === undefined) ? {} : options;
	this.events			=	{};

	this.addEvents = function(events) {
		var $this = this;

		events.forEach(function(e) {
			$this.addEvent(e);
		});
	}

	this.addEvent = function(e) {
		if (this.events[e.day] === undefined) this.events[e.day] = [];
		this.events[e.day].push(e);
	};

	this.getFirstDay = function(month, year) {
		var dateObj =  new Date();

		dateObj.setMonth(month);
		dateObj.setFullYear(year);
		dateObj.setDate(1);

		return dateObj.getDay();
	}

	this.toString = function() {
		var html = "";

		html += "<div class='ice-calendar'>";
		html += "    <strong>" + this.month + "</strong>";
		html += "    <table>";
		html += "		<thead>";
		html += "			<td>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td>";
		html += "		</thead>";
		html += "		<tbody>";

		var i = 1;

		var date = new Date(this.month + "-1-" + this.year);

		for (var week = 1; week <= 5; week++) {
			html += "    <tr>";

			if (week === 1) {
				for (var dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
					if (dayOfWeek >= date.getDay()) {
						html += "<td>" + i + "</td>";
						i++;
					}

					else {
						html += "<td></td>";
					}
				}
			}

			else {
				for (var dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
					html += "<td>" + i + "</td>";
					i++;
				}
			}

			html += "    </tr>";
		}

		html += "		</tbody>";
		html += "	</table>";
		html += "</div>";

		return html;
	};
};

module.exports = Calendar;