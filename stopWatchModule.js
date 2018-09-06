/**
 * fully featured stop watch ready for integration into projects
 * @authors a rogala
 * @date    5/15/18
 * @version 1.0
 */

//UI controller
//get user input and update UI
const UIController = (function() {
	let hours,minutes,seconds,deciSeconds;
	let lapHours, lapMinutes, lapSeconds, lapDeciSeconds;
	//store html classes and IDs in an object so we can call them elsewhere
	//then if html changes we only need to update here
	const DOMstrings = {
		hoursElapsed:   	'hoursElapsed',
		minutesElapsed: 	'minutesElapsed',
		secondsElapsed: 	'secondsElapsed',
		deciSecondsElapsed: 'deciSecondsElapsed',
		startBtn: 			'startBtn',
		resetBtn: 			'resetBtn',
		stopBtn:  			'stopBtn',
		lapBtn:   			'lapBtn',
		laps:  				'laps'
	};

	//return public methods to get html elements, and updateUI on the times and lap display
	return {

		//this public method returns an objcet containing html elements
		getInput: function() {
			return {
				hoursElement:   	document.getElementById(DOMstrings.hoursElapsed),
				minutesElement: 	document.getElementById(DOMstrings.minutesElapsed),
				secondsElement: 	document.getElementById(DOMstrings.secondsElapsed),
				deciSecondsElement: document.getElementById(DOMstrings.deciSecondsElapsed),
				startButtonElement: document.getElementById(DOMstrings.startBtn),
				resetButtonElement: document.getElementById(DOMstrings.resetBtn),
				stopButtonElement: 	document.getElementById(DOMstrings.stopBtn),
				lapButtonElement: 	document.getElementById(DOMstrings.lapBtn),
				lapsListElement: 	document.getElementById(DOMstrings.laps)
			};
		},

		// timeArray[hours, minutes, seconds, deciSeconds, count]
		updateStopWatchUI: function(timeArray) {

			//display leading zero and : for hours
			if(timeArray[0] <= 9) {
				hours 												 = '0' + timeArray[0] + ':';
				UIController.getInput().hoursElement.innerHTML 		 = hours;
			}
			else if(timeArray[0] > 9) {
				hours 												 = timeArray[0] + ':';
				UIController.getInput().hoursElement.innerHTML 		 = hours;
			}
			//display leading zero and : for minutes
			if(timeArray[1] <= 9) {
				minutes  											 = '0' + timeArray[1] + ':';
				UIController.getInput().minutesElement.innerHTML	 = minutes;
			}
			else if(timeArray[1] > 9) {
				minutes                                              = timeArray[1] + ':';
				UIController.getInput().minutesElement.innerHTML	 = minutes;
			}
			//display leading zero and . for seconds
			if(timeArray[2] <= 9) {
				seconds 											 = '0' + timeArray[2] + '.';
				UIController.getInput().secondsElement.innerHTML 	 = seconds;
			}
			else if(timeArray[2] > 9) {
				seconds 											 = timeArray[2] + '.';
				UIController.getInput().secondsElement.innerHTML 	 = seconds;
			}
			//display leading zero for deciSeconds
			if(timeArray[3] <= 9) {
				deciSeconds 										 = '0' + timeArray[3];
				UIController.getInput().deciSecondsElement.innerHTML = deciSeconds;
			}
			else if(timeArray[3] > 9) {
				deciSeconds   										 = timeArray[3];
				UIController.getInput().deciSecondsElement.innerHTML = deciSeconds;
			}
		},

		updateLapUI: function(lapTimeArray, lapCount) {
			//display leading zero and : for lapHours
			if(lapTimeArray[0] <= 9) {
				lapHours = '0' + lapTimeArray[0] + ':';
			}
			else if(lapTimeArray[0] > 9) {
				lapHours = lapTimeArray[0] + ':';
			}
			//display leading zero and : for minutes
			if(lapTimeArray[1] <= 9) {
				lapMinutes = '0' + lapTimeArray[1] + ':';
			}
			else if(lapTimeArray[1] > 9) {
				lapMinutes = lapTimeArray[1] + ':';
			}
			//display leading zero and . for seconds
			if(lapTimeArray[2] <= 9) {
				lapSeconds = '0' + lapTimeArray[2] + '.';
			}
			else if(lapTimeArray[2] > 9) {
				lapSeconds = lapTimeArray[2] + '.';
			}
			//display leading zero for deciSeconds
			if(lapTimeArray[3] <= 9) {
				lapDeciSeconds = '0' + lapTimeArray[3];
			}
			else if(lapTimeArray[3] > 9) {
				lapDeciSeconds = lapTimeArray[3];
			}

			UIController.getInput().lapsListElement.innerHTML += '<li class="lapOutput">' + 'Lap: ' + lapCount + ' '
			+ hours + minutes + seconds + deciSeconds + ' LAP TIME: ' + lapHours + lapMinutes + lapSeconds + lapDeciSeconds + '</li>';
		},
		//the initial UI display will hide the reset stop and lap buttons
		initialDisplay: function() {
			UIController.getInput().resetButtonElement.style.cssText = 'display: none';
			UIController.getInput().stopButtonElement.style.cssText  = 'display: none';
			UIController.getInput().lapButtonElement.style.cssText   = 'display: none';
		},
		//the display while stop watch is running (only show stop and lap)
		runningDisplay: function() {
			UIController.getInput().startButtonElement.style.cssText = 'display: none';
			UIController.getInput().resetButtonElement.style.cssText = 'display: none';

			UIController.getInput().stopButtonElement.style.cssText  = 'display: initial';
			UIController.getInput().lapButtonElement.style.cssText   = 'display: initial';
		},
		//the display while stop watch is stopped (only show start and reset)
		stoppedDisplay: function() {
			UIController.getInput().startButtonElement.style.cssText = 'display: initial';
			UIController.getInput().resetButtonElement.style.cssText = 'display: initial';

			UIController.getInput().stopButtonElement.style.cssText = 'display: none';
			UIController.getInput().lapButtonElement.style.cssText  = 'display: none';
		}
	};

})();

