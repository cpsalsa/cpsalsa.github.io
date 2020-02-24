---
---
function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function beginDateParsing() {
  let dateElements = findDateSection();
  tagPastDates(dateElements);

  if (document.querySelector('.friday-date-recur')) {
    layoutInstructors(dateElements);
  }
}

function findDateSection() {
  let dates = document.querySelectorAll('.dates-section .date-output');

  return dates;
}

function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function layoutInstructors(dateElements) {
  if (dateElements.length > 0) {
    let elemToAppendTo = document.querySelector('.friday-text'),
        row = document.createElement('div'),
        event = null;

    elemToAppendTo.appendChild(row);
    row.className = 'row';

    let col = document.createElement('div');
    col.className = 'col-md-12';
    row.appendChild(col);

    let header = document.createElement('h2');
    header.className = 'wow fadeInLeftBig';
    header.innerText = 'Instructors';
    col.appendChild(header);

    let content = document.createElement('p');
    content.className = 'wow fadeInLeftBig';
    col.appendChild(content);

    let now = Date.now(),
        dateToGet = null;

    for (let dateElem of dateElements) {
      let dateInMil = (new Date(dateElem.dataset.beginDate)).getTime();
      if (dateInMil > now) {
        dateToGet = dateElem.dataset.beginDate;
      }
    }

    if (dateToGet != null) {
      for (let lesson of fridayDates[dateToGet].lessons) {
        let lessonContent = document.createElement('span');
        let instructors = document.createElement('span');
        let lessonTitle = document.createElement('strong');
        lessonTitle.innerText = lesson.title;
        instructors.innerText = ' - ' + lesson.instructors;
        lessonContent.appendChild(lessonTitle);
        lessonContent.appendChild(instructors);

        content.appendChild(lessonContent);
        content.appendChild(document.createElement('br'));
      }
    }
  }
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

function tagPastDates(dateElements) {
  let now = Date.now();
  for (let dateElem of dateElements) {
    let unixDate = (new Date(dateElem.dataset.beginDate)).getTime();

    if (unixDate < now) {
      addClass(dateElem, 'past');
    } else {
      removeClass(dateElem, 'past');
    }
  }
}

let fridayDates = { {% for date in site.data.friday.dates %}
  "{{ date.begins | date: '%FT%R' }}" : {
    "lessons": [{% for lesson in date.lessons %}
      {
        "title": "{{ lesson.title }}",
        "instructors": "{{ lesson.instructors }}",
      },
    {% endfor %}]
  },
  {% endfor %}
};

beginDateParsing();
