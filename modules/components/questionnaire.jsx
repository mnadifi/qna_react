import React      from 'react';
import $          from 'jquery';
import Question   from './question';

export default class Questionnaire extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        questionnaire: {},
        index: 0,
        indexD: 0,
        answers: []
      };
  }

  componentDidMount() {
    $.getJSON('./assets/json/phq-9.json', function(result) {
      this.setState({questionnaire: result});
    }.bind(this));
  }

  submitCheck() {
    if($("input[type=radio]:checked").length > 0){
      $('.required-message').removeClass('show-message');
      if (this.state.index < this.state.questionnaire.questions.length) {
        this.setState({'index': this.state.index + 1});
      } else {
        let score = this.state.score || 0;
        this.state.answers.map((answer, i) => (
          score = score + this.state.questionnaire.questions[i].answers[answer].point
        ));
        this.setState({'score': score});
      }
    } else {
      console.log('Please, select one option');
      $('.required-message').addClass('show-message');
    }
  }

  handleAnswerSelected(event) {
    let list = [...this.state.answers.slice(0, this.state.index),
                parseInt(event.target.value),
                ...this.state.answers.slice(this.state.index + 1)];
    this.setState({'answers': list});
  }

  render() {
    const {
      questionnaire, index, answers
    } = this.state;

    let completed = (questionnaire.questions && (index === questionnaire.questions.length)) ? true : false,
        numberOfQuestions = questionnaire.questions ? questionnaire.questions.length : 0,
        score = 0,
        scoreResult = '',
        suggestion = 0;

    if (completed) {
      this.state.answers.map((answer, i) => (
        score = score + this.state.questionnaire.questions[i].answers[answer].point
      ));

      if(score < 5){
        scoreResult = 'you do not suffer depression.';
      } else if((score > 4) && (score < 10)){
        scoreResult = 'you suffer a mild level of depression';
        suggestion = 1;
      } else if((score > 9) && (score < 15)){
        scoreResult = 'you suffer a moderate depression';
        suggestion = 1;
      } else if((score > 14) && (score < 20)){
        scoreResult = 'you suffer a moderately severe depression';
        suggestion = 1;
      } else if((score > 19) && (score < 28)){
        scoreResult = 'you suffer a severe depression';
        suggestion = 1;
      }
      
      if(suggestion === 1){
        $('.suggestion').addClass('show-suggestion');
      }
    }

    return (
      <div>
        <h1>{questionnaire.title}</h1>
        <h3>{questionnaire.subTitle}</h3>
        <div className="required-message">{questionnaire.required}</div>
        {completed ?
          <div className="results">
            <p>Thank you for taking this questionnaire</p>
            <div>Your score is { score } points, { scoreResult }</div>
            <br />
            <div className="suggestion"></div>
          </div>
        :
          <div>
          <h2>Question {index + 1} of {numberOfQuestions}</h2>
          {questionnaire.questions && index < numberOfQuestions ?
            <Question
              question={ questionnaire.questions[index] }
              index={ index }
              onAnswerSelected={ (event) => this.handleAnswerSelected(event) }
              onSubmit={ () => this.submitCheck() }
            />
          : ''}
          </div>
        }
      </div>
    )
  }
}
