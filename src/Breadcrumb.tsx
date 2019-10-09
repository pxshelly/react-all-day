import * as React from "react";

export interface Props {
  values: number[];
}

export class Breadcrumb extends React.PureComponent<Props> {
  getLiListFromValues(values: number[]): Element[] {
    return values.map((value: number, index: number) => <li key={index}>{this.formatValue(value)}</li>);
  }
  
  formatValue(value: number) {
    return value.toFixed(3);
  }

  render() {
    return (
      <div className="breadcrumb">
        <ul>
          {this.getLiListFromValues(this.props.values)}
        </ul>
      </div>
    );
  }
}
