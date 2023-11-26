import React from "react";
import "./card_print.css";

const Checkbox = ({ checked, onChange }) => {
  return <input type="checkbox" checked={checked} onChange={onChange} />;
};

class Card extends React.Component {
  render() {
    let typeClassIndex = {
      Волшебник: "cardArcane",
      Колдун: "cardKoldun",
      Чародей: "cardSorserer",
      Следопыт: "cardRanger",
      Жрец: "cardCleric",
      "Жрец Бури": "cardCleric",
      "Жрец Войны": "cardCleric",
      "Жрец Жизни": "cardCleric",
      "Жрец Знания": "cardCleric",
      "Жрец Обмана": "cardCleric",
      "Жрец Природы": "cardCleric",
      "Жрец Света": "cardCleric",
      Друид: "cardDruid",
      Паладин: "cardPaladin",
      Бард: "cardBard",
    };
    let typeClass = typeClassIndex[this.props.type];
    let bigNameLength = this.props.data.name.length;
    for (let i = 0; i < bigNameLength; i++) {
      if (
        ~["Ж", "Ш", "Щ", "М", "ж", "ш", "щ", "м"].indexOf(
          this.props.data.name[i]
        )
      ) {
        bigNameLength += 0.5;
      }
    }
    let bigName = bigNameLength > 26 ? true : false;
    let cardClass = "card " + typeClass;
    let source = this.props.data.source
      ? "- " +
        this.props.data.source
          .split(" ")
          .map(function (w) {
            return w[0];
          })
          .join("")
      : "";
    if (this.props.showBack) {
      cardClass += " back";
      let lvlNum =
        this.props.data.level == "Заговор"
          ? 0
          : this.props.data.level.substr(0, 1);
      return (
        <div className={cardClass}>
          <div className="number"> {lvlNum} </div>
          <div className="number2"> {lvlNum} </div>
        </div>
      );
    } else
      return (
        <div className={cardClass}>
          <div className="title">
            <span className="fs"> {this.props.data.name} </span>
          </div>
          <div className="level">
            {this.props.data.level}, {this.props.data.type}
          </div>
          <div className="props">
            <div className="prop">
              <div className="propName"> Время накладывания </div>
              <div className="propValue"> {this.props.data.time} </div>
            </div>
            <div className="prop">
              <div className="propName"> Дистанция </div>
              <div className="propValue"> {this.props.data.range} </div>
            </div>
            <div className="prop">
              <div className="propName"> Компоненты </div>
              <div className="propValue"> {this.props.data.components} </div>
            </div>
            <div className="prop">
              <div className="propName"> Длительность </div>
              <div className="propValue"> {this.props.data.duration} </div>
            </div>
          </div>
          <CardText
            text={this.props.data.text}
            hightlevel={this.props.data.hightlevel}
            bigName={bigName}
          />
          <div className="footer">
            {this.props.type} - {this.props.data.level} {source}
          </div>
        </div>
      );
  }
}

class CardText extends React.Component {
  render() {
    let fontSizeClass = "text";
    let len = 0;
    this.props.text.forEach(function (pText, ind) {
      len += pText.length;
    });

    if (this.props.bigName) {
      if (len > 900) {
        if (len > 1000) {
          fontSizeClass += " small";
        } else {
          fontSizeClass += " preSmall";
        }
      }
    } else {
      // if (len > 1150) {
      if (len > 1250) {
        fontSizeClass += " small";
      } else {
        // fontSizeClass += ' preSmall'
      }
      // }
    }

    // if ((len > 1000 && this.props.bigName) || len > 1250) {
    //     fontSizeClass += ' small';
    // }
    if (this.props.bigName) {
      fontSizeClass += " bigName";
    }

    let cardText = this.props.text.map(function (pText, ind) {
      let pClass = ind == 0 ? "first" : "";
      return <p className={pClass}> {pText} </p>;
    });
    let higherLevels = "";
    if (this.props.hightlevel && this.props.hightlevel.length) {
      higherLevels = <HigherLevels text={this.props.hightlevel} />;
    }
    return (
      <div className={fontSizeClass}>
        <div className="level"> </div> {cardText} {higherLevels}
      </div>
    );
  }
}

