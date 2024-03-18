import React, { Component } from 'react';
import styles from './../css/RegistrationPage.module.css'
import {Link} from "react-router-dom";


class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={styles.form}>
         <h1>Регистарция:</h1>
        <div className={styles.formGroup}>
          <label htmlFor="login">Логин:</label>
            <input
            type="text"
            id="login"
            name="login"
            value={this.state.login}
            onChange={this.handleInputChange}
            required
            className={styles.formControl}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password1">Пароль:</label>
          <input
            type="password"
            id="password1"
            name="password1"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
            className={styles.formControl}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password2">Повторите пароль:</label>
          <input
            type="password"
            id="password2"ы
            name="password2"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
            className={styles.formControl}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Зарегистрироваться</button>
        <div>
          <p>
            Если у вас есть страница, то вы можете{" "}
            <Link to="/" style={{ color: "blue" }}>
              войти
            </Link>
            .
          </p>
        </div>
      </form>
    );
  }
}

export default RegistrationPage;