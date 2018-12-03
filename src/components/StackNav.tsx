import React, { Component, CSSProperties } from 'react';
import { IonPage } from '../ionic';

interface NavView {
  name: string;
  title: string;
  path: string;
  getView: () => any;
}

interface Props {
  navViews: NavView[];
  basePath: string;
  onPageChange: any;
  urlMatchHandler: any;
}

interface State {
  stack: any[];
}

export default class StackNav extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let stack: any[] = [];

    props.navViews.forEach((navView) => {
      const match = props.urlMatchHandler(`${props.basePath}/${navView.path}`);
      if (match) {
        stack = stack.concat([
          [navView.name, match.params ]
        ])
      }
    });

    if (stack.length === 0) {
      const navView = props.navViews[0];
      stack = stack.concat([
        [navView.name, {}]
      ])
    }

    this.state = {
      stack
    };
  }

  pageChanged() {
    // Find the last View on the stack which is the new active View
    let [curPageName, curParams] = this.state.stack[this.state.stack.length - 1];
    let curView = this.props.navViews.find(view => view.name === curPageName) || this.props.navViews[0];

    this.props.onPageChange(this.props.basePath, curView.path, curParams);
  }

  push(pageName: string, params = {}) {
    this.setState((prevState, props) => ({
      ...prevState,
      stack: prevState.stack.concat([[pageName, params]])
    }), this.pageChanged);
  }

  pop() {
    this.setState((prevState, props) => ({
      ...prevState,
      stack: prevState.stack.slice(0, -1)
    }), this.pageChanged);
  }

  render() {
    return this.state.stack.map(([pageName, params], index, array) => {
      const Page = (this.props.navViews.find(view => view.name === pageName) || this.props.navViews[0]).getView();
      const style: CSSProperties = {};
      if (index !== array.length - 1) {
        style.display = 'none';
      }
      return (
        <IonPage key={index}>
          <Page
            nav={{
              pop: this.pop.bind(this),
              push: this.push.bind(this)
            }}
            params={params}
          ></Page>
        </IonPage>
      )
    });
  }
}
