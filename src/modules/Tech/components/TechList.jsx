//CCS_UNIQUE ZBD8Q4KSNO
import React from 'react'
import PropTypes from 'prop-types'
import namecase from 'namecase'

const TechList = ({ techs, selectedTechId, onClick }) => {
  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {techs.map(tech => {
          const { cid, tech_id: employee_id, first_name, last_name } = tech
          return (
            <div
              key={cid}
              style={{
                borderBottom: '1px solid #ccc',
                backgroundColor: cid === selectedTechId ? '#ddd' : '#fff',
                paddingLeft: 15,
                fontSize: 16,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                maxHeight: 80,
                cursor: 'pointer',
              }}
              onClick={() => onClick(tech.cid)}
            >
              <div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {namecase(first_name + ' ' + last_name)}
                </div>
                <div style={{ lineHeight: '0.8em', fontSize: '0.8em', color: '#888' }}>{employee_id}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

TechList.propTypes = {
  techs: PropTypes.arrayOf(PropTypes.object),
  selectedTechId: PropTypes.string,
  onClick: PropTypes.func,
}

export default TechList