class HigherLevels extends React.Component {
  render() {
    let cardText = this.props.text.map(function (pText, ind) {
      let pClass = ind == 0 ? "first" : "";
      return <p className={pClass}> {pText} </p>;
    });
    return (
      <div className="higherLevels">
        <div className="level"> На более высоком уровне </div> {cardText}
      </div>
    );
  }
}

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.classesCard = {};
    this.cards = [];
    this.state = {
      data: [],
      filters: [],
      selectedClass: "Все",
      selectedSource: "Все",
      showBacks: false,
      lvl0: false,
      lvl1: false,
      lvl2: false,
      lvl3: false,
      lvl4: false,
      lvl5: false,
      lvl6: false,
      lvl7: false,
      lvl8: false,
      lvl9: false,
    };
  }
  loadCommentsFromServer() {
    let data = fetch(this.props.url)
      .then(
        (data) => data.json(),
        (error) => {
          console.error(this.props.url, error.toString());
        }
      )
      .then((data) => {
        this.cards = data.cards;
        this.classesCard = data.classesCard;
      });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }
  handleChange = (event) => {
    this.setState({ selectedClass: event.target.value });
  };
  handleChangeSource = (event) => {
    this.setState({ selectedSource: event.target.value });
  };
  handleChangeLvl = (lvl, event) => {
    let lvlName = "lvl" + lvl;
    let obj = {};
    obj[lvlName] = !this.state[lvlName];
    this.setState(obj);
  };
  showBacksChange = (event) => {
    this.setState({ showBacks: !this.state.showBacks });
  };

  handleFilterChange = (value) => {
    let s = value;
    if (s === "") {
      this.setState({ filters: [] });
      return;
    }
    let words = s.split(",");
    words = words.map((s) => s.trim());
    this.setState({ filters: words });
  };

  render() {
    let cardNodes = "";
    let cards = [];
    let selectedSource = this.state.selectedSource;
    if (selectedSource == "Все") {
      cards = this.cards;
    } else if (selectedSource == "PHB") {
      cards = this.cards.filter(function (card) {
        return !card.source;
      });
    } else {
      cards = this.cards.filter(function (card) {
        return card.source == selectedSource;
      });
    }
    if (this.state.selectedClass == "Все") {
      let arr = cards;
      if (this.state.filters.length !== 0) {
        let filters = this.state.filters;
        arr = arr.filter((card) =>
          filters.some((filter) => card.name.toLowerCase().includes(filter))
        );
      }
      cardNodes = arr.map(function (card) {
        return (
          <Card
            data={card}
            type={this.state.selectedClass}
            showBack={this.state.showBacks}
          />
        );
      }, this);
    } else {
      let arr = [];
      cards.forEach(function (card) {
        let lvlNum = card.level == "Заговор" ? 0 : card.level.substr(0, 1);
        let lvlName = "lvl" + lvlNum;
        if (
          this.state[lvlName] &&
          ~this.classesCard[this.state.selectedClass].indexOf(card.name)
        ) {
          arr.push(card);
        } else {
        }
      }, this);

      arr.sort(
        (function (self) {
          return function (a, b) {
            return (
              self.classesCard[self.state.selectedClass].indexOf(a.name) -
              self.classesCard[self.state.selectedClass].indexOf(b.name)
            );
          };
        })(this)
      );

      if (this.state.showBacks) {
        let tempArr = [];
        while (arr.length) {
          let slice = arr.splice(0, 3);
          for (let i = slice.length - 1; i >= 0; i--) {
            tempArr.push(slice[i]);
          }
        }
        arr = tempArr;
      }
      if (this.state.filters.length !== 0) {
        let filters = this.state.filters;
        arr = arr.filter((card) =>
          filters.some((filter) => card.name.toLowerCase().includes(filter))
        );
      }

      cardNodes = arr.map(function (card) {
        return (
          <Card
            data={card}
            type={this.state.selectedClass}
            showBack={this.state.showBacks}
          />
        );
      }, this);
    }

    return (
      <div>
        <select value={this.state.selectedClass} onChange={this.handleChange}>
          <option value="Все"> Все </option>
          <option value="Бард"> Бард </option>
          <option value="Волшебник"> Волшебник </option>
          <option value="Друид"> Друид </option>
          <option value="Жрец"> Жрец </option>
          <option value="Жрец Бури"> Жрец Бури </option>
          <option value="Жрец Войны"> Жрец Войны </option>
          <option value="Жрец Жизни"> Жрец Жизни </option>
          <option value="Жрец Знания"> Жрец Знания </option>
          <option value="Жрец Обмана"> Жрец Обмана </option>
          <option value="Жрец Природы"> Жрец Природы </option>
          <option value="Жрец Света"> Жрец Света </option>
          <option value="Колдун"> Колдун </option>
          <option value="Паладин"> Паладин </option>
          <option value="Следопыт"> Следопыт </option>
          <option value="Чародей"> Чародей </option>
        </select>
        |
        <select
          value={this.state.selectedSource}
          onChange={this.handleChangeSource}
        >
          <option value="Все"> Все </option> <option value="PHB"> PHB </option>
          <option value="Elemental Evil"> EE </option>
        </select>
        |
        <Checkbox
          checked={this.state.lvl0}
          onChange={(e) => this.handleChangeLvl(0, e)}
        />
        0 |
        <Checkbox
          checked={this.state.lvl1}
          onChange={(e) => this.handleChangeLvl(1, e)}
        />
        1 |
        <Checkbox
          checked={this.state.lvl2}
          onChange={(e) => this.handleChangeLvl(2, e)}
        />
        2 |
        <Checkbox
          checked={this.state.lvl3}
          onChange={(e) => this.handleChangeLvl(3, e)}
        />
        3 |
        <Checkbox
          checked={this.state.lvl4}
          onChange={(e) => this.handleChangeLvl(4, e)}
        />
        4 |
        <Checkbox
          checked={this.state.lvl5}
          onChange={(e) => this.handleChangeLvl(5, e)}
        />
        5 |
        <Checkbox
          checked={this.state.lvl6}
          onChange={(e) => this.handleChangeLvl(6, e)}
        />
        6 |
        <Checkbox
          checked={this.state.lvl7}
          onChange={(e) => this.handleChangeLvl(7, e)}
        />
        7 |
        <Checkbox
          checked={this.state.lvl8}
          onChange={(e) => this.handleChangeLvl(8, e)}
        />
        8 |
        <Checkbox
          checked={this.state.lvl9}
          onChange={(e) => this.handleChangeLvl(9, e)}
        />
        9 |
        <Checkbox
          checked={this.state.showBacks}
          onChange={this.showBacksChange}
        />
        Back
        <textarea
          onChange={(e) => this.handleFilterChange(e.target.value)}
        ></textarea>
        <div className="cards"> {cardNodes} </div>
      </div>
    );
  }
}

export default Cards;
