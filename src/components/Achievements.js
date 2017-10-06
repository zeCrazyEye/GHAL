import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import GameStore from '../stores/GameStore';
import GameActions from '../actions/GameActions';

export const GLOBAL_ACHIEVEMENTS = {
  ANCIENT_TECHNOLOGY_1: "Ancient Technology 1",
  ANCIENT_TECHNOLOGY_2: "Ancient Technology 2",
  ANCIENT_TECHNOLOGY_3: "Ancient Technology 3",
  ANCIENT_TECHNOLOGY_4: "Ancient Technology 4",
  ANCIENT_TECHNOLOGY_5: "Ancient Technology 5",
  ANNIHILATION_OF_THE_ORDER: "Annihilation of the Order",
  ARTIFACT_RECOVERED: "Artifact: Recovered",
  ARTIFACT_LOST: "Artifact: Lost",
  ARTIFACT_CLEANSED: "Artifact: Cleansed",
  CITY_RULE_MILITARISTIC: "City Rule: Militaristic",
  CITY_RULE_ECONOMIC: "City Rule: Economic",
  CITY_RULE_DEMONIC: "City Rule: Demonic",
  END_OF_THE_INVASION: "End of the Invasion",
  END_OF_CORRUPTION_1: "End of Corruption 1",
  END_OF_CORRUPTION_2: "End of Corruption 2",
  END_OF_CORRUPTION_3: "End of Corruption 3",
  END_OF_GLOOM: "End of Gloom",
  THE_DRAKE_SLAIN: "The Drake Slain",
  THE_DRAKE_AIDED: "The Drake Aided",
  THE_DEAD_INVADE: "The Dead Invade",
  THE_DEMON_DETHRONED: "The Demon Dethroned",
  THE_EDGE_OF_DARKNESS: "The Edge of Darkness",
  THE_MERCHANT_FLEES: "The Merchant Flees",
  THE_POWER_OF_ENHANCEMENT: "The Power of Enhancement",
  THE_RIFT_CLOSED: "The Rift Closed",
  THE_RIFT_NEUTRALIZED: "The Rift Neutralized",
  THE_VOICE_SILENCED: "The Voice: Silenced",
  THE_VOICE_FREED: "The Voice: Freed",
  WATER_BREATHING: "Water-Breathing",
};

const possibleAchievements = [
  [
    GLOBAL_ACHIEVEMENTS.ANCIENT_TECHNOLOGY_1,
    GLOBAL_ACHIEVEMENTS.ANCIENT_TECHNOLOGY_2,
    GLOBAL_ACHIEVEMENTS.ANCIENT_TECHNOLOGY_3,
    GLOBAL_ACHIEVEMENTS.ANCIENT_TECHNOLOGY_4,
    GLOBAL_ACHIEVEMENTS.ANCIENT_TECHNOLOGY_5
  ],
  [
    GLOBAL_ACHIEVEMENTS.ARTIFACT_RECOVERED,
    GLOBAL_ACHIEVEMENTS.ARTIFACT_LOST,
    GLOBAL_ACHIEVEMENTS.ARTIFACT_CLEANSED,
  ],
  [
    GLOBAL_ACHIEVEMENTS.CITY_RULE_MILITARISTIC,
    GLOBAL_ACHIEVEMENTS.CITY_RULE_ECONOMIC,
    GLOBAL_ACHIEVEMENTS.CITY_RULE_DEMONIC,
  ],
  [
    GLOBAL_ACHIEVEMENTS.END_OF_CORRUPTION_1,
    GLOBAL_ACHIEVEMENTS.END_OF_CORRUPTION_2,
    GLOBAL_ACHIEVEMENTS.END_OF_CORRUPTION_3,
  ],
  [
    GLOBAL_ACHIEVEMENTS.THE_DRAKE_SLAIN,
    GLOBAL_ACHIEVEMENTS.THE_DRAKE_AIDED,
  ],
  [
    GLOBAL_ACHIEVEMENTS.THE_VOICE_SILENCED,
    GLOBAL_ACHIEVEMENTS.THE_VOICE_FREED,
  ],
  [
    GLOBAL_ACHIEVEMENTS.ANNIHILATION_OF_THE_ORDER,
    GLOBAL_ACHIEVEMENTS.END_OF_THE_INVASION,
    GLOBAL_ACHIEVEMENTS.END_OF_GLOOM,
    GLOBAL_ACHIEVEMENTS.THE_DEAD_INVADE,
    GLOBAL_ACHIEVEMENTS.THE_EDGE_OF_DARKNESS,
    GLOBAL_ACHIEVEMENTS.THE_MERCHANT_FLEES,
    GLOBAL_ACHIEVEMENTS.THE_POWER_OF_ENHANCEMENT,
    GLOBAL_ACHIEVEMENTS.THE_RIFT_NEUTRALIZED,
    GLOBAL_ACHIEVEMENTS.WATER_BREATHING,
  ],
];

