var svg = d3.select('#screening-chart--deaths'),
	width = +svg.attr('width'),
	height = +svg.attr('height'),
	svgHarms = d3.select('#screening-chart--harms'),
	d3Narration = d3.select('#screening-chart__narration'),
	d3HarmsTable = d3.select('#screening-chart__table');

var bar = {
	x: d3.scaleBand()
		.range([0, 200])
		.padding(0.1),
	y: d3.scaleLinear()
		.range([height, 0]),
	labels: {
		deaths: 'Deaths',
		falsealarm: 'False Alarms',
		cases: 'Cases',
		biopsies: 'Biopsies',
		overdiagnoses: 'Overdiagnosed'
	}
};

var cohortPositions = [
	{x: 360.779977034962, y: 147.939006403502},
	{x: 354.460598977301, y: 154.729885290262},
	{x: 360.427172806529, y: 139.247510027988},
	{x: 365.447765775399, y: 157.210927322285},
	{x: 347.923583251674, y: 146.140652691528},
	{x: 372.499237611653, y: 144.55914667007},
	{x: 354.744430336824, y: 163.844014348307},
	{x: 352.018250877135, y: 137.994823248871},
	{x: 373.575738043761, y: 153.618719499979},
	{x: 344.880350780036, y: 155.581644052448},
	{x: 367.751491168481, y: 135.525779108654},
	{x: 364.175029376687, y: 166.84772016258},
	{x: 339.51831600069, y: 140.108379695761},
	{x: 382.114889456453, y: 143.734272868036},
	{x: 347.130807468468, y: 168.964514117601},
	{x: 355.550553757415, y: 127.622514438485},
	{x: 377.3736684095, y: 162.795005670144},
	{x: 336.839668105165, y: 149.774796781836},
	{x: 376.922420996243, y: 134.120090509068},
	{x: 357.999305350801, y: 173.850939598086},
	{x: 345.518377831594, y: 131.407568604891},
	{x: 382.993909973629, y: 154.138440079454},
	{x: 339.540638495396, y: 161.876700527518},
	{x: 366.685343719311, y: 127.024400557431},
	{x: 371.962842018049, y: 170.176737443848}
];

var cohortGroups = {
	'unaffected': {
		color: '#ccc'},
	'affected': {
		color: 'hsl(200, 23%, 46%)'
	},
	'noscreening': {
		label: 'No Screening',
		color: 'hsl(200, 23%, 46%)',
		harms: {
			biopsies: 0,
			cases: 0,
			deaths: 25,
			falsealarm: 0
		}
	},
	'forties': {
		label: 'Screening at 40',
		color: '#eb494f',
		harms: {
			biopsies: 213,
			cases: 154,
			deaths: 17,
			falsealarm: 1529,
			overdiagnoses: 21
		}
	},
	'fifties': {
		label: 'Screening at 50',
		color: '#76ff03',
		harms: {
			biopsies: 145,
			cases: 151,
			deaths: 18,
			falsealarm: 953,
			overdiagnoses: 19
		}
	},
	'survivor': {
		color: 'hsl(340, 100%, 72%)'
	}
};

var cohortState = 'unaffected';

var nodes = d3.range(1000).map(initCohorts(4));

initStatus(nodes);

var g = svg.append('g')
	.attr('id', 'group-cohorts');

var narrationG = svg.append('g')
	.attr('id', 'group-narration')
			.attr('transform', 'translate(' + width / 2 +',0)');

var harmG = svg.append('g')
	.attr('id', 'group-harms');

var deathsLabelG = svg.append('g')
	.attr('id', 'group-deaths-label');

var cohortsLabelG = svg.append('g')
	.attr('id', 'group-cohorts-label');

// renderHarms();


function startAnimation() {
	renderNarration();
	renderUnaffected();
}


	initDeathsLabel();
var animationStep = 1;

