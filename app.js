'use strict'

/**
* User peak log is used to store completed peak data for the user.
*/
let userPeakLog = []

/**
* Start app.
* - Get user data if it exists in local storage
* - Populate form datalist
* - Enable datepicker for browsers that are not type=date compatible
* - Handle all button clicks
* - Show home section (update progress chart if data available)
*/
function startApp () {
  // load user peak log from local storage
  if (localStorage.getItem('userPeakLog')) {
    userPeakLog = JSON.parse(localStorage.getItem('userPeakLog'))
  }

  // populate datalist in add peak form and enable auto complete for browsers that dont support datalist
  populateDatalist()
  enableDatalistAutocomplete()

  // enable date picker for browsers that dont support type=date
  enableDatePicker()

  // handle all clicks
  handleStartTrackingBtnClick()
  handleLogoClick()
  handleSubmitForm()
  handleNavDashboardBtnClick()
  handleNavAddPeakBtnClick()
  handleNavListBtnClick()
  handleNavMapBtnClick()
  handleRemovePeakBtnClick()
  handleSortByClick()

  // update progress chart and show home section
  updateProgressChart()
  showHomeSection()
}

/** Hide content.
* - Hide all content sections
* - Sections class = .content
* - Add class = hidden
*/
function hideContent () {
  $('.content').addClass('hidden')
}

/**
* Handle start tracking button click.
* - Clear form inputs - clearFormInputs()
* - Show add peak section
*/
function handleStartTrackingBtnClick () {
  $('#start-tracking-btn').click(function () {
    clearFormInputs()
    showAddPeakSection()
  })
}

/**
* Handle logo click.
* - Logo ID: #logo
* - Update progress chart - updateProgressChart()
* - Show home section - showHomeSection()
*/
function handleLogoClick () {
  $('#logo').click(function () {
    updateProgressChart()
    showHomeSection()
  })
}

/**
* Handle navigation dashboard button click.
* - Nav dashboard button ID: #dashboard-nav-btn
* - Update progress chart - updateProgressChart()
* - Show dashboard section - showDashboardSection()
*/
function handleNavDashboardBtnClick () {
  $('#dashboard-nav-btn').click(function () {
    updateProgressChart()
    showDashboardSection()
  })
}

/**
* Handle navigation add peak button click.
* - Add peak button ID: #add-peak-nav-btn
* - Clear form inputs - clearFormInputs()
* - Show add peak form page - showAddPeakSection()
*/
function handleNavAddPeakBtnClick () {
  $('#add-peak-nav-btn').click(function () {
    clearFormInputs()
    showAddPeakSection()
  })
}

/**
* Handle navigation list button click.
* - List button ID: #list-nav-btn
* - Sort peak list - sortByDateClimbed()
* - Update photo list - updatePeakPhotoList()
* - Show peak list section - showPeakListSection()
*/
function handleNavListBtnClick () {
  $('#list-nav-btn').click(function () {
    sortByDateClimbed()
    updatePeakPhotoList()
    showPeakListSection()
  })
}

/**
* Handle navigation map button click.
* - Map nav button ID: #map-nav-btn
* - Show peak map section - showPeakMapSection()
*/
function handleNavMapBtnClick () {
  $('#map-nav-btn').click(function () {
    showPeakMapSection()
  })
}

/**
* Update progress chart.
* - Calculate percent peaks climbed, remove repeats
* - Add class p50 for 50% to #progress-circle
* - Update text span percent in circle - #percent
* - Update text span number climbed - #number-climbed
* - Update text span total peaks - #number-total
*/
function updateProgressChart () {
  const totalPeaks = peakData.length
  let peaksClimbed = []
  userPeakLog.forEach(peak => peaksClimbed.push(peak.peak_name))
  const uniquePeaksClimbed = _.uniq(peaksClimbed)
  const numberClimbed = uniquePeaksClimbed.length
  const percent = Math.ceil((numberClimbed / totalPeaks) * 100)
  const progressCircle = document.getElementById('progress-circle')

  $(progressCircle).removeAttr('class')
  $(progressCircle).addClass(`c100 big black p${percent}`)
  $('#percent').html(`${percent}%`)
  $('#number-climbed').html(`${numberClimbed}`)
  $('#number-total').html(`${totalPeaks}`)
}

/**
* Show home section.
* - Hide all sections - hideContent()
* - Update nav bar css classes
* - Remove class = hidden from home page section - ID: #home-section
*/
function showHomeSection () {
  hideContent()
  $('#add-peak-nav-btn, #list-nav-btn, #map-nav-btn, #dashboard-nav-btn').removeClass('selected')
  $('#home-section').removeClass('hidden')
}

/**
* Show dashboard section.
* - Hide all sections - hideContent()
* - Update nav bar css classes
* - Remove class = hidden from dashboard page section - ID: #dashboard-section
*/
function showDashboardSection () {
  hideContent()
  $('#add-peak-nav-btn, #list-nav-btn, #map-nav-btn').removeClass('selected')
  $('#dashboard-nav-btn').addClass('selected')
  $('#dashboard-section').removeClass('hidden')
}

