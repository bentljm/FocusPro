import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-materialize'
export const Sidebar =()=>(

  <header>
      <nav className="top-nav full hide-on-large-only">
          <div className="nav-wrapper"><a href="#" data-activates="slide-out" className="button-collapse top-nav full hide-on-large-only"><i className="material-icons">menu</i></a></div>
      </nav>
      <ul id="slide-out" className="side-nav fixed theme-color">
        <li><div className="userView">
          <a href="#"><img className="circle" /></a>
          <a href="#"><span className="name">John Doe</span></a>
          <a href="#"><span className="email">jdandturk@gmail.com</span></a>
          <a href="#" className="btn">Log Out</a>
        </div></li>
        <li><div className="divider"></div></li>
        <li><a href="#" className="waves-effect"><i className="material-icons icon-white">settings</i>Settings</a></li>
        <li><a href="#" className="waves-effect"><i className="material-icons icon-white">perm_identity</i>Self Reflections</a></li>
      </ul>
    </header>
);