class AchievementsComponent extends Component {

  constructor() {
    super();

    this.state = GameStore.getGame();

    this.onChange = this.onChange.bind(this);
    this.toggleAchievement = this.toggleAchievement.bind(this);
  }

  componentWillMount() {
    GameStore.addGameChangeListener(this.onChange);
  }

  componentWillUnmount() {
    GameStore.removeGameChangeListener(this.onChange);
  }

  onChange() {
    this.setState(GameStore.getGame());
  }

  initGlobalAchievements(callback, achievement) {
    // init global achievements if not already
    if (!this.state.globalAchievements) {
      this.setState({
        globalAchievements: {}
      }, function() {
        callback(achievement);
      });
    }
    else {
      callback(achievement);
    }
  }

  toggleAchievement(achievement) {
    let globalAchievementsCopy = this.state.globalAchievements;

    if (this.state.globalAchievements[achievement]) {
      globalAchievementsCopy[achievement] = null;
    }
    else {
      // only one artifact achievement allowed
      if (achievement.startsWith("Artifact")) {
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.ARTIFACT_RECOVERED] = null;
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.ARTIFACT_CLEANSED] = null;
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.ARTIFACT_LOST] = null;
      }

      if (achievement.startsWith("The Drake")) {
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.THE_DRAKE_AIDED] = null;
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.THE_DRAKE_SLAIN] = null;
      }

      if (achievement.startsWith("City Rule")) {
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.CITY_RULE_DEMONIC] = null;
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.CITY_RULE_ECONOMIC] = null;
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.CITY_RULE_MILITARISTIC] = null;
      }

      if (achievement.startsWith("The Voice")) {
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.THE_VOICE_FREED] = null;
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.THE_VOICE_SILENCED] = null;
      }

      if (achievement.startsWith("The Demon Dethroned")) {
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.THE_RIFT_CLOSED] = null;
      }
      else if (achievement.startsWith("The Rift Closed")) {
        globalAchievementsCopy[GLOBAL_ACHIEVEMENTS.THE_DEMON_DETHRONED] = null;
      }

      globalAchievementsCopy[achievement] = "true"
    }

    this.setState({
      globalAchievements: globalAchievementsCopy
    }, function() {
      GameActions.changeGame(this.state);
    });
  }

  toggleAchievementClick(achievement) {
    this.initGlobalAchievements(this.toggleAchievement, achievement);
  }

  render() {
    let achievementHtml = [];

    for (let i=0; i<possibleAchievements.length; i++) {
      let achievementButtons = [];

      for (let j=0; j<possibleAchievements[i].length; j++) {

        let achievement = possibleAchievements[i][j];
        let buttonStyle = "";

        if (this.state.globalAchievements && this.state.globalAchievements[achievement]) {
          buttonStyle = "btn-scoundrel";
        }

        achievementButtons.push(<Col xs={12} md={6} lg={4} key={j}><Button className={buttonStyle} block onClick={this.toggleAchievementClick.bind(this, achievement)}>{achievement}</Button></Col>)
      }

      let divider = null;
      if (i < possibleAchievements.length - 1) {
        divider = <hr />
      }

      achievementHtml.push(
        <div key={i}>
          <Row>{achievementButtons}</Row>
          {divider}
        </div>
      )
    }

    return (
      <div className="container">
      	<Grid>
          <Row>
            <Col xs={12} md={12}>
              <p>Here you can track your campaign's <strong>global achievements</strong> by selecting the buttons below.</p>
              <p>You can toggle them from complete to incomplete. Some achievements are connected to each other and will automatically be lost when you mark another as complete.</p>
            </Col>
          </Row>
          <Row className="global-achievement-key">
            <Col xs={12} md={6} className="text-center">
              <Button className="btn-scoundrel">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button> Achievement complete
            </Col>
            <Col xs={12} md={6} className="text-center">
              <Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button> Achievement incomplete (or lost)
            </Col>
          </Row>
      		<Row>
      			<Col xs={12} md={12} className="achievements-container">
              <Row>
                {achievementHtml}
              </Row>
      			</Col>
      		</Row>
      	</Grid>
      </div>
    );
  }
}

export default AchievementsComponent;