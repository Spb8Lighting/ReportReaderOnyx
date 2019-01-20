'use strict'
const DB = require('../database')

class FixtureGroupObject {
  /**
   * Uploaded Fixture Group Attributs
   * @param {Integer} CustomID Unique ID
   * @param {XMLDocument} GroupXML Complete XML file (fixture group one)
   */
  constructor (CustomID, GroupXML, Fixtures) {
    this.Key = Number(CustomID)
    this.ID = Number(GroupXML.getAttribute('nr'))
    this.Name = ((GroupXML.getAttribute('name') != null) ? GroupXML.getAttribute('name') : '')
    this.Mask = false
    this.Fixtures = Fixtures
    this.CheckMask(GroupXML)
  }
  static async Init (CustomID, GroupXML) {
    let Fixture = GroupXML.getElementsByTagName('Fixture')
    let Fixtures = false
    if (Fixture.length > 0) {
      Fixtures = {}
      for (let i = 0; i < Fixture.length; i++) {
        Fixtures[i] = Fixture[i].getAttribute('IDREF')
        let FixtureDB = await DB.Get({ Object: 'Fixture', Index: 'Ref', ItemID: Fixtures[i] })
        if (FixtureDB) {
          FixtureDB.Groups.push(CustomID)
          DB.Update({ Object: 'Fixture', Item: FixtureDB })
        }
      }
    }
    return new FixtureGroupObject(CustomID, GroupXML, Fixtures)
  }
  CheckMask (GroupXML) {
    let Mask = GroupXML.getElementsByTagName('Mask')[0]
    if (typeof Mask !== 'undefined') {
      this.Mask = true
    }
  }
}

module.exports = FixtureGroupObject