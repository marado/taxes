// This is more useful to me if we talk about monthly wages instead of yearly, sorry...
// Some data about wages in Portugal
var MINIMUM_MONTHLY_WAGE = 485;
var MINIMUM_YEARLY_WAGE  = MINIMUM_MONTHLY_WAGE * 14;

// First, I'll try to make a graph regarding how Portuguese IRS is collected nowadays
var steps = [];

steps.push({stop:4497,   tax:11.50}); 
steps.push({stop:7410,   tax:14   });
steps.push({stop:18375,  tax:24.50}); 
steps.push({stop:42259,  tax:35.50}); 
steps.push({stop:61244,  tax:38   });
steps.push({stop:66045,  tax:41   });
steps.push({stop:153300, tax:43.50}); 
steps.push({stop:null,   tax:46.50});   

// taxes in 2012
function taxes(max_monthly_wage, monthly_resolution) {
	// let's do math
	var taxes = [];
	var step = 0;
	for (var monthly_wage = 0; monthly_wage < max_monthly_wage; monthly_wage=monthly_wage+monthly_resolution) {
		while (steps[step].stop && steps[step].stop < (monthly_wage * 14)) {
			++step;
		}
		taxes.push({wage: monthly_wage, aftertax: (monthly_wage - (monthly_wage * steps[step].tax / 100))}); 
	}

	return table_draw(taxes);
}

function table_draw(taxes) {
	// let's show it!
	var tfoot = "<tfoot><tr>";
	var tbody = "<tbody><tr>";
	for (var i = 0; i < taxes.length; i++) {
		tfoot += "<th>"+taxes[i].wage+"</th>";
		tbody += "<td>"+taxes[i].aftertax+"</td>";
	}
	tfoot += "</tr></tfoot>";
	tbody += "</tr></tbody>";
	return tfoot + tbody;
}

// how I would like taxes to be
function proposal(max_monthly_wage, monthly_resolution, tax) {
	// math
	var taxes = [];
	tax = tax/2; // because we're using it in the 2nd degree
	for (var monthly_wage = 0; monthly_wage < max_monthly_wage; monthly_wage=monthly_wage+monthly_resolution) {
		cycle = function(value) {
			taxing = function(value) {
				// let's see what's your factor related to the minimum wage
				var factor = value/MINIMUM_MONTHLY_WAGE - 1;
				// if the minimum monthly wage is the minimum, we shouldn't tax people for getting that...
				if (factor<0) factor=0;
				// now, there's a tax_percentage, and that one is equal to anyone
				return ({taxes:Math.round(factor*tax*MINIMUM_MONTHLY_WAGE), factor: factor});
			}
			var taxation = taxing(value);
			var aftertaxes = value - taxation.taxes;
			while (taxation.factor > 0) {
				taxation = taxing(taxation.taxes);
				aftertaxes -= taxation.taxes;
			}
			return aftertaxes;
		}
		aftertaxes = cycle(cycle(monthly_wage));
		// simple, right?
		taxes.push({wage: monthly_wage, aftertax: aftertaxes});
	}

	return table_draw(taxes);
}