function advanceAnimation() {
	if (animationStep == 1) {
		$('#animation-advance-button').text('Next');
	}
	switch(animationStep) {
		case 1:
			setNarrationText('Let\'s follow 1,000 women starting at age 40. Each dot below represent 1 woman. There are 1,000 dots.', 0);
			renderUnaffected();
			break;
		case 2:
			g.transition().duration(1000).attr('transform', 'translate(0,0) scale(1)');
			setNarrationText('If we followed these 1,000 women starting today and continued until their deaths — if they didn’t get screened there would be about 25 deaths from breast cancer.');
			moveCohort('noScreening', 2000);
			d3HarmsTable.transition().duration(1000).style('opacity', 1).delay(4000);
			break;
		case 3:
			setNarrationText('If these 1,000 women were screened every other year starting at age 50 and stopped at age 74, there would be about 151 breast cancer cases and 18 deaths from breast cancer.');
			moveCohort('fifties', 2000);
			d3.selectAll('.screening-visible__fifties').transition().duration(1000).style('opacity', 1).delay(2000);
			break;
		case 4:
			setNarrationText('But there are harms to breast cancer screening. One of these harms is a false alarm. A false alarm is when the breast cancer screening suggests a woman has breast cancer when she does not.');
			break;
		case 5:
			setNarrationText('If these 1,000 women started screening at 50, there would be about 953 false alarms.');
			d3.selectAll('.screening-visible__fifties--falsealarm').transition().duration(1000).style('opacity', 1).delay(1000);
			break;
		case 6:
			setNarrationText('False alarms can mean that women may have more testing or procedures that they do not need. For example, women may have more imaging tests (pictures) or biopsies* after a false alarm. These extra tests all show that there is no breast cancer.');
			break;
		case 7:
			setNarrationText('If these 1,000 women started screening at 50, there would be about 145 biopsies that find no cancer.');
			d3.selectAll('.screening-visible__fifties--biopsies').transition().duration(1000).style('opacity', 1).delay(1000);
			break;
		case 8:
			setNarrationText('Another harm is overdiagnosis. Overdiagnosis is when breast cancer screening finds breast cancer that would not have caused symptoms or harm to a woman during her lifetime. These cancers grow very slow or not at all. This can lead to treatment like surgery, chemotherapy, and radiation that is not needed and causes harm.');
			break;
		case 9:
			setNarrationText('When a woman is diagnosed with breast cancer, health care professionals do not know if the breast cancer will cause health problems over her lifetime. This means that almost all women who are diagnosed with breast cancer are treated.');
			break;
		case 10:
			setNarrationText('If these 1,000 women started screening at 50, there would be about 19 overdiagnosed breast cancers.');
			d3.selectAll('.screening-visible__fifties--overdiagnoses').transition().duration(1000).style('opacity', 1).delay(1000);
			break;
		case 11:
			setNarrationText('Now let’s look at these 1,000 women if they started screening at age 40 instead of 50.');
			break;
		case 12:
			setNarrationText('If these 1,000 women were screened every other year starting at 40 and stopped at age 74, there would be about 154 breast cancer cases and 17 deaths from breast cancer.');
			moveCohort('forties', 2000);
			d3.selectAll('.screening-visible__forties').transition().duration(1000).style('opacity', 1).delay(2000);
			d3.selectAll('.screening-visible__forties--cases').transition().duration(1000).style('opacity', 1).delay(2000);
			break;
		case 13:
			setNarrationText('But, if these 1,000 women started screening at age 40, there would be about 1,529 false alarms, 213 biopsies, and 21 overdiagnosed breast cancers.');
			d3.selectAll('.screening-visible__forties').transition().duration(1000).style('opacity', 1).delay(2000);
			d3.selectAll('.screening-visible__forties--falsealarm').transition().duration(1000).style('opacity', 1).delay(1000);
			d3.selectAll('.screening-visible__forties--biopsies').transition().duration(1000).style('opacity', 1).delay(1000);
			d3.selectAll('.screening-visible__forties--overdiagnoses').transition().duration(1000).style('opacity', 1).delay(1000);
			d3.selectAll('.screening-visible__end').transition().duration(1000).style('opacity', 1).delay(1000);
			break;

	}

	animationStep++;
}


