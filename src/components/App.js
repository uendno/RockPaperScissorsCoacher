import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import predictor from '../models/IO2_fightinguuu';
import HandPaper from '../assets/images/hand-paper.svg';
import HandRock from '../assets/images/hand-rock.svg';
import HandScissors from '../assets/images/hand-scissors.svg';

const styles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    width: '100%',
  },

  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextMoveContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  opponentMoveContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  opponentMoveOptionsContainer: {
    marginTop: 16,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  yourMoveImage: {
    height: 500,
    width: 500,
  },
};

const POINT = {
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

const renderHandImage = (move, height, width) => {
  switch (move) {
    case 'R':
      return <HandRock height={height} width={width} />;
    case 'S':
      return <HandScissors height={height} width={width} />;
    case 'P':
      return <HandPaper height={height} width={width} />;
    default:
      return null;
  }
};

export default function App() {
  const [yourNextMove, setYourNextMove] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    setYourNextMove(predictor.predict(''));
  }, []);

  const setOpponentMove = (move) => {
    const point = POINT[yourNextMove + move];
    setScore(score + point);
    setYourNextMove(predictor.predict(move));
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text>
          Score:
          {' '}
          {score}
        </Text>
      </View>
      <View style={styles.nextMoveContainer}>
        <Text>
          Your next move:
        </Text>
        {renderHandImage(yourNextMove, 200, 200)}
      </View>
      <View style={styles.opponentMoveContainer}>
        <Text>
          {'Select opponent\'s move:'}
        </Text>
        <View style={styles.opponentMoveOptionsContainer}>
          {['R', 'P', 'S'].map((move) => (
            <TouchableOpacity
              key={move}
              onPress={() => setOpponentMove(move)}
            >
              {renderHandImage(move, 100, 100)}
            </TouchableOpacity>
          ))}

        </View>
      </View>
    </View>
  );
}