/**
* Show the add peak section.
* - Hide all sections - hideContent()
* - Update nav bar css classes
* - Makes sure form inputs are clear
* - Show add peak section - ID: #add-peak-section
* - Add event listeners to check form inputs
*/
function showAddPeakSection () {
  hideContent()
  $('#map-nav-btn, #list-nav-btn, #dashboard-nav-btn').removeClass('selected')
  $('#add-peak-nav-btn').addClass('selected')
  $('#add-peak-section').removeClass('hidden')

  $('#peak-climbed').focusout(function () {
    validatePeak()
  })
  $('#date-climbed').focusout(function () {
    validateDate()
  })
}

/**
* Show peak list section.
* - Hide all content sections - ()
* - Update nav button css classes
* - Show peak list page section - ID: #peak-list-section
*/
function showPeakListSection () {
  hideContent()
  $('#map-nav-btn, #add-peak-nav-btn, #dashboard-nav-btn').removeClass('selected')
  $('#list-nav-btn').addClass('selected')
  $('#peak-list-section').removeClass('hidden')
}

/**
* Show peak map section.
* - Hide all content sections - ()
* - Update nav button css classes
* - Show peak map section - ID: #peak-map-section
* - Render map - renderMap()
*/
function showPeakMapSection () {
  hideContent()
  $('#add-peak-nav-btn, #list-nav-btn, #dashboard-nav-btn').removeClass('selected')
  $('#map-nav-btn').addClass('selected')
  $('#peak-map-section').removeClass('hidden')
  renderMap()
}

/**
* Populate Datalist.
* - Get peak names from API data saved in peakList
* - Sort alphabetically in an array
* - For each peak name, add an option in the datalist - ID: #peak-list
*/
function populateDatalist () {
  const peakList = []
  peakData.forEach(peak => peakList.push(peak.attributes.peak_name))
  peakList.sort()
  peakList.forEach(peak => {
    $('#peak-select').append(`<option value='${peak}'/>`)
  })
}

/**
* Enable datalist autocomplete.
* - For browsers that do not support datalist, enable autocomplete with the select input
*/
function enableDatalistAutocomplete () {
  let nativedatalist = !!('list' in document.createElement('input')) &&
  !!(document.createElement('datalist') && window.HTMLDataListElement)

  if (!nativedatalist) {
    $('input[list]').each(function () {
      let availableTags = $('#peak-datalist').find('option').map(function () {
        return this.value
      }).get()
      $('#peak-climbed').autocomplete({ source: availableTags })
    })
  }
}

/**
* Enable date picker.
* - If browser does not support input type = date, use jQuery to add date picker to date text input - ID: #date-climbed
*/
function enableDatePicker () {
  if (!$('input[type="date"]')) {
    $('#date-climbed').datepicker()
  }
}

/**
* Handle submit form.
* - Form ID: #add-peak-form
* - Validate form - validateForm()
* - Prevent default
* - Add peak to userPeakLog - addPeak()
* - Update peak photo list - updatePeakPhotoList()
* - Show peak list page - showPeakListSection()
*/
function handleSubmitForm () {
  $('#add-peak-form').submit(function (event) {
    event.preventDefault()
    let validPeak = validatePeak()
    let validDate = validateDate()

    if (validPeak && validDate) {
      let peakName = $('#peak-climbed').val()
      let date = $('#date-climbed').val()
      let notes = $('#user-notes').val()
      addPeak(peakName, date, notes)
      sortByDateClimbed()
      updatePeakPhotoList()
      showPeakListSection()
    }
  })
}

/**
* Clear Form
*/
function clearFormInputs () {
  $('#peak-climbed, #date-climbed, #user-notes').val('')
  $('#peak-error-message, #date-error-message').html('')
  $('#peak-climbed, #date-climbed').removeClass('invalid-input')
}

/**
* Validate peak.
* - Check user inputs after it they are entered.
* - Input for peak name - #peak-climbed
* - Error message p - #peak-error-message
*/
function validatePeak () {
  let peakName = $('#peak-climbed').val()
  let validPeak = true
  let message = null
  const peakList = []
  peakData.forEach(peak => peakList.push(peak.attributes.peak_name))

  // check that input exists and is in the list of peaks
  if (!peakName) {
    validPeak = false
    message = 'Please select a peak.'
  } else if (!peakList.includes(peakName)) {
    validPeak = false
    message = 'Peak name must be in the list.'
  }

  // apply css and show message if invalid
  if (!validPeak) {
    $('#peak-climbed').addClass('invalid-input')
    $('#peak-error-message').html(message)
  }
  if (validPeak) {
    $('#peak-climbed').removeClass('invalid-input')
    $('#peak-error-message').html('')
  }

  return validPeak
}

/**
* Validate date.
* - Check user inputs after it they are entered.
* - Input for date name - #date-climbed
* - Error message p - #date-error-message
*/
function validateDate () {
  let dateClimbed = $('#date-climbed').val()
  let validDate = true
  let message = null
  let today = moment(new Date()).toISOString()
  let minusHundredYears = moment(today).subtract(100, 'years')// check that input exists and is today or earlier

  if (!dateClimbed) {
    validDate = false
    message = 'Please select a date.'
  }
  if (!moment(dateClimbed).isBetween(minusHundredYears, today, null, '[]')) {
    validDate = false
    message = 'Date must be today or earlier.'
  }

  // apply css and display message if invalid
  if (!validDate) {
    $('#date-climbed').addClass('invalid-input')
    $('#date-error-message').html(message)
  }
  if (validDate) {
    $('#date-climbed').removeClass('invalid-input')
    $('#date-error-message').html('')
  }

  return validDate
}

/**
* Update peak photo list.
* - Clear out existing peak list section - ID: #peak-photo-list
* - Generate HTML for each peak in userPeakLog
* - Add HTML to peak photo list - ID: #peak-photo-list
*/
function updatePeakPhotoList () {
  $('#peak-photo-list').html('')

  if (!localStorage.getItem('userPeakLog') || JSON.parse(localStorage.getItem('userPeakLog')).length === 0) {
    $('#peak-photo-list').append('No peaks logged')
  } else {
    // total peaks in userPeakLog
    let peakNumber = userPeakLog.length

    // number of items per row
    let n = 3
    let rowsNeeded = Math.ceil(peakNumber / n)

    // insert HTML rows
    for (let i = 1; i <= rowsNeeded; i++) {
      $('#peak-photo-list').append(`<div class="list-row col-12" id="row${i}"></div>`)
    }

    // split into array with arrays with n items and add html based on which row it needs to go into
    let i, j, temparray
    for (i = 0, j = userPeakLog.length; i < j; i += n) {
      temparray = userPeakLog.slice(i, i + n)

      temparray.forEach((peak) => {
        let formatedDate = moment(peak.dateClimbed).format('MMM D, YYYY')
        let formattedElevation = numeral(peak.elevation).format('0,0')
        let rowNum = Math.ceil((i + 1) / n)

        $(`#row${rowNum}`).append(`
            <div class="col-4 mountain-box">
              <img src="${peak.imgSrc}" alt="${peak.peak_name} photo" class="mountain-photo">
              <div class="caption">
                <h2 class="caption-header">${peak.peak_name} - ${formattedElevation}</h2>
                <p class="caption-details">Rank: ${peak.rank}</p>
                <p class="caption-details">Date climbed: ${formatedDate}</p>
                <br>
                <p class="caption-details">${peak.notes}</p>
                <button class="button remove-peak" data-peak="${peak.peak_name}" data-date="${peak.dateClimbed}">x</button>
              </div>
            </div>
        `)
      })
    }
  }
}

/**
* Handle sort by click
* - Sort dropdown ID: #sort-by
* - Find out which option the user selected
* - Sort userPeakLog based on selection
* - Re-generate peak list in new order - updatePeakPhotoList()
*/
function handleSortByClick () {
  $('#sort-by').change(function () {
    let userSort = $('#sort-by option:selected').val()

    if (userSort === 'date-climbed') {
      sortByDateClimbed()
    }
    if (userSort === 'peak-name') {
      sortByPeakName()
    }
    if (userSort === 'peak-rank') {
      sortByRank()
    }

    updatePeakPhotoList()
  })
}

/**
* Handle remove peak button click.
* - Use parent div to find button that was added after page load - ID: #peak-list-page
* - Button class = .remove-peak
* - find out neam of peak being removed - class: .caption-header data-peak attribute
* - remove peak from user log & update local storage - removePeak()
* - update peak photo list - updatePeakPhotoList()
*/
function handleRemovePeakBtnClick () {
  $('#peak-list-section').on('click', '.remove-peak', function () {
    let peakName = $(this).data('peak')
    let dateClimbed = $(this).data('date')

    if (confirm(`Are you sure you want to remove ${peakName}?`)) {
      removePeak(peakName, dateClimbed)
      updatePeakPhotoList()
    }
  })
}

/**
* Add peak.
* - Get peak data from 14er API using peak name user selected
* - Get peak photo from flickr API using lat and long from peak data
* - Add peak photo and alt to peak data
* - Push peak data to user peak log
* - Update local storage
*/

function addPeak (peakName, date, notes) {
  let addedPeakData = getPeakData(peakName)
  addedPeakData.dateClimbed = date
  addedPeakData.notes = notes
  userPeakLog.push(addedPeakData)

  let savedUserPeakLog = JSON.stringify(userPeakLog)
  localStorage.setItem('userPeakLog', savedUserPeakLog)
}

/**
* Get peak data.
* - Use peak name to find peakName in peakData and get data
* - Add data to a new object and push into userPeakLog
*/
function getPeakData (peakName) {
  let allPeakData = peakData.filter(peak => peak.attributes.peak_name === peakName)
  let modifiedPeakData = Object.assign({}, allPeakData[0].attributes)

  return modifiedPeakData
}

