//CCS_UNIQUE UV0YA3R7NFS
const fs = require('fs')
const csv = require('csv')
const Promise = require('bluebird')

export async function seed(knex) {
  const groups = await knex.select('type', 'name', 'id').from('org_groups')
  const groupIds = {}
  groups.forEach(group => {
    groupIds[group.type + group.name] = group.id
  })
  const getParents = data => {
    const source = {
      COMPANY: groupIds['COMPANY' + (data['Tech Type'] == 'W2' ? 'MULTIBAND' : data['Tech Type'])],
      DMA: groupIds['DMA' + data['DMA']],
      OFFICE: groupIds['OFFICE' + data['Office']],
      SERVICE_REGION: groupIds['SERVICE_REGION' + data['Service Region']],
      TECH_TEAM: groupIds['TECH_TEAM' + data['Tech Team Supervisor Login']],
    }
    return Object.keys(source)
    .map(key => `"${source[key]}"=>"${key}"`)
    .join(',')
  }
  return new Promise((resolve, reject) => {
    csv.parse(fs.readFileSync(__dirname + '/goodman.techprofile.csv') + '', { columns: true }, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  }).mapSeries(async data => {
    const [firstname, lastname] = data['Tech Full Name'] && data['Tech Full Name'].split(',')
    const worker = {
      node_class: 'WORKER',
      employee_id: data['Tech User ID'],
      first_name: firstname,
      last_name: lastname,
      phone_number: data['Tech Mobile Phone #'],
      parents: getParents(data),
    }
    const existing = await knex
    .select()
    .from('org_workers')
    .where({ employee_id: data['Tech User ID'] })
    .first()
    if (existing) return
    return knex.insert(worker).into('org_workers')
  })
  // console.log(data.length)
  // Promise.resolve(datas)
}
// "83174"=>"COMPANY", "83183"=>"DMA", "83190"=>"OFFICE", "83215"=>"SERVICE_REGION", "83272"=>"TECH_TEAM"

// { Region: 'AREA01',
// DMA: 'HOUSTON TX 1',
// Office: 'HOUSTON CENTRAL',
// 'Service Region': 'TX05',
// 'Tech Team Supervisor Login': 'MBTX037913',
// 'Team Name': 'DANIEL WILSON',
// 'Team Email': 'DWILSON@goodmannetworks.com',
// 'Tech User ID': 'MBTX054195',
// 'Tech Full Name': 'GUILLORY, DEWEY',
// 'Tech Type': 'DW DIRECT',
// 'Tech Mobile Phone #': '8329894263',
// 'Tech Schedule ': 'DM 8-4 S off',
// 'Skill Package': 'INSTALL SERVICE',
// 'Max Travel Miles': '20',
// 'Start State': 'TX',
// 'Start City': 'Conroe',
// 'Start Street': '953 Doire Dr.',
// 'Start Zip': '77301',
// 'Start Latitude': '30281030',
// 'Start Longitude': '-95448260',
// 'End of Day State': '',
// 'End of Day City': '',
// 'End of Day Street': '',
// 'End of Day Zip': '',
// 'End of Day Latitude': '0',
// 'End of Day Longitude': '0' }
