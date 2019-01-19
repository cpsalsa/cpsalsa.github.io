---
---
function createEventCard(event, className, includeDetails) {
    // containers
    let elem = document.createElement('div'),
        bg = document.createElement('div'),
        details = document.createElement('div'),
        when = document.createElement('div'),
        header = document.createElement('div');

    // headers
    let title = document.createElement('h3');

    // spans
    let day = document.createElement('span'),
        month = document.createElement('span'),
        time = document.createElement('span'),
        where = document.createElement('span'),
        arrowRight = document.createElement('span'),
        mapMarker = document.createElement('span');

    // anchors
    let url = document.createElement('a'),
        whereUrl = document.createElement('a');


    elem.className = className;
    elem.appendChild(bg);
    elem.appendChild(details);

    details.appendChild(when);
    details.appendChild(header);

    when.appendChild(day);
    when.appendChild(month);
    when.appendChild(time);

    header.appendChild(title);
    header.appendChild(where);

    title.appendChild(url);
    where.appendChild(whereUrl);

    // classnames
    bg.className = 'card-bg';
    details.className = 'details';
    when.className = 'when';
    day.className = 'day';
    month.className = 'month';
    time.className = 'time';
    header.className = 'header';
    title.className = 'title';
    arrowRight.className = 'fa fa-arrow-right';
    where.className = 'where';
    mapMarker.className = 'fa fa-map-marker';

    // styles
    bg.style.cssText = `background-image: url(${event.main_image.url}); background-position: ${event.main_image.position}; background-size: ${event.main_image.size}; background-repeat: ${event.main_image.repeat}`

    day.innerText = event.closestDate.getDate();
    month.innerText = jQuery.format.date(event.closestDate, 'MMM');
    time.innerText = jQuery.format.date(event.closestDate, 'h:mm a');

    url.innerText = event.title;
    url.setAttribute('href', event.url);
    url.appendChild(arrowRight);
    whereUrl.innerText = event.where.name;
    whereUrl.setAttribute('href', event.where.url);
    whereUrl.appendChild(mapMarker);

    if (includeDetails) {
        let eventText = document.createElement('div'),
            detailsHeader = document.createElement('h3');

            details.appendChild(eventText);

            eventText.appendChild(detailsHeader);

            eventText.className = 'event-text';

            detailsHeader.innerText = 'Details';
            let md = window.markdownit();
            let snippet = jQuery(md.render(event.snippet));

            snippet.appendTo(eventText);
    }

    return elem;
}

function getClosestDate(event) {
    let currentDate = new Date(),
        closestDate = null;

    for (let dates of event.dates) {
        let begins = new Date(dates.begins);
        if (begins >= currentDate) {
            closestDate = begins;
            break;
        }
    }

    return closestDate;
}

function layoutEvents(events) {
    // the first event is always displayed big
    //<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    let container = document.getElementById('event-layout-container'),
        elem = document.createElement('div'),
        event = null;

    container.appendChild(elem);
    elem.className = events.length === 1 ?
        'col-lg-12 col-md-12 col-sm-12 co-xs-12 singleton' :
        'col-lg-6 col-md-6 col-sm-12 col-xs-12';
    elem.appendChild(createEventCard(events.shift(), 'card wow fadeInDown', true));

    if (events.length > 0) {
        // the next three are mid sized
        let midContainer = document.createElement('div'),
            row = document.createElement('div'),
            ndx = 0;
        container.appendChild(midContainer);
        midContainer.appendChild(row);
        midContainer.className = 'col-lg-6 col-md-6 col-sm-12 col-xs-12';
        row.className = 'row';

        while (events.length > 0 && ndx < 3) {
            event = events.shift();
            elem = document.createElement('div');
            elem.className = 'col-md-12 col-sm-12 col-xs-12';
            elem.appendChild(createEventCard(event, 'card small-event wow fadeInDown', false));
            row.appendChild(elem);

            ndx++;
            console.log('mid ' + event.title);
        }

        // the rest are smallest size
        while (events.length !== 0) {
            event = events.shift();
            elem = document.createElement('div');
            elem.className = 'col-lg-4 col-md-6 col-sm-12 col-xs-12';
            elem.appendChild(createEventCard(event, 'card small-event wow fadeInDown', false));
            container.appendChild(elem);
            console.log('smallest ' + event.title);
        }
    }
}

function sortEvents(events) {
    let newEvents = events.map(event => {
        return {
            ...event,
            closestDate: getClosestDate(event),
        };
    })

    let futureOnly = newEvents.filter(event => event.closestDate !== null);

    futureOnly.sort((event1, event2) => {
        return event1.closestDate.getTime() - event2.closestDate.getTime();
    });

    layoutEvents(futureOnly);
}

let events = [{% for event in site.events %}
    {
        "title": "{{ event.title }}",
        "snippet" : {{ event.snippet | jsonify }},
        "dates"  : [
            {% for date in event.dates %} {
                "begins": "{{ date.begins | date: '%Y-%m-%dT%H:%M' }}",
                "ends": "{{ date.ends | date: '%Y-%m-%dT%H:%M' }}",
            },
            {% endfor %}
        ],
        "where": {{ event.where | jsonify }},
        "url": "{{ event.url }}",
        "main_image": {{ event.main_image | jsonify }},
    },
    {% endfor %}
];

sortEvents(events);