/**
* Remove peak.
* - Remove peak from userPeakLog
* - Update local storage
*/
function removePeak (peakName, dateClimbed) {
  _.remove(userPeakLog, function (peak) {
    if (peak.peak_name === peakName && peak.dateClimbed === dateClimbed) {
      return true
    }
  })

  let savedUserPeakLog = JSON.stringify(userPeakLog)
  localStorage.setItem('userPeakLog', savedUserPeakLog)
}

/**
* Sort by date completed.
* - Sort userPeakLog by date completed
*/
function sortByDateClimbed () {
  userPeakLog.sort((a, b) => {
    let dateA = moment(a.dateClimbed).unix()
    let dateB = moment(b.dateClimbed).unix()
    return dateB - dateA
  })
  $('#sort-by').prop('selectedIndex', 0)
}

/**
* Sort by peak rank.
* - Sort userPeakLog by rank
*/
function sortByRank () {
  userPeakLog.sort((a, b) => a.rank - b.rank)
}

/**
* Soft by peak name.
* - Sort userPeakLog by peak name
*/
function sortByPeakName () {
  userPeakLog.sort(function (a, b) {
    if (a.peak_name < b.peak_name) {
      return -1
    }
    if (b.peak_name < a.peak_name) {
      return 1
    }
    return 0
  })
}

/**
* Render map
* - Show map of colorado
* - Add pins that are in userPeakLog
* - Add info window to each pin when clicked
*/

function renderMap () {
  let map

  // set map base to show all of colorado
  let colorado = {lat: 39.0051, lng: -105.5197}
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: colorado
  })

  // define infowindow with max size
  let infowindow = new google.maps.InfoWindow({
    maxWidth: 250
  })

  // make new array of peak data for markers so there is only one marker per peak
  let peakMarkers = []
  let peakNames = []

  userPeakLog.forEach(peak => {
    let peakName = peak.peak_name

    if (!peakNames.includes(peakName)) {
      peakNames.push(peakName)

      let peakDataToAdd = {
        peak_name: peak.peak_name,
        elevation: peak.elevation,
        rank: peak.rank,
        dateClimbed: [peak.dateClimbed],
        imgSrc: peak.imgSrc,
        latitude: peak.latitude,
        longitude: peak.longitude
      }

      peakMarkers.push(peakDataToAdd)
    } else {
      let index = peakMarkers.findIndex(peak => peak.peak_name === peakName)
      peakMarkers[index].dateClimbed.push(peak.dateClimbed)
    }
  })

  // add marker for each peak in the peak maker array
  peakMarkers.forEach(peak => {
    let location = {lat: parseFloat(peak.latitude), lng: parseFloat(peak.longitude)}

    let marker = new google.maps.Marker({
      position: location,
      map: map,
      title: `${peak.peak_name}`
    })

    let formatedElevation = numeral(peak.elevation).format('0,0')
    let dateContentString = ''
    let dateArray = peak.dateClimbed
    dateArray.sort()

    // format the dates and push to new array
    let formatedDateArray = []
    dateArray.forEach(date => {
      let formatedDate = moment(date).format('MMM D, YYYY')
      formatedDateArray.push(formatedDate)
    })

    if (formatedDateArray.length === 1) {
      let date = formatedDateArray[0]
      dateContentString = `<p class="info-window-text"><span class="info-window-key">Date climbed:</span> ${date}</p>`
    } else {
      let dates = formatedDateArray.join(', ')
      dateContentString = `<p class="info-window-text"><span class="info-window-key">Dates climbed:</span> ${dates}</p>`
    }

    // define conntent string for info windows
    let contentString = `
      <div>
        <h1 class="info-window-header">${peak.peak_name}</h1>
        <p class="info-window-text"><span class="info-window-key">Elevation:</span> ${formatedElevation}</p>
        <p class="info-window-text"><span class="info-window-key">Rank:</span> ${peak.rank}</p>
        ${dateContentString}
        <img class="info-window-image" src="${peak.imgSrc}" alt="${peak.peak_name} photo">
      </div>`

    // when marker is clicked, set content and open infowindow
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(contentString)
      infowindow.open(map, marker)
    })

    // when map is clicked, close open info window
    google.maps.event.addListener(map, 'click', function () {
      infowindow.close()
    })
  })
}

$(startApp)

