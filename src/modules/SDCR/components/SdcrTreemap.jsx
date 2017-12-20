//CCS_UNIQUE YXQM4TSPWUH
import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'reactstrap'
import { Treemap } from 'react-vis'
import componentQueries from 'react-component-queries'
import DateRangePicker from './DateRangePicker'

class SdcrTreemap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredNode: false,
      useCirclePacking: false,
      treemapData: { children: props.data },
    }
  }
  render() {
    const { data, onClick, size } = this.props
    console.log(size)
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
    const tooltipTransformX =
      hoveredNode && cursor && !cursor.isPositionOutside && cursor.position.x + 300 > cursor.elementDimensions.width
        ? '-100%'
        : '0'
    const tooltipTransformY =
      hoveredNode && cursor && !cursor.isPositionOutside && cursor.position.y + 100 > cursor.elementDimensions.height
        ? '-100%'
        : '15px'
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {false &&
          !cursor.isPositionOutside &&
          hoveredNode &&
          cursor && (
            <div
              style={{
                position: 'absolute',
                left: cursor.position.x,
                top: cursor.position.y,
                transform: `translate(${tooltipTransformX}, ${tooltipTransformY})`,
                zIndex: 10,
                backgroundColor: '#fff',
                border: '1px solid black',
                padding: 2,
                borderRadius: 3,
              }}
            >
              {hoveredNode.data.name}: {(hoveredNode.data.color * 100).toFixed(1)}%
            </div>
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
