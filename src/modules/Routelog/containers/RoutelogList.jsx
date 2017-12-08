//CCS_UNIQUE ZBD8Q4KSNO
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const RoutelogList = ({ routelogs, selectedRoutelog, onClick }) => {
  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {routelogs.map(routelog => {
          return (
            <div
              key={routelog.date}
              style={{
                borderBottom: '1px solid #ccc',
                backgroundColor: routelog.date === selectedRoutelog ? '#ddd' : '#fff',
                paddingLeft: 15,
                fontSize: 24,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                maxHeight: 60,
                cursor: 'pointer',
              }}
              onClick={() => onClick(routelog.date)}
            >
              <div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {moment(routelog.date).format('MMM Do')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

RoutelogList.propTypes = {
  routelogs: PropTypes.arrayOf(PropTypes.object),
  selectedRoutelog: PropTypes.string,
  onClick: PropTypes.func,
}

export default RoutelogList
