import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Quiz from './components/questionnaire';

render(
  <Quiz />,
  document.getElementById('questionnaireBoard')
)