/**
* peakData is used to save all data for each peak from the 14er API
*/
const peakData = [{
	"type": "peak",
	"id": 1,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/mt_elbert.jpg",
		"peak_name": "Mt. Elbert",
		"range": "Sawatch Range",
		"rank": "1",
		"elevation": "14433",
		"towns": "Leadville, Twin Lakes, Aspen",
		"latitude": "39.117777777777775",
		"longitude": "-106.44472222222223"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/1"
}, {
	"type": "peak",
	"id": 2,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516752/14ers/mt_massive.jpg",
		"peak_name": "Mt. Massive",
		"range": "Sawatch Range",
		"rank": "2",
		"elevation": "14421",
		"towns": "Leadville, Aspen",
		"latitude": "39.18722222222222",
		"longitude": "-106.47472222222223"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/2"
}, {
	"type": "peak",
	"id": 3,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516750/14ers/mt_harvard.jpg",
		"peak_name": "Mt. Harvard",
		"range": "Sawatch Range",
		"rank": "3",
		"elevation": "14420",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.92444444444444",
		"longitude": "-106.32"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/3"
}, {
	"type": "peak",
	"id": 4,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/blanca.jpg",
		"peak_name": "Blanca Peak",
		"range": "Sangre de Cristo",
		"rank": "4",
		"elevation": "14345",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.577222222222225",
		"longitude": "-105.48527777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/4"
}, {
	"type": "peak",
	"id": 5,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516751/14ers/la_plata.jpg",
		"peak_name": "La Plata Peak",
		"range": "Sawatch Range",
		"rank": "5",
		"elevation": "14336",
		"towns": "Twin Lakes, Leadville, Buena Vista, Aspen",
		"latitude": "39.029444444444444",
		"longitude": "-106.4725"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/5"
}, {
	"type": "peak",
	"id": 6,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516757/14ers/uncompahgre.jpg",
		"peak_name": "Uncompahgre Peak",
		"range": "San Juan Mountains",
		"rank": "6",
		"elevation": "14309",
		"towns": "Lake City, Ouray",
		"latitude": "38.07166666666667",
		"longitude": "-107.46138888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/6"
}, {
	"type": "peak",
	"id": 7,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/crestone_peak.jpg",
		"peak_name": "Crestone Peak",
		"range": "Sangre de Cristo",
		"rank": "7",
		"elevation": "14294",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.96666666666667",
		"longitude": "-105.58472222222221"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/7"
}, {
	"type": "peak",
	"id": 8,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516751/14ers/mt_lincoln.jpg",
		"peak_name": "Mt. Lincoln",
		"range": "Mosquito Range",
		"rank": "8",
		"elevation": "14286",
		"towns": "Alma, Fairplay, Breckenridge",
		"latitude": "39.35138888888889",
		"longitude": "-106.11083333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/8"
}, {
	"type": "peak",
	"id": 9,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/grays.jpg",
		"peak_name": "Grays Peak",
		"range": "Front Range",
		"rank": "9",
		"elevation": "14270",
		"towns": "Bakerville, Montezuma, Keystone",
		"latitude": "39.63388888888889",
		"longitude": "-105.81694444444445"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/9"
}, {
	"type": "peak",
	"id": 10,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516745/14ers/antero.jpg",
		"peak_name": "Mt. Antero",
		"range": "Sawatch Range",
		"rank": "10",
		"elevation": "14269",
		"towns": "Leadville, Buena Vista, Salida",
		"latitude": "38.67388888888889",
		"longitude": "-106.2461111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/10"
}, {
	"type": "peak",
	"id": 11,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516757/14ers/torreys.jpg",
		"peak_name": "Torreys Peak",
		"range": "Front Range",
		"rank": "11",
		"elevation": "14267",
		"towns": "Bakerville, Montezuma, Keystone",
		"latitude": "39.64277777777778",
		"longitude": "-105.82083333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/11"
}, {
	"type": "peak",
	"id": 12,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516747/14ers/castle.jpg",
		"peak_name": "Castle Peak",
		"range": "Elk Mountains",
		"rank": "12",
		"elevation": "14265",
		"towns": "Ashcroft, Crested Butte, Aspen",
		"latitude": "39.00972222222222",
		"longitude": "-106.86138888888888"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/12"
}, {
	"type": "peak",
	"id": 13,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516756/14ers/quandary.jpg",
		"peak_name": "Quandary Peak",
		"range": "Tenmile Range",
		"rank": "13",
		"elevation": "14265",
		"towns": "Breckenridge, Alma, Fairplay, Leadville",
		"latitude": "39.39722222222222",
		"longitude": "-106.10583333333332"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/13"
}, {
	"type": "peak",
	"id": 14,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/mt_evans.jpg",
		"peak_name": "Mt. Evans",
		"range": "Front Range",
		"rank": "14",
		"elevation": "14264",
		"towns": "Denver, Idaho Springs, Georgetown, Evergreen",
		"latitude": "39.58861111111111",
		"longitude": "-105.64277777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/14"
}, {
	"type": "peak",
	"id": 15,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516751/14ers/longs.jpg",
		"peak_name": "Longs Peak",
		"range": "Front Range",
		"rank": "15",
		"elevation": "14255",
		"towns": "Estes Park, Meeker Park",
		"latitude": "40.25472222222222",
		"longitude": "-105.61527777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/15"
}, {
	"type": "peak",
	"id": 16,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516754/14ers/mt_wilson.jpg",
		"peak_name": "Mt. Wilson",
		"range": "San Juan Mountains",
		"rank": "16",
		"elevation": "14246",
		"towns": "Ouray, Telluride, Rico",
		"latitude": "37.83916666666667",
		"longitude": "-107.99083333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/16"
}, {
	"type": "peak",
	"id": 17,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516747/14ers/mt_cameron.jpg",
		"peak_name": "Mt. Cameron",
		"range": "Mosquito Range",
		"rank": "N/A",
		"elevation": "14238",
		"towns": "Alma, Fairplay, Breckenridge",
		"latitude": "39.346944444444446",
		"longitude": "-106.11861111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/17"
}, {
	"type": "peak",
	"id": 18,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516753/14ers/mt_shavano.jpg",
		"peak_name": "Mt. Shavano",
		"range": "Sawatch Range",
		"rank": "17",
		"elevation": "14229",
		"towns": "Salida, Poncha Springs, Buena Vista",
		"latitude": "38.619166666666665",
		"longitude": "-106.23944444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/18"
}, {
	"type": "peak",
	"id": 19,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/mt_belford.jpg",
		"peak_name": "Mt. Belford",
		"range": "Sawatch Range",
		"rank": "18",
		"elevation": "14197",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.96083333333333",
		"longitude": "-106.36055555555555"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/19"
}, {
	"type": "peak",
	"id": 20,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516748/14ers/crestone_needle.jpg",
		"peak_name": "Crestone Needle",
		"range": "Sangre de Cristo",
		"rank": "19",
		"elevation": "14197",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.96472222222223",
		"longitude": "-105.5761111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/20"
}, {
	"type": "peak",
	"id": 21,
	"attributes": {
    "imgSrc": "http://res.cloudinary.com/amhprojects/image/upload/v1514516753/14ers/mt_princeton.jpg",
		"peak_name": "Mt. Princeton",
		"range": "Sawatch Range",
		"rank": "20",
		"elevation": "14197",
		"towns": "Buena Vista, Salida, Leadville",
		"latitude": "38.74944444444444",
		"longitude": "-106.24194444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/21"
}, {
	"type": "peak",
	"id": 22,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516754/14ers/mt_yale.jpg",
		"peak_name": "Mt. Yale",
		"range": "Sawatch Range",
		"rank": "21",
		"elevation": "14196",
		"towns": "Buena Vista, Leadville, Salida",
		"latitude": "38.844166666666666",
		"longitude": "-106.31333333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/22"
}, {
	"type": "peak",
	"id": 23,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/mt_bross.jpg",
		"peak_name": "Mt. Bross",
		"range": "Mosquito Range",
		"rank": "22",
		"elevation": "14172",
		"towns": "Breckenridge, Alma, Leadville",
		"latitude": "39.33527777777778",
		"longitude": "-106.10694444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/23"
}, {
	"type": "peak",
	"id": 24,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516752/14ers/kit_carson.jpg",
		"peak_name": "Kit Carson Peak",
		"range": "Sangre de Cristo",
		"rank": "23",
		"elevation": "14165",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.97972222222222",
		"longitude": "-105.60194444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/24"
}, {
	"type": "peak",
	"id": 25,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/el_diente.jpg",
		"peak_name": "El Diente Peak",
		"range": "San Juan Mountains",
		"rank": "N/A",
		"elevation": "14159",
		"towns": "Ouray, Telluride, Rico",
		"latitude": "37.839444444444446",
		"longitude": "-108.00527777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/25"
}, {
	"type": "peak",
	"id": 26,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516751/14ers/maroon.jpg",
		"peak_name": "Maroon Peak",
		"range": "Elk Mountains",
		"rank": "24",
		"elevation": "14156",
		"towns": "Aspen, Snowmass",
		"latitude": "39.07083333333334",
		"longitude": "-106.98861111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/26"
}, {
	"type": "peak",
	"id": 27,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516757/14ers/tabeguache.jpg",
		"peak_name": "Tabeguache Peak",
		"range": "Sawatch Range",
		"rank": "25",
		"elevation": "14155",
		"towns": "Salida, Poncha Springs, Buena Vista",
		"latitude": "38.62555555555556",
		"longitude": "-106.25055555555555"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/27"
}, {
	"type": "peak",
	"id": 28,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516752/14ers/mt_oxford.jpg",
		"peak_name": "Mt. Oxford",
		"range": "Sawatch Range",
		"rank": "26",
		"elevation": "14153",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.96472222222223",
		"longitude": "-106.33833333333332"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/28"
}, {
	"type": "peak",
	"id": 29,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516753/14ers/mt_sneffels.jpg",
		"peak_name": "Mt. Sneffels",
		"range": "San Juan Mountains",
		"rank": "27",
		"elevation": "14150",
		"towns": "Ridgway, Ouray, Telluride",
		"latitude": "38.00333333333333",
		"longitude": "-107.79166666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/29"
}, {
	"type": "peak",
	"id": 30,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516748/14ers/mt_democrat.jpg",
		"peak_name": "Mt. Democrat",
		"range": "Mosquito Range",
		"rank": "28",
		"elevation": "14148",
		"towns": "Fairplay, Alma, Leadville",
		"latitude": "39.33972222222222",
		"longitude": "-106.13944444444445"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/30"
}, {
	"type": "peak",
	"id": 31,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516745/14ers/capitol.jpg",
		"peak_name": "Capitol Peak",
		"range": "Elk Mountains",
		"rank": "29",
		"elevation": "14130",
		"towns": "Aspen, Snowmass, Carbondale",
		"latitude": "39.150277777777774",
		"longitude": "-107.0825"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/31"
}, {
	"type": "peak",
	"id": 32,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516755/14ers/pikes.jpg",
		"peak_name": "Pikes Peak",
		"range": "Front Range",
		"rank": "30",
		"elevation": "14110",
		"towns": "Manitou Springs, Colorado Springs",
		"latitude": "38.84055555555556",
		"longitude": "-105.04388888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/32"
}, {
	"type": "peak",
	"id": 33,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516756/14ers/snowmass.jpg",
		"peak_name": "Snowmass Mountain",
		"range": "Elk Mountains",
		"rank": "31",
		"elevation": "14092",
		"towns": "Aspen, Snowmass, Carbondale",
		"latitude": "39.11888888888889",
		"longitude": "-107.06583333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/33"
}, {
	"type": "peak",
	"id": 34,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516748/14ers/mt_eolus.jpg",
		"peak_name": "Mt. Eolus",
		"range": "San Juan Mountains",
		"rank": "32",
		"elevation": "14083",
		"towns": "Silverton, Ouray",
		"latitude": "37.62277777777778",
		"longitude": "-107.62083333333332"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/34"
}, {
	"type": "peak",
	"id": 35,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516758/14ers/wisdom.jpg",
		"peak_name": "Windom Peak",
		"range": "San Juan Mountains",
		"rank": "33",
		"elevation": "14082",
		"towns": "Silverton, Ouray",
		"latitude": "37.62138888888889",
		"longitude": "-107.59138888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/35"
}, {
	"type": "peak",
	"id": 36,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516747/14ers/challenger_point.jpg",
		"peak_name": "Challenger Point",
		"range": "Sangre de Cristo",
		"rank": "34",
		"elevation": "14081",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.98027777777778",
		"longitude": "-105.6061111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/36"
}, {
	"type": "peak",
	"id": 37,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/mt_columbia.jpg",
		"peak_name": "Mt. Columbia",
		"range": "Sawatch Range",
		"rank": "35",
		"elevation": "14073",
		"towns": "Buena Vista, Leadville, Salida",
		"latitude": "38.903888888888886",
		"longitude": "-106.29694444444445"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/37"
}, {
	"type": "peak",
	"id": 38,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/missouri.jpg",
		"peak_name": "Missouri Mountain",
		"range": "Sawatch Range",
		"rank": "36",
		"elevation": "14067",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.947222222222216",
		"longitude": "-106.37777777777777"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/38"
}, {
	"type": "peak",
	"id": 39,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516751/14ers/humboldt.jpg",
		"peak_name": "Humboldt Peak",
		"range": "Sangre de Cristo",
		"rank": "37",
		"elevation": "14064",
		"towns": "Silver Cliff, Westcliffe, Bradford, Crestone",
		"latitude": "37.976111111111116",
		"longitude": "-105.55472222222222"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/39"
}, {
	"type": "peak",
	"id": 40,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/bierstadt.jpg",
		"peak_name": "Mt. Bierstadt",
		"range": "Front Range",
		"rank": "38",
		"elevation": "14060",
		"towns": "Georgetown, Idaho Springs, Grant",
		"latitude": "39.58277777777778",
		"longitude": "-105.66805555555555"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/40"
}, {
	"type": "peak",
	"id": 41,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516747/14ers/conundrum.jpg",
		"peak_name": "Conundrum Peak",
		"range": "Elk Mountains",
		"rank": "N/A",
		"elevation": "14060",
		"towns": "Ashcroft, Crested Butte, Aspen",
		"latitude": "39.01444444444444",
		"longitude": "-106.86388888888888"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/41"
}, {
	"type": "peak",
	"id": 42,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516758/14ers/sunlight.jpg",
		"peak_name": "Sunlight Peak",
		"range": "San Juan Mountains",
		"rank": "39",
		"elevation": "14059",
		"towns": "Silverton, Ouray",
		"latitude": "37.62722222222222",
		"longitude": "-107.59527777777777"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/42"
}, {
	"type": "peak",
	"id": 43,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516750/14ers/handies.jpg",
		"peak_name": "Handie Peak",
		"range": "San Juan Mountains",
		"rank": "40",
		"elevation": "14048",
		"towns": "Ouray, Lake City, Silverton, Telluride",
		"latitude": "37.91305555555555",
		"longitude": "-107.5038888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/43"
}, {
	"type": "peak",
	"id": 44,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516748/14ers/culebra.jpg",
		"peak_name": "Culebra Peak",
		"range": "Sangre de Cristo",
		"rank": "41",
		"elevation": "14047",
		"towns": "San Luis, Fort Garland, Alamosa, Trinidad",
		"latitude": "37.12222222222222",
		"longitude": "-105.185"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/44"
}, {
	"type": "peak",
	"id": 45,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/ellingwood.jpg",
		"peak_name": "Ellingwood Point",
		"range": "Sangre de Cristo",
		"rank": "42",
		"elevation": "14042",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.5825",
		"longitude": "-105.49194444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/45"
}, {
	"type": "peak",
	"id": 46,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516750/14ers/mt_lindsey.jpg",
		"peak_name": "Mt. Lindsey",
		"range": "Sangre de Cristo",
		"rank": "43",
		"elevation": "14042",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.584722222222226",
		"longitude": "-105.44027777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/46"
}, {
	"type": "peak",
	"id": 47,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516755/14ers/north_eolus.jpg",
		"peak_name": "North Eolus",
		"range": "San Juan Mountains",
		"rank": "N/A",
		"elevation": "14039",
		"towns": "Silverton, Ouray",
		"latitude": "37.625277777777775",
		"longitude": "-107.6211111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/47"
}, {
	"type": "peak",
	"id": 48,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516753/14ers/little_bear.jpg",
		"peak_name": "Little Bear Peak",
		"range": "Sangre de Cristo",
		"rank": "44",
		"elevation": "14037",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.56666666666667",
		"longitude": "-105.49666666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/48"
}, {
	"type": "peak",
	"id": 49,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516753/14ers/mt_sherman.jpg",
		"peak_name": "Mt. Sherman",
		"range": "Mosquito Range",
		"rank": "45",
		"elevation": "14036",
		"towns": "Fairplay, Alma, Leadville",
		"latitude": "39.225",
		"longitude": "-106.16916666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/49"
}, {
	"type": "peak",
	"id": 50,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516755/14ers/redcloud.jpg",
		"peak_name": "Redcloud Peak",
		"range": "San Juan Mountains",
		"rank": "46",
		"elevation": "14034",
		"towns": "Ouray, Lake City, Silverton, Telluride",
		"latitude": "37.94083333333333",
		"longitude": "-107.4213888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/50"
}, {
	"type": "peak",
	"id": 51,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516755/14ers/pyramid.jpg",
		"peak_name": "Pyramid Peak",
		"range": "Elk Mountains",
		"rank": "47",
		"elevation": "14018",
		"towns": "Aspen, Snowmass",
		"latitude": "39.07138888888889",
		"longitude": "-106.94972222222222"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/51"
}, {
	"type": "peak",
	"id": 52,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516757/14ers/wilson.jpg",
		"peak_name": "Wilson Peak",
		"range": "San Juan Mountains",
		"rank": "48",
		"elevation": "14017",
		"towns": "Ouray, Telluride, Rico",
		"latitude": "37.86027777777778",
		"longitude": "-107.98416666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/52"
}, {
	"type": "peak",
	"id": 53,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516757/14ers/wetterhorn.jpg",
		"peak_name": "Wetterhorn Peak",
		"range": "San Juan Mountains",
		"rank": "49",
		"elevation": "14015",
		"towns": "Lake City, Ouray",
		"latitude": "38.06055555555555",
		"longitude": "-107.51027777777777"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/53"
}, {
	"type": "peak",
	"id": 54,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516755/14ers/san_luis.jpg",
		"peak_name": "San Luis Peak",
		"range": "San Juan Mountains",
		"rank": "50",
		"elevation": "14014",
		"towns": "Creede, Lake City, Gunnison",
		"latitude": "37.98694444444445",
		"longitude": "-106.93083333333334"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/54"
}, {
	"type": "peak",
	"id": 55,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516754/14ers/north_maroon.jpg",
		"peak_name": "North Maroon Peak",
		"range": "Elk Mountains",
		"rank": "N/A",
		"elevation": "14014",
		"towns": "Aspen, Snowmass",
		"latitude": "39.07611111111112",
		"longitude": "-106.98722222222223"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/55"
}, {
	"type": "peak",
	"id": 56,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516752/14ers/mt_of_the_holy_cross.jpg",
		"peak_name": "Mt. of the Holy Cross",
		"range": "Sawatch Mountains",
		"rank": "51",
		"elevation": "14005",
		"towns": "Red Cliff, Minturn, Vail",
		"latitude": "39.46805555555556",
		"longitude": "-106.47916666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/56"
}, {
	"type": "peak",
	"id": 57,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516750/14ers/huron.jpg",
		"peak_name": "Huron Peak",
		"range": "Sawatch Mountains",
		"rank": "52",
		"elevation": "14003",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.945277777777775",
		"longitude": "-106.4375"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/57"
}, {
	"type": "peak",
	"id": 58,
	"attributes": {
    "imgSrc": "https://res.cloudinary.com/amhprojects/image/upload/v1514516756/14ers/sunshine.jpg",
		"peak_name": "Sunshine Peak",
		"range": "San Juan Mountains",
		"rank": "53",
		"elevation": "14001",
		"towns": "Ouray, Lake City, Silverton, Telluride",
		"latitude": "37.922777777777775",
		"longitude": "-107.42500000000001"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/58"
}];