//stop watch calculation and lap time calculation methods
const StopWatchCalc = (function() {
	let count = 0;
	let hours, minutes, seconds, deciSeconds;
	let lapHours, lapMinutes, lapSeconds, lapDeciSeconds;
	let lapTimeArray = [];
	let timeArray = [];
	//public stop watch and lap time methods
	return {
		/*
		* stop watch is calculated for 10 millisecond intervals
		* stop watch returns a timeArray[hours, minutes, seconds, deciSeconds]
		* 1 count = 0.01 second (10 MilliSeconds)
		* 100 count = 1 second
		* 6,000 count = 1 minute
		* 360,000 count = 1 hour
		*/
		StopWatch : function() {
			//deciSeconds
			if(count <= 99) {
				deciSeconds = count;
				count 		= count + 1;
			}
			//seconds
			else if(count >= 100 && count < 6000) {
				seconds 	= Math.floor(count/100);
				deciSeconds	= Math.floor((count%100));
				count 		= count + 1;
			}
			//minutes
			else if(count >= 6000 && count < 360000) {
				minutes 	= Math.floor(count/6000);
				seconds 	= Math.floor((count%6000)/100);
				deciSeconds	= Math.floor((count%100));
				count 		= count + 1;
			}
			//hours
			else if(count >= 360000) {
				hours 		= Math.floor(count/360000);
				minutes 	= Math.floor((count%360000)/6000);
				seconds		= Math.floor(((count%360000)%6000)/100);
				deciSeconds	= Math.floor((count%100));
				count 		= count + 1;
			}
			//populate and return timeArray
			//count - 1 is used to calculate lap time
			if(seconds === undefined) {
				timeArray = [0,0,0,deciSeconds,count -1];
			}
			else if(minutes === undefined) {
				timeArray = [0,0,seconds,deciSeconds,count -1];
			}
			else if(hours === undefined) {
				timeArray = [0,minutes,seconds,deciSeconds,count -1];
			}
			else {
				timeArray = [hours,minutes,seconds,deciSeconds,count -1];
			}
			return timeArray;
		},
		//the difference between lap x and lap y count will give us the lap time as a count
		//convert that count to lap time
		LapCalc: function(timeArray, lapCount) {
			let lapTimeCount, countOddTemp, countEvenTemp;
			//clear previous lap time
			lapHours 	   = 0;
			lapMinutes 	   = 0;
			lapSeconds 	   = 0;
			lapDeciSeconds = 0;

			if(lapCount === 1) {
				lapTimeCount = timeArray[4];
				sessionStorage.setItem('countOddTemp', timeArray[4]);
			}
			//if even
			else if(lapCount%2 === 0) {
				sessionStorage.setItem('countEvenTemp', timeArray[4]);
				countEvenTemp = sessionStorage.getItem('countEvenTemp');
				countOddTemp = sessionStorage.getItem('countOddTemp');

				lapTimeCount = countEvenTemp - countOddTemp;
			}
			//if odd and not 1
			else if(lapCount%2 === 1 && lapCount !== 1) {
				sessionStorage.setItem('countOddTemp', timeArray[4]);
				countEvenTemp = sessionStorage.getItem('countEvenTemp');
				countOddTemp = sessionStorage.getItem('countOddTemp');

				lapTimeCount = countOddTemp - countEvenTemp;
			}
			//convert lapTimeCount to time format
			//deciSeconds
			if(lapTimeCount <= 99) {
				lapDeciSeconds = lapTimeCount;
			}
			//seconds
			else if(lapTimeCount >= 100 && lapTimeCount < 6000) {
				lapSeconds 		= Math.floor(lapTimeCount/100);
				lapDeciSeconds	= Math.floor((lapTimeCount%100));
			}
			//minutes
			else if(lapTimeCount >= 6000 && lapTimeCount < 360000) {
				lapMinutes 		= Math.floor(lapTimeCount/6000);
				lapSeconds 		= Math.floor((lapTimeCount%6000)/100);
				lapDeciSeconds	= Math.floor((lapTimeCount%100));
			}
			//hours
			else if(lapTimeCount >= 360000) {
				lapHours 		= Math.floor(lapTimeCount/360000);
				lapMinutes 		= Math.floor((lapTimeCount%360000)/6000);
				lapSeconds		= Math.floor(((lapTimeCount%360000)%6000)/100);
				lapDeciSeconds	= Math.floor((lapTimeCount%100));
			}
			//populate and return lapTimeArray
			if(lapSeconds === undefined) {
				lapTimeArray = [0,0,0,lapDeciSeconds];
			}
			else if(lapMinutes === undefined) {
				lapTimeArray = [0,0,lapSeconds,lapDeciSeconds];
			}
			else if(lapHours === undefined) {
				lapTimeArray = [0,lapMinutes,lapSeconds,lapDeciSeconds];
			}
			else {
				lapTimeArray = [lapHours,lapMinutes,lapSeconds,lapDeciSeconds];
			}
			return lapTimeArray;
		}
	};

})();