function setNarrationText(narrationText, delay) {
	if (delay === undefined) {
		delay = 500;
	}

	d3Narration
		.transition()
		.duration(500)
		.style('opacity', 0)
		.transition()
		.style('opacity', 1)
		.text(narrationText)
		.transition()
		.delay(delay);
}


function renderUnaffected() {
	g.selectAll('circle')
		.data(nodes)
		.enter().append('circle')
		.style('fill', function(d) {
			return cohortGroups['unaffected'].color
		})
		.attr('cx', function(d) {
			return d.x;
		})
		.attr('cy', function(d) {
			return d.y;
		})
		.attr('r', 2.5)
		.attr('id', function(d) {
			return d.id
		});

	g.attr('transform', 'translate(225,0) scale(1.5)');
}


function initHarms() {
	harmG
		.append('text')
		.attr('class', 'screening-chart__header')
		.attr('y', 20)
		.attr('x', 730)
		.attr('text-anchor', 'middle')
		.text('No');

	harmG
		.append('text')
		.attr('class', 'screening-chart__header')
		.attr('y', 35)
		.attr('x', 730)
		.attr('text-anchor', 'middle')
		.text('Screening');

	harmG
		.append('text')
		.attr('class', 'screening-chart__label')
		.attr('y', 35 + harmLineheight)
		.attr('x', 675)
		.attr('text-anchor', 'end')
		.text(bar.labels.deaths + ':');
}


function renderHarms() {
	var harmLabelCnt = 0;

	for (harm in bar.labels) {
		harmG
			.append('text')
			.attr('class', 'screening-chart__label')
			.attr('y', 35 + harmLineheight + (harmLineheight * harmLabelCnt))
			.attr('x', 675)
			.attr('text-anchor', 'end')
			.text(bar.labels[harm] + ':');

		harmG
			.append('text')
			.attr('class', 'screening-chart__label--fifties')
			.attr('y', 35 + harmLineheight + (harmLineheight * harmLabelCnt))
			.attr('x', 750)
			.attr('text-anchor', 'end')
			.text(d3.format(',')(cohortGroups.fifties.harms[harm]));

		harmG
			.append('text')
			.attr('class', 'screening-chart__label--fifties')
			.attr('y', 35 + harmLineheight + (harmLineheight * harmLabelCnt))
			.attr('x', 850)
			.attr('text-anchor', 'end')
			.text(d3.format(',')(cohortGroups.forties.harms[harm]));

		harmLabelCnt++;
	}
}


function initCohorts(radius) {
	var theta = Math.PI * (3 - Math.sqrt(5));
	return function(i) {
		var r = radius * Math.sqrt(i),
			a = theta * i,
			x = 135 + r * Math.cos(a),
			y = 150 + r * Math.sin(a);
		return {
			x: x,
			y: y,
			origX: x,
			origY: y,
			cohort: 'unaffected',
			id: 'id' + i
		};
	};
}


