//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'reactstrap'
import { Treemap } from 'react-vis'
import componentQueries from 'react-component-queries'

class SdcrTreemap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredNode: false,
      useCirclePacking: false,
      treemapData: { children: props.data },
      cursor: null,
    }
  }
  _onMouseMove(e) {
    this.setState({ cursor: { x: e.clientX, y: e.clientY } })
  }
  render() {
    const { data, onClick, size } = this.props
    const { hoveredNode, treemapData, cursor } = this.state
    if (treemapData.children !== data) treemapData.children = data
    const treeProps = {
      height: size.height || 500,
      width: size.width || 800,
      animation: {
        damping: 18,
        stiffness: 300,
      },
      onLeafMouseOver: x => this.setState({ hoveredNode: x }),
      onLeafClick: x => {
        onClick && onClick(x.data)
      },
      hideRootNode: true,
      mode: 'resquarify',
      getLabel: x => x.name,
    }
    const tooltipTransformX = hoveredNode && cursor && cursor.x + 100 > size.width ? '-100%' : '100px'
    const tooltipTransformY = hoveredNode && cursor && cursor.y + 50 > size.height ? '-100%' : '100px'
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {hoveredNode && (
          <span>
            {hoveredNode.data.name}: {(hoveredNode.data.color * 100).toFixed(1)}% ({hoveredNode.data.size} total)
          </span>
        )}
        <Treemap data={treemapData} {...treeProps} />
      </div>
    )
  }
}

SdcrTreemap.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}
export default componentQueries({ queries: [size => ({ size })], config: { monitorHeight: true } })(SdcrTreemap)