//the interface that controls stop watch, lap time, and UI
const Controller = (function(UICtrl, StopWatchCtrl) {
	let intervalID;
	let timeArray;
	let lapTimeArray;
	let lapCount = 0;
	const setUpEventListeners = function () {
		//set up listener on start button start stop watch when clicked
		UICtrl.getInput().startButtonElement.addEventListener('click', function() {
			startStopWatchUpdateUI();
		});

		//set up listener on reset button reload page when clicked
		UICtrl.getInput().resetButtonElement.addEventListener('click', function() {
			window.location.reload(true);
		});

		//set up listener on stop button stop the stop watch when clicked
		UICtrl.getInput().stopButtonElement.addEventListener('click', function() {
			clearInterval(intervalID);
			stoppedStopWatch();
		});

		//set up listener on lap button call the lap function when clicked
		UICtrl.getInput().lapButtonElement.addEventListener('click', function() {
			lap();
		});
	};

	//calculate lap time and update UI
	const lap = function() {
		lapCount += 1;
		lapTimeArray = StopWatchCtrl.LapCalc(timeArray, lapCount);
		UICtrl.updateLapUI(lapTimeArray, lapCount);
	};

	//start stop watch and update UI
	const startStopWatchUpdateUI = function () {
		UICtrl.runningDisplay();

		intervalID = setInterval(function() {
			timeArray = StopWatchCtrl.StopWatch();
			UICtrl.updateStopWatchUI(timeArray);
		},10);

	};

	//update UI display for stopped stop watch
	const stoppedStopWatch = function() {
		UICtrl.stoppedDisplay();
	};

	//return an initialization object
	return {
		init: function() {
			setUpEventListeners();
		},

		initDisplay: function() {
			UICtrl.initialDisplay();
		}
	};

})(UIController,StopWatchCalc);

//call the initialization object to set up event listeners
Controller.init();
Controller.initDisplay();