function initStatus(nodes) {
	for (var i = 0; i < 25; i++) {
		var unaffected = nodes.filter(findUnaffected);
		var nodeIdx = Math.floor(Math.random() * unaffected.length);

		unaffected[nodeIdx].cohort = 'noscreening';
		unaffected[nodeIdx].positions = {
			'unaffected': {x: unaffected[nodeIdx].x, y: unaffected[nodeIdx].y},
			'fifties': {x: unaffected[nodeIdx].x, y: unaffected[nodeIdx].y},
			'forties': {x: unaffected[nodeIdx].x, y: unaffected[nodeIdx].y}
		};
		unaffected[nodeIdx].color = {
			'unaffected': cohortGroups['survivor'].color,
			'affected': cohortGroups['affected'].color,
			'noScreening': cohortGroups['affected'].color,
			'fifties': cohortGroups['survivor'].color,
			'forties': cohortGroups['survivor'].color
		};

		unaffected[nodeIdx].positions.noScreening = cohortPositions[i];
	}

	for (var i = 0; i < 17; i++) {
		var noscreening = nodes.filter(findNoScreening);
		var randomPos = Math.floor(Math.random() * noscreening.length);
		noscreening[randomPos].cohort = 'forties';
		noscreening[randomPos].positions.forties = noscreening[randomPos].positions.noScreening;
		noscreening[randomPos].positions.fifties = noscreening[randomPos].positions.noScreening;
		noscreening[randomPos].color.forties = cohortGroups['affected'].color;
		noscreening[randomPos].color.fifties = cohortGroups['affected'].color;
	}

	noscreening = nodes.filter(findNoScreening);
	randomPos = Math.floor(Math.random() * noscreening.length);
	noscreening[randomPos].cohort = 'fifties';
	noscreening[randomPos].positions.fifties = noscreening[randomPos].positions.noScreening;
	noscreening[randomPos].color.fifties = cohortGroups['affected'].color;
}


function findUnaffected(nodes) {
	return nodes.cohort === 'unaffected';
}


function findNoScreening(nodes) {
	return nodes.cohort === 'noscreening';
}


function findForties(nodes) {
	return nodes.cohort === 'forties';
}


function findFifties(nodes) {
	return nodes.cohort === 'fifties';
}

function findCohort(cohort) {
	if (cohort == 'forties') {
		return nodes.filter(findForties);
	} else if (cohort == 'fifties') {
		return nodes.filter(findForties).concat(nodes.filter(findFifties));
	} else if (cohort == 'noScreening') {
		return nodes.filter(findForties).concat(nodes.filter(findFifties)).concat(nodes.filter(findNoScreening));
	}
}


function initDeathsLabel() {
	cohortsLabelG
		.append('text')
		.attr('class', 'screening-chart__label--forties')
		.attr('y', 70)
		.attr('x', 360)
		.attr('text-anchor', 'middle')
		.text('Screening: ')
		.style('opacity', 0);

	deathsLabelG
		.append('text')
		.attr('class', 'screening-chart__label')
		.attr('y', 100)
		.attr('x', 360)
		.attr('text-anchor', 'middle')
		.text('Deaths: ')
		.style('opacity', 0);
}


function setDeathsLabelText(deathsLabelText, delay) {
	if (delay === undefined) {
		delay = 500;
	}

	deathsLabelG
		.selectAll('text')
		.transition()
		.duration(500)
		.style('opacity', 0)
		.transition()
		.delay(delay)
		.style('opacity', 1)
		.text(deathsLabelText)
		.transition()
		.duration(500);
}


function setCohortsLabelText(cohortsLabelText, delay) {
	if (delay === undefined) {
		delay = 500;
	}

	cohortsLabelG
		.selectAll('text')
		.transition()
		.duration(500)
		.style('opacity', 0)
		.transition()
		.delay(delay)
		.style('opacity', 1)
		.text(cohortsLabelText)
		.transition()
		.duration(500);
}


function moveCohort(cohort, delay) {
	if (delay === undefined) {
		delay = 0;
	}

	var cohortNodes = findCohort('noScreening');
	cohortNodes.forEach(function(d) {
		d3.selectAll('circle#' + d.id)
			.transition().duration(2000)
			.delay(delay)
			.style('fill', function(d) {
				return d.color[cohort]
			})
			.attr('cx', d.positions[cohort].x)
			.attr('cy', d.positions[cohort].y);
	});

	setCohortsLabelText(cohortGroups[cohort.toLowerCase()]['label'], delay + 1000);
	setDeathsLabelText('Deaths: ' + cohortGroups[cohort.toLowerCase()]['harms']['deaths'], delay + 1000);
}
