import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Switch from 'react-switch';
import Modal from 'react-modal';

function App() {

  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  //Modal.setAppElement('App');
  const [modalIsOpen, setIsOpen] = useState(false);

  const [simulationType, setSimulationType] = useState("")

  const [attackerSoldierNum, setAttackerSoldierNum] = useState()
  const [attackerCube, setAttackerCube] = useState()
  const [attackerKnight, setAttackerKnight] = useState(false)

  const [defenderSoldierNum, setDefenderSoldierNum] = useState()
  const [defenderCube, setDefenderCube] = useState()
  const [defenderKnight, setDefenderKnight] = useState(false)

  const [isCapital, setIsCapital] = useState(false)
  const [populationCount, setPopulationCount] = useState(false)

  const [result, setResult] = useState({})

  function calculateResults(e) {
    e.preventDefault()

    if (simulationType === "") {
      alert("אנא בחר סוג תקיפה")
      return;
    }
    if (!attackerSoldierNum) {
      alert("אין לך חיילים תוקפים?")
      return;
    }
    if (!defenderSoldierNum) {
      alert("אין למגן חיילים?")
      return;
    }
    if (!attackerCube) {
      alert("חשבת שתוכל להתחמק מקוביות התוקף?")
      return;
    }
    if (!defenderCube) {
      alert("חשבת שתוכל להתחמק מקוביות המגן?")
      return;
    }

    const attackerForce = attackerSoldierNum * (attackerCube / 2) * (attackerKnight ? 2 : 1)
    const defenderForce = defenderSoldierNum * (defenderCube / 2) * (defenderKnight ? 2 : 1)

    var attackerLeft = 0;

    var result = {}
    switch (simulationType) {
      default:
      case "תקיפת השבט הזר": {
        attackerLeft = (attackerForce - defenderForce) / attackerSoldierNum * attackerForce
        result = {
          winState: attackerForce > defenderForce,
          
          attackerLeftSoldiers: attackerLeft,
          attackerDeathToll: parseInt(attackerSoldierNum - attackerLeft)
        }
        console.group("New Attack Values")
        console.log("Simulation Type: " + simulationType)
        console.log("Attacker Force: " + attackerForce)
        console.log("Defender Force: " + defenderForce)
        console.log("Attacker Left: " + attackerLeft)
        console.groupEnd()
        break;
      }
      case "בזיזת השבט הזר": {
        attackerLeft = (attackerForce - defenderForce) / attackerSoldierNum * attackerForce
        result = {
          winState: attackerForce > (defenderForce / 2),
          
          attackerLeftSoldiers: attackerLeft,
          attackerDeathToll: parseInt(attackerSoldierNum - attackerLeft)
        }

        console.group("New Attack Values")
        console.log("Simulation Type: " + simulationType)
        console.log("Attacker Force: " + attackerForce)
        console.log("Defender Force: " + defenderForce)
        console.log("Attacker Left: " + attackerLeft)
        console.groupEnd()
        break;
      }
      case "תקיפת שחקן אחר": {
        var newAttackerForce = attackerCube * attackerSoldierNum * (attackerKnight ? 2 : 1)
        var newDefenderForce = (parseInt(isCapital ? populationCount * 2 : populationCount) + parseInt(defenderSoldierNum)) * defenderCube * (defenderKnight ? 2 : 1)

        var winForce = newAttackerForce > newDefenderForce ? newAttackerForce : newDefenderForce
        var lossForce = winForce === newAttackerForce ? newDefenderForce : newAttackerForce
        var winnerPercentageLoss = Math.pow(lossForce / winForce, 1.5) / (Math.pow(lossForce / winForce, 1.5) + 1)
        var loserPercentageLoss = 1 - winnerPercentageLoss
        var countWinnerSoldiers = winForce === newAttackerForce ? attackerSoldierNum * winnerPercentageLoss : defenderSoldierNum * winnerPercentageLoss
        var countLoserSoldiers = lossForce === newAttackerForce ? defenderSoldierNum * loserPercentageLoss : attackerSoldierNum * loserPercentageLoss
        
        var attackerDeathToll = newAttackerForce > newDefenderForce ? countWinnerSoldiers : countLoserSoldiers
        var defenderLeft = newAttackerForce > newDefenderForce ? countLoserSoldiers : countWinnerSoldiers
        
        attackerLeft = attackerSoldierNum - attackerDeathToll
        var defenderDeathToll = defenderSoldierNum - defenderLeft

        result = {
          winState: newAttackerForce > newDefenderForce,
          attackerLeftSoldiers: attackerLeft,
          attackerDeathToll: attackerDeathToll,
          defenderLeftSoldiers: defenderLeft,
          defenderDeathToll: defenderDeathToll,
          
        }
        
        console.group("New Attack Values")
        console.log("Simulation Type: " + simulationType)
        console.log("Attacker Force: " + newAttackerForce)
        console.log("Defender Force: " + newDefenderForce)
        console.log("winForce: " + winForce)
        console.log("lossForce: " + lossForce)
        console.log("winnerPercentageLoss: " + winnerPercentageLoss)
        console.log("loserPercentageLoss: " + loserPercentageLoss)
        console.log("countWinnerSoldiers: " + countWinnerSoldiers)
        console.log("countLoserSoldiers: " + countLoserSoldiers)
        console.log("attackerLeft: " + attackerLeft)
        console.log("defenderLeft: " + defenderLeft)
        console.log("attackerDeathToll: " + attackerDeathToll)
        console.log("defenderDeathToll: " + defenderDeathToll)
        console.groupEnd()
        break;
      }
    }

    
    setResult(result)
    setIsOpen(true)
  }


  return (
    <div className="App" dir="rtl" id="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='formCell'>
          <span>סוג התקיפה</span>
          <select value={simulationType} onChange={e => setSimulationType(e.target.value)}>
            <option disabled value="">בחר</option>
            <option value="תקיפת השבט הזר">תקיפת השבט הזר</option>
            <option value="בזיזת השבט הזר">בזיזת השבט הזר</option>
            <option value="תקיפת שחקן אחר">תקיפת שחקן אחר</option>
          </select>
        </div>
        <div className='splitToSize'>
          <div className='side'>
            <h2>תוקף</h2>
            <div className='formCell'>
              <span>
                כמות חיילים
              </span>
              <input type="number" value={attackerSoldierNum} onChange={e => setAttackerSoldierNum(e.target.value)} placeholder="0" />
            </div>
            <div className='formCell'>
              <span>
                כמה יצא בקובייה?
              </span>
              <input type="number" value={attackerCube} onChange={e => setAttackerCube(e.target.value)}  placeholder="0"/>
            </div>
            <div className='formCell'>
              <span>
                האם יש אביר?
              </span>
              <Switch type="checkbox" checked={attackerKnight} onChange={e => setAttackerKnight(!attackerKnight)} placeholder="0" />
            </div>
          </div>
          <div className='side'>
            <h2>מגן</h2>
            <div className='formCell'>
              <span>
                כמות חיילים
              </span>
              <input type="number" value={defenderSoldierNum} onChange={e => setDefenderSoldierNum(e.target.value)} placeholder="0" />
            </div>
            <div className='formCell'>
              <span>
                כמה יצא בקובייה?
              </span>
              <input type="number" value={defenderCube} onChange={e => setDefenderCube(e.target.value)}  placeholder="0"/>
            </div>
            <div className='formCell'>
              <span>
                האם יש אביר?
              </span>
              <Switch checked={defenderKnight} onChange={e => setDefenderKnight(!defenderKnight)} />
            </div>
          </div>
        </div>
        {
          simulationType === "תקיפת שחקן אחר" &&
          <div>
            <div className='formCell'>
              <span>
                האם זו בירת המגן?
              </span>
              <Switch type="checkbox" checked={isCapital} onChange={e => setIsCapital(!isCapital)} placeholder="0" />
            </div>
            <div className='formCell'>
              <span>
                מה כמות האוכלוסיה בכפר המגן?
              </span>
              <input type="number" value={populationCount} onChange={e => setPopulationCount(e.target.value)}  placeholder="0"/>
            </div>
          </div>
        }
        <div>
          <input type="submit" dir='ltr' value={"Pablushi Battle!!"} onClick={calculateResults} />
        </div>

      </header>

      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={() => setIsOpen(false)}
        style={{
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)'
        }
        }
        contentLabel="סיכום"
      >
        <div className='resWindow' dir="rtl" style={{backgroundColor: result.winState ? "green": "red"}}>
          <h2>{ result.winState ? "התוקף ניצח" : "התוקף הפסיד" }</h2>
          {
            !result.winState &&
            <h4>לא נשארו חיילים</h4>
          }
          {
            result.winState &&
            <React.Fragment>
              <h4>{result.attackerLeftSoldiers} שרדו את התקיפה</h4>
              <h4>{result.attackerDeathToll} מתו בתקיפה</h4>

              {
                simulationType === "תקיפת שחקן אחר" &&
                <React.Fragment>
                  <h4>{result.defenderLeftSoldiers} מגנים שרדו את התקיפה</h4>
                  <h4>{result.defenderDeathToll} מגנים מתו בתקיפה</h4>
                </React.Fragment>
              }

              {
               ( simulationType === "תקיפת השבט הזר" || simulationType === "כיבוש שחקן אחר") &&
                <h2>ברכותיי כבשת את המקום, לא לשכוח להטיל קוביות איזה מבנה שרד</h2>
              }
            </React.Fragment>
          }

          
        </div>
      </Modal>
    </div>
  );
}

export default App;
