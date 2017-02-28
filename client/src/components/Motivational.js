import React from 'react';
import { Modal, Button } from 'react-materialize';

export default class Motivational extends React.Component {
  render() {
    return (
      <Modal
        header="Motivational Questions"
        fixedFooter
        trigger={<Button className="goalButton" waves="light">Inspire Me</Button>}
      >
        What is your Overarching Goal?
        <br />
        It is best to prioritise, pick ONE goal and stay focused before moving onto the next one.
        Some questions to help you getting started:
        <br />
        <br />
        - Why are you doing what you are doing? What is your theme?
        <br />
        -- What would your ideal 60th birthday look like?
        <br />
        -- What would be the biggest regret I could have at the end of my life?
        <br />
        - 18 months from now, what achievement would have the biggest positive impact on your life with respect to your theme?
        <br />
        - Have you ever had the feeling that a discipline or field was tailor-made just for you?
        <br />
        - What completed consumes your attention once you start doing it?
        <br />
        - What makes your heart race with excitement?
        <br />
        - What do you believe is worthwhile doing, that other people might not agree on?
        <br />
        <br />
        Sub-Goal setting
        <br />
        By taking small, measurable steps regularly, we will be on track to the end.
        It is best to have a max of 3 subgoals going on at once
        <br />
        - Formulate the ONE goal into a number
        <br />
        - make it SMART
        <br />
        (from http://niklasgoeke.com/how-to-set-goals)
        <br />
        <hr />
        <br />
        <div className="row">
          <form className="col s11">
            <div className="row">
              <div className="input-field col s12">
                <textarea id="textarea1" className="materialize-textarea" />
                <label htmlFor="textarea1">Type here to brainstorm goals. This will not be saved.</label>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}
