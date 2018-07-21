import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Globabl ID variable to be used when creating posts
let id = 0;

class App extends Component {
  constructor(){
    super();
    this.state = {
      entries: [],
      search: '',
      title: '',
      text: '',
      color: '',
      chosenEntry: {},
      edit: false,
      showText: true,
      showTime: false,
    }
  }

  // Reusable handle input function
  handleInput(e){
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }


  // Timestampe not formatted perfectly
  submitEntry = () => {
    const {title, text, color} = this.state;
    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let time = currentDate.getTime();
    let timestamp = `${month + 1}-${date}-${year}-${time}`
    this.setState({
      entries: [...this.state.entries, {id: id++, title, text, color, timestamp, highlight: false}],
       title: '',
       text: '',
       color: '', 
    })
  }

  // Show chosen entry and highlight
  showEntry = (id) => {
    let copy = this.state.entries.slice()
    let chosen;
    copy.forEach(e => {
      if(e.id === id){
        e.highlight = true
        chosen = e 
      } else {
        e.highlight = false
      }
      });
    this.setState({
      chosenEntry: chosen,
      entries: copy
    })
  }

  // Sort oldest and newest posts
  sorted = (str) => {
    let copy = this.state.entries.slice()
    if(str === 'old'){
      copy.sort((a, b) => a.id - b.id)
    } else if (str === 'new'){
      copy.sort((a, b) => b.id - a.id)
    }
    this.setState({
      entries: copy
    })
  }

  search = (term) => {
    let copy = this.state.entries.filter(e => e.title.includes(term))
    this.setState({
      savedEntries: this.state.entries,
      entries: copy
    })
  }

  editEntry = () => {
    this.setState({
      edit: true
    })
  }

  // Replace chosen entry with edited entry
  replace = id => {
    let copy = this.state.entries.slice();
    let newEntry;
    copy.forEach(e => {
      if(e.id === id){
        e.text = this.state.text
        newEntry = e;
      }
      return e
    })
    this.setState({
      chosenEntry: newEntry,
      entries: copy,
      edit: false
    })
  }

  deleteEntry(id){
    let copy = this.state.entries.slice();
    copy = copy.filter(e => e.id !== id)
    this.setState((prevState) => {
      return {
        chosenEntry: {},
        entries: copy
    }})
  }

  // Switch to between chosen Entry text and timestamp
  switchTab(tab) {
    document.querySelector(".active").classList.remove("active");
    document.getElementById(tab).classList.add("active");

    this.setState({
      showText: tab === "text" ? true : false,
      showTime: tab === 'timestamp' ? true : false,

    });
  }


  render() {
    let {chosenEntry} = this.state;
    let time = chosenEntry.timestamp;
    let title = chosenEntry.title;

  
    let entries = this.state.entries.map(entry => {
      return (
        <div key={entry.id}>
          <h1 onClick={() => this.showEntry(entry.id)} style={{color: entry.color, margin: 0, textAlign: 'left', backgroundColor: entry.highlight ? 'yellow' : 'transparent'}}>{entry.title}</h1>
        </div>
      )
    })
    
      // Creating global entry variable to use in Ternary and render in return
    let entry;
    chosenEntry.text ? this.state.edit ? entry = <input onChange={(e) => this.handleInput(e)} name='text' placeholder={chosenEntry.text} /> : entry = <div>{chosenEntry.text}</div> : null

    return (
      <div className="App">

          <div className='outerdiv'>

            <div className='topdiv'>

              <div className='inputdiv'>

                <input  value={this.state.title} name='title' placeholder='Title' type="text" onChange={(e) => this.handleInput(e)}/>

                <select name="color" id="color" onChange={(e) => this.handleInput(e)} value={this.state.color}>

                  <option disabled="disabled" selected='selected' name='Default' value="blue">
                    Select
                  </option>

                  <option name='blue' value="blue" className='options blue' style={{color: 'blue'}}>
                    Blue
                  </option>

                  <option name='green' value="green" className='options green' style={{color: 'green'}}>
                    Green
                  </option>

                  <option name='red' value="red" className='options red' style={{color: 'red'}}>
                    Red
                  </option>
                  <option name='purple' value="purple" className='options purple' style={{color: 'purple'}}>
                    Purple
                  </option>

                </select>

              </div>

                <textarea value={this.state.text}onChange={(e) => this.handleInput(e)} name='text' placeholder='Enter text' type="text" style={{width: '70%', height: '250px',border: 'solid 2px black'}}/>

                <button onClick={this.submitEntry}>Save</button>

            </div>
            <br/>
            <input type="text" name='search' placeholder='Search' style={{border: 'solid 2px black'}} onChange={(e) => this.search(e.target.value)}/>

            <button onClick={() => this.sorted('old')}>Oldest</button>

            <button onClick={() => this.sorted('new')}>Newest</button>

            <div className='detailsdiv'>

                <h4 className='active' onClick={() => this.switchTab('text')} id='text' style={{margin: 0, color: chosenEntry.color}}>
                  {title}
                </h4>

                <p id='timestamp' onClick={() => this.switchTab('timestamp')} style={{margin: 0, height: '30%'}}>
                  Date Created
                </p>

            </div>
            <div className='bottomdiv' >

              <div className='bottominner'>

                List of Entries
                {entries}

              </div>
            
                <div className='bottominner'>

                Chosen Entry <br/>

                {this.state.showText ? entry : chosenEntry.timestamp}

                </div>

            </div>
            
                {!this.state.edit ? <button onClick={this.editEntry}>Edit</button> : <button onClick={() => this.replace(chosenEntry.id)}>Save</button>}
                <button onClick={() => this.deleteEntry(chosenEntry.id)}>Delete</button>
          </div>
      </div>
    );
  }
}

export default App;
