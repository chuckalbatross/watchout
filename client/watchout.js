// start slingin' some d3 here.
// var jsonCircles = [
//   { "x_axis": 30, "y_axis": 30, "radius": 6},    //MAKE X_AXIS RANDOM
//   { "x_axis": 70, "y_axis": 70, "radius": 6},    //MAKE Y_AXIS RANDOM
//   { "x_axis": 110, "y_axis": 100, "radius": 6}];

// var svgContainer = d3.select("body").append("svg")
//                                     .attr("width", 200)
//                                     .attr("height", 200);

// var circles = svgContainer.selectAll("circle")
//                           .data(jsonCircles)
//                           .enter()
//                           .append("circle");

// var circleAttributes = circles
//                        .attr("cx", function (d) { return d.x_axis; })
//                        .attr("cy", function (d) { return d.y_axis; })
//                        .attr("r", function (d) { return d.radius; });

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20,
  radius: 10
};

var gameStats = {
  score: 0,
  bestScore: 0
};

// var axes = {
//   x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
//   y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
// };

var gameBoard = d3.select('.board')
  .append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

var createEnemies = function() {
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return {
      id: i,
      x: getOutOfBounds(Math.random() * gameOptions.width, gameOptions.width),
      y: getOutOfBounds(Math.random() * gameOptions.height, gameOptions.height)
    };
  });
};

var player = [{
  x: gameOptions.width / 2,
  y: 220,
}];

var playerD3 = gameBoard.selectAll('circle').data([{x: gameOptions.width / 2, y: gameOptions.height}]);
playerD3.enter().append('svg:circle')
  .attr('class', 'player')
  .attr('cx', player[0].x)
  .attr('cy', player[0].y)
  .attr('r', 10)
  .attr('fill', 'red')
  // .call(d3.behavior.drag().on('drag', dragged));
  .call(d3.behavior.drag()
    .on('drag', function(d) {
      d.x = getOutOfBounds(d3.event.x, gameOptions.width);
      d.y = getOutOfBounds(d3.event.y, gameOptions.height); 
      d3.select('circle.player').attr('cx', d.x).attr('cy', d.y);
    }))

var getOutOfBounds = function(coord, axis) {
  if (coord > (axis - gameOptions.radius)) {
    return (axis - gameOptions.radius);
  } else if (coord < gameOptions.radius) {
    return gameOptions.radius;
  } else {
    return coord;
  }
}

var render = function(enemyData) {
  var enemies = gameBoard.selectAll('circle.enemy').data(enemyData, function(d) {
    return d.id;
  });
  enemies.enter().append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy) {
      // return axes.x(enemy.x);
      return enemy.x;
    }).attr('cy', function(enemy) {
      // return axes.y(enemy.y);
      return enemy.y;
    }).attr('r', 0);

  //WHY DO WE NEED THIS IF WE'RE NOT ADDING DATA LIKE TAXI EXAMPLE?
  enemies.exit().remove();

  // var checkCollision = function() {

  // };

  // var onCollision = function() {

  // };

  // var tweenWithCollisionDetection = function() {

  // };

  // enemies.move = function(new_position_data) {
  //   return this.transition().duration(1000)
  //     .attr('cx', function(enemy) {
  //       return axes.x(enemy)
  //     })
  // };


  return enemies.transition().duration(1000)
    .attr('r', 10)
    .transition().duration(1000)
    .attr('cx', function(enemy) {
      return Math.random() * 700;
    }).attr('cy', function(enemy) {
      return Math.random() * 450;
    });
};

// var newEnemyPositions = createEnemies();
// render(newEnemyPositions);


var play = function() {
  // var newEnemies = createEnemies();
  // var enemies = render(newEnemyPositions);

  var gameTurn = function() {
    var newEnemyPositions = createEnemies();
    return render(newEnemyPositions);
  };
  gameTurn();
  setInterval(gameTurn, 2000);
};

play();






// LOOP PART OF THE GAME
// var play = function() {

//   var gameTurn = function() {
//     //create enemies
//     var newEnemyPositions = createEnemies();
//     //render enemies
//     return render(newEnemyPositions);
//   }
//   var increaseScore = function() {

//   }
//   gameTurn();
//   setInterval.bind(this, gameTurn, 2000);
//   return setInterval.bind(this, increaseScore, 50);
// }

// play();


















