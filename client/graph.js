import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cytoscape from 'cytoscape';
import cycola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';

cytoscape.use(cycola);
cytoscape.use(dagre);

/** React cytoscape component
 * props : style, elements, layout, cyRef,styleContainer, cytoscapeOptions
 */
class ReactCytoscape extends Component {

  getCyID() {
    return this.props.containerID || 'cy';
  }

  getContainer() {
    let c = this.container;
    // console.log("container", c);
    return c;
  }

  defaultStyle() {
    return [
      {
        selector: 'node',
        css: {
          'content': function (ele) { return ele.data('label') || ele.data('id') },
          'text-valign': 'center',
          'text-halign': 'center'
        }
      },
      {
        selector: '$node > node',
        css: {
          'padding-top': '10px',
          'padding-left': '10px',
          'padding-bottom': '10px',
          'padding-right': '10px',
          'text-valign': 'top',
          'text-halign': 'center',
          'background-color': '#bbb'
        }
      },
      {
        selector: 'edge',
        css: {
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: ':selected',
        css: {
          'background-color': 'black',
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black'
        }
      }
    ]
  }

  style() {
    return this.props.style || this.defaultStyle();
  }

  elements() {
    return this.props.elements || {};
  }

  layout() {
    return this.props.layout || { name: 'cola' };
  }

  cytoscapeOptions() {
    return this.props.cytoscapeOptions || {};
  }

  build() {
    let opts = Object.assign({
      container: this.getContainer(),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: this.style(),
      elements: this.elements(),
      layout: this.layout(),
    }, this.cytoscapeOptions());

    this.cy = cytoscape(opts);

    if (this.props.cyRef) {
      this.props.cyRef(this.cy);
    }
    return this.cy;
  }

  componentWillUnmount() {
    this.clean();
  }

  componentDidMount() {
    this.build();
  }

  componentDidUpdate() {
    this.clean();
    this.build();
  }

  render() {
    let style = this.props.styleContainer || {};
    let styleContainer = Object.assign({ height: "100%", width: "100%", display: "block" }, style);
    return <div className="graph" id={this.getCyID()} ref={(elt) => { this.container = elt }} style={styleContainer}></div>;
  }

  clean() {
    if (this.cy) {
      this.cy.destroy();
    }
  }
}

class Graph extends Component {

  getElements() {
    return {
      nodes: [
        { data: { id: 'queryCollection(Foo)' } },
        { data: { id: 'map' } },
        { data: { id: 'filter' } },
        { data: { id: 'queryCollection(Bar)' } },
        { data: { id: 'combineLatest' } },
        { data: { id: 'take(2)' } }
      ],
      edges: [
        { data: { id: 'ab', source: 'queryCollection(Foo)', target: 'map' } },
        { data: { id: 'ac', source: 'map', target: 'filter' } },
        { data: { id: 'ad', source: 'filter', target: 'combineLatest' } },
        { data: { id: 'ae', source: 'queryCollection(Bar)', target: 'combineLatest' } },
        { data: { id: 'af', source: 'combineLatest', target: 'take(2)' } },
      ]
    };
  }

  render() {
    return <ReactCytoscape containerID="cy"
              elements={this.getElements()}
              cyRef={(cy) => { this.cyRef(cy) }}
              cytoscapeOptions={{ wheelSensitivity: 0.1 }}
              layout={{ name: 'dagre', nodeSep: 100, ready: this.layoutReady }} />
  }

  componentDidMount() {
    this.cy.pan({ x: 50, y: 50 }).forceRender();

  }

  layoutReady() {
  }

  cyRef(cy) {
    this.cy = cy;
    cy.on('tap', 'node', function (evt) {
      var node = evt.target;
      console.log('tapped ' + node.id());
    });
  }

}

export default Graph;
