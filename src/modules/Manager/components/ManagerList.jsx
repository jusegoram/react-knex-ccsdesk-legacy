//CCS_UNIQUE TEW3MI38P1M
import React from 'react'
import PropTypes from 'prop-types'
import namecase from 'namecase'

const ManagerList = ({ managers, selectedManagerId, onClick }) => {
  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {managers.map(manager => {
          const { id, first_name, last_name } = manager
          return (
            <div
              key={id}
              style={{
                borderBottom: '1px solid #ccc',
                backgroundColor: id === selectedManagerId ? '#ddd' : '#fff',
                paddingLeft: 15,
                fontSize: 16,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                maxHeight: 80,
                cursor: 'pointer',
              }}
              onClick={() => onClick(manager.id)}
            >
              <div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {namecase(first_name + ' ' + last_name)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

ManagerList.propTypes = {
  managers: PropTypes.arrayOf(PropTypes.object),
  selectedManagerId: PropTypes.number,
  onClick: PropTypes.func,
}

export default ManagerList
