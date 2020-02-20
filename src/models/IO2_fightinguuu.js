import _ from 'lodash';

const NUM_PREDICTORS = 27;
const lenRFind = [20];
const limit = [10, 20, 60];
const beat = { R: 'P', P: 'S', S: 'R' };
const notLose = { R: 'PPR', P: 'SSP', S: 'RRS' };
let myHis = '';
let yourHis = '';
let bothHis = '';
const listPredictors = _.fill(Array(NUM_PREDICTORS), '');
let length = 0;
const temp1 = {
  PP: '1',
  PR: '2',
  PS: '3',
  RP: '4',
  RR: '5',
  RS: '6',
  SP: '7',
  SR: '8',
  SS: '9',
};
const temp2 = {
  1: 'PP',
  2: 'PR',
  3: 'PS',
  4: 'RP',
  5: 'RR',
  6: 'RS',
  7: 'SP',
  8: 'SR',
  9: 'SS',
};
const whoWin = {
  PP: 0,
  PR: 1,
  PS: -1,
  RP: -1,
  RR: 0,
  RS: 1,
  SP: 1,
  SR: -1,
  SS: 0,
};
const scorePredictor = _.fill(Array(NUM_PREDICTORS), 0);
let predictors = [];
let output;

const predict = (input) => {
  if (input === '') {
    output = _.sample('R', 'P', 'S');
    predictors = _.fill(Array(NUM_PREDICTORS), output);
    return output;
  }
  // update predictors

  let last5Predictors;

  if (listPredictors[0].length < 5) {
    last5Predictors = [...listPredictors];
  } else {
    last5Predictors = _.slice(
      listPredictors,
      listPredictors.length - 5,
      listPredictors.length,
    );
  }

  predictors.forEach((predictor, i) => {
    let result;
    if (predictor === input) {
      result = '1';
    } else {
      result = '0';
    }
    listPredictors[i] = [...last5Predictors, result]; // only 5 rounds before
  });

  // history matching 1-6
  myHis += output;
  yourHis += input;
  bothHis += temp1[`${input}${output}`];
  length += 1;

  Array(1).forEach((_, i) => {
    const lenSize = _.min(length, lenRFind[i]);
    let j = lenSize;

    // your his
    while (
      j >= 1
        && !_.slice(bothHis, 0, length - 1).includes(bothHis[length])
    ) {
      j -= 1;

      if (j >= 1) {
        const k = _.slice(bothHis, 0, length - 1).lastIndexOf(bothHis(length));
        predictors[2 + 6 * i] = yourHis[j + k];
        predictors[3 + 6 * i] = beat[myHis[j + k]];
      } else {
        predictors[2 + 6 * i] = _.sample('R', 'P', 'S');
        predictors[3 + 6 * i] = _.sample('R', 'P', 'S');
      }
    }

    j = lenSize;
    // my his
    while (
      j >= 1
        && !_.slice(myHis, 0, length - 1).includes(myHis[length])
    ) {
      j -= 1;

      if (j >= 1) {
        const k = _.slice(myHis, 0, length - 1).lastIndexOf(myHis(length));
        predictors[2 + 6 * i] = yourHis[j + k];
        predictors[3 + 6 * i] = beat[myHis[j + k]];
      } else {
        predictors[2 + 6 * i] = _.sample('R', 'P', 'S');
        predictors[3 + 6 * i] = _.sample('R', 'P', 'S');
      }
    }
  });

  Array(3).forEach((_, i) => {
    let temp = '';
    const search = temp1[output + input]; // last round

    for (let start = 2; _ < _.min(limit[i], length); start++) {
      if (search === bothHis[length - start]) {
        temp += bothHis[length - start + 1];
      }
    }

    if (temp === '') {
      predictors[6 + i] = _.sample('R', 'P', 'S');
    } else {
      const collectR = { P: 0, R: 0, S: 0 }; // take win/lose from opponent into account

      for (let j = 0; j < temp.length; j++) {
        const sdf = temp[j];
        const nextMove = temp2[sdf];

        if (whoWin[nextMove] === -1) {
          collectR[temp2[sdf][1]] += 3;
        } else if (whoWin[nextMove] === 0) {
          collectR[temp2[sdf][1]] += 1;
        } else if (whoWin[nextMove] === 1) {
          collectR[beat[temp2[sdf][0]]] += 1;
        }
      }

      let max1 = -1;
      let p1 = '';

      Object.keys(collectR).forEach((key) => {
        if (collectR[key] > max1) {
          max1 = collectR[key];
          p1 += key;
        }
      });

      predictors[6 + i] = _.sample(p1.split(''));
    }
  });

  // rotate 9-27:
  for (let i = 9; i < 27; i++) {
    predictors[i] = beat[beat[predictors[i - 9]]];
  }

  // choose a predictor
  const lenHis = listPredictors[0].length;
  Array(NUM_PREDICTORS).forEach((_, i) => {
    let sum = 0;

    Array(lenHis).forEach((_, j) => {
      if (listPredictors[i][j] === '1') {
        sum += (j + 1) * (j + 1);
      } else {
        sum -= (j + 1) * (j + 1);
      }
    });

    scorePredictor[i] = sum;
  });

  const maxScore = _.max(scorePredictor);

  let predict;
  if (maxScore > 0) {
    predict = predictors[scorePredictor.indexOf(maxScore)];
  } else {
    predict = _.sample(yourHis.split(''));
  }

  output = _.sample(notLose[predict]);

  console.log(myHis);
  console.log(yourHis);
  console.log(bothHis);
  console.log(predict);
  console.log(predictors);

  return output;
};

export default {
  predict,
};
