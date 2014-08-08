var totalTime = 10000; // total time of one game
var checkInterval = 800; // the time it waits for the next game
var clockInterval = 100; // the time the clock refreshes 
var game24 = angular.module('game24', []);
var lines = [
    "你早就饿死了！",
    "你勉强养活了自己",
    "你养活了全班！",
    "你养活了一条街！",
    "你养活了你们全小区！",
    "你养活了整个中国！",
    "你养活了整个地球！"
];
game24.factory('Data', function() {
    return {
        isGameOn: false,
        numOfSolved: 0,
        clockStyle: {
            color: "green"
        },
        numbers: [1, 2, 3, 4]
    };
});
game24.controller('SettingsController', function($scope, Data) {
    $scope.data = Data;
    $scope.gameOn = true;
    $scope.restartGame = function() {
        Data.isGameOn = false;
        Data.numOfSolved = 0;
        Data.clockStyle.color = "green";
        $scope.panel.remainingTime = totalTime;
    };
    $scope.startGame = function() {
        Data.isGameOn = true;
        $scope.panel.startTime = new Date();
        for (var i = 0; i < 4; i++) {
            $scope.data.numbers[i] = randomCard();
        }
    };
    $scope.panel = {
        title: "1 min game",
        remainingTime: totalTime,
        startTime: null,
        currentTime: null
    };
    $scope.calcIQ = function(num) {
        if (num>6)
            num = 6;
        return lines[num];
    };
    var updateClock = function() {
        if ($scope.data.isGameOn) {
            $scope.panel.currentTime = new Date();
            $scope.panel.remainingTime = totalTime - ($scope.panel.currentTime - $scope.panel.startTime);
            if ($scope.panel.remainingTime < totalTime / 2) {
                $scope.data.clockStyle.color = "orange";
            }
            if ($scope.panel.remainingTime < totalTime / 10) {
                $scope.data.clockStyle.color = "red";
            }
            if ($scope.panel.remainingTime <= 0) {
                $scope.data.isGameOn = false;
                $scope.gameOn = false;
            } //clearInterval(clockInt);}
        }
    };
    var clockInt = setInterval(function() {
        $scope.$apply(updateClock);
    }, clockInterval);
});
game24.controller('NumberController', function($scope, $parse, Data) {
    $scope.data = Data;
    $scope.responseColor = {
        color: "red"
    };
    var result = 0;
    $scope.expr = "";
    $scope.feedback = "";
    $scope.$watch('expr', function(newVal, oldVal, scope) {
        if (newVal !== oldVal) {
            try {
                result = eval(newVal);
            } catch (err) {
                null;
            }
        }
    });

    $scope.init = function() {
        newNumbers = new Array();
        for (var i = 0; i < 4; i++) {
            newNumbers.push(randomCard());
        }
        $scope.data.numbers = newNumbers;
    };
    $scope.submit = function() {
        if (result == 24 && validate($scope.data.numbers, $scope.expr)) {
            $scope.responseColor.color = "green";
            $scope.feedback = "对了!";
            if ($scope.data.isGameOn) {
                $scope.data.numOfSolved += 1;
            }
        } else {
            $scope.responseColor.color = "red";
            $scope.feedback = "逗我呢？错了";
        }
        var update = function() {
            $scope.feedback = "";
            $scope.expr = "";
            clearInterval(refreshID);
            $scope.init();
        }
        var refreshID = setInterval(function() {
            $scope.$apply(update);
        }, checkInterval);
    }


    $scope.press = function(n) {
        switch (n) {
            case 0:
                $scope.expr += ($scope.data.numbers[0]).toString();
                break;
            case 1:
                $scope.expr += ($scope.data.numbers[1]).toString();
                break;
            case 2:
                $scope.expr += ($scope.data.numbers[2]).toString();
                break;
            case 3:
                $scope.expr += ($scope.data.numbers[3]).toString();
                break;
            case 4:
                $scope.expr += "+";
                break;
            case 5:
                $scope.expr += "-";
                break;
            case 6:
                $scope.expr += "*";
                break;
            case 7:
                $scope.expr += "/";
                break;
            case 8:
                $scope.expr += "(";
                break;
            case 9:
                $scope.expr += ")";
                break;
            case 10:
                if ($scope.expr.length != 0) {
                    $scope.expr = $scope.expr.slice(0, -1);
                }
                break;
            case 11:
                $scope.expr = "";
                break;
        }
    }
});

game24.filter('clockFilter', function() {
    return function(input) {
        if (input > 0) {
            return (input / 1000).toFixed(2);
        } else {
            return (0).toFixed(2);
        }
    };
});

game24.directive('wechat-share', function() {
    
})

/* Helper Functions */

function randomCard() {
    var interval = 1.0 / 13;
    var result = parseInt(Math.random() / interval) + 1;
    return result;
}

function isDigit(chr) {
    if (chr >= "0" && chr <= "9") {
        return true;
    }
    return false;
}

function array_equal(array1, array2) {
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}

function validate(numbers, response) {
    numbersCopy = numbers.slice(0); // copy by value
    parsedInts = new Array();
    current_number = "";
    for (var i = 0; i < response.length; i++) {
        if (isDigit(response[i])) {
            current_number += response[i];
        } else {
            if (current_number) {
                parsedInts.push(parseInt(current_number));
                current_number = "";
            }
        }
    }
    if (current_number) {
        parsedInts.push(parseInt(current_number));
        current_number = "";
    }
    if (parsedInts.length != 4) {
        return false;
    }
    if (!array_equal(parsedInts.sort(), numbersCopy.sort())) {
        return false;
    }
    return true;
}