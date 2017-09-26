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

var enemiesGlobal;


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
    }));

var getOutOfBounds = function(coord, axis) {
  if (coord > (axis - gameOptions.radius)) {
    return (axis - gameOptions.radius);
  } else if (coord < gameOptions.radius) {
    return gameOptions.radius;
  } else {
    return coord;
  }
};

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
  enemiesGlobal = enemies;



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
    .tween('detect-collisions', tweenWithCollisionDetection)
    .attr('cx', function(enemy) {
      return getOutOfBounds(Math.random() * gameOptions.width, gameOptions.width);
    }).attr('cy', function(enemy) {
      return getOutOfBounds(Math.random() * gameOptions.height, gameOptions.height);
    });
};

var tweenWithCollisionDetection = function() {
  var currEnemy = d3.select(this);
  return function() {
    checkCollision(currEnemy);
  };
};

var checkCollision = function(enemy) {
  var player = d3.select('circle.player');

  var dx = player.attr('cx') - enemy.attr('cx');
  var dy = player.attr('cy') - enemy.attr('cy');
  var distance = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
  // console.log(distance);
  if (distance < gameOptions.radius * 2) {
    console.log('collision detected!');
    collision();
  }
};


// var checkCollision = function() {
//   return function() {
//     var player = d3.select('circle.player');

//     d3.select('circle.enemy').each(function() {
//       var enemy = d3.select(this);

//       var dx = player.attr('cx') - enemy.attr('cx');
//       var dy = player.attr('cy') - enemy.attr('cy');
//       var distance = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
//       // console.log(distance);
//       if (distance < gameOptions.radius * 2) {
//         console.log('collision detected!');
//       }
//     });
//   }
// }

var collision = function () {
  gameStats.score = 0;
};


// var checkCollision = function() {
//   // var enemyX;
//   // var enemyXRightLim;
//   // var enemyXLeftLim;

//   // var enemyY;
//   // var enemyYBottomLim;
//   // var enemyYTopLim;

//   var playerX = parseInt(d3.select('circle.player').attr('cx'));
//   var playerXRightLim = playerX + gameOptions.radius / 2;
//   var playerXLeftLim = playerX - gameOptions.radius / 2;

//   var playerY = parseInt(d3.select('circle.player').attr('cy'));
//   var playerYBottomLim = playerY + gameOptions.radius / 2;
//   var playerYTopLim = playerY - gameOptions.radius / 2;

//   // d3.selectAll('circle.enemy').each(function() {
//   var enemy = d3.select(this);
//   var enemyX = parseInt(enemy.attr('cx'));
//   var enemyXRightLim = enemyX + gameOptions.radius / 2;
//   var enemyXLeftLim = enemyX - gameOptions.radius / 2;
//   var enemyY = parseInt(enemy.attr('cy'));
//   var enemyYBottomLim = enemyY + gameOptions.radius / 2;
//   var enemyYTopLim = enemyY - gameOptions.radius / 2;

//   //if enemy's x-coordinate +/- 5 is within player's x-coordinate +/- 5
//   if (playerXRightLim > enemyXLeftLim && playerXLeftLim < enemyXRightLim && playerYBottomLim > enemyYTopLim && playerYTopLim < playerYBottomLim) {
//     //if enemy's y-coordinate +/- 5 is within player's y-coordinate +/- 5
//       console.log(`collsion detected`);
//   }
// };





// var newEnemyPositions = createEnemies();
// render(newEnemyPositions);


var play = function() {
  // var newEnemies = createEnemies();
  // var enemies = render(newEnemyPositions);

  var gameTurn = function() {
    var newEnemyPositions = createEnemies();
    return render(newEnemyPositions);
  };
  var setScore = function() {
    gameStats.score += 1;
    d3.select('.current').select('span').text(gameStats.score);
    if (gameStats.score > gameStats.bestScore) {
      gameStats.bestScore = gameStats.score;
      d3.select('.highscore').select('span').text(gameStats.score);
    }
  }
  gameTurn();
  setInterval(gameTurn, 2000);
  setInterval(setScore, 50);
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


















