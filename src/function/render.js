import { Get as DbGet, GetAll as DbGetAll } from './../database'
import Config from './../config/table'
import { THead, TBodyLine } from './table'
import Menu from './menu'
import { SetLoaded as DisplaySetLoaded } from './../display'
import * as Loader from './../loader'
import { Sortable } from './tablesorter'
import Playback from './playback'

const GetCuelistProperties = Cuelist => {
  let Content = []
  if (Cuelist.PriorityLevel) {
    Content.push(`Priority: ${Cuelist.PriorityLevel}`)
  }
  if (Cuelist.Tracking) {
    Content.push(`Tracking: ${Cuelist.Tracking}`)
  }
  if (Cuelist.BackTrack) {
    Content.push(`Backtrack: ${Cuelist.BackTrack}`)
  }
  if (Cuelist.MarkMode) {
    Content.push(`${Cuelist.MarkMode}`)
  }
  if (Cuelist.AutoRelease) {
    Content.push(`Autorelease`)
  }
  if (Cuelist.ReleaseOnNextGo) {
    Content.push(`Release on next GO`)
  }
  if (Cuelist.ReleaseWhenRestart) {
    Content.push(`Release when Restart`)
  }
  if (Cuelist.DefaultReleaseTime) {
    Content.push(`Default Release Time: ${Cuelist.DefaultReleaseTime / 1000}s`)
  }
  if (Cuelist.ReleaseDimmersFirst) {
    Content.push(`Release Dimmers first`)
  }
  if (Cuelist.IgnoreGlobalRelease) {
    Content.push(`Ignore Global Release`)
  }
  if (Cuelist.DefaultButtonBehaviour) {
    let LocalContent = []
    LocalContent.push(`Default Button Behavior:`)
    if (Cuelist.DefaultButtonBehaviour === 'Flash') {
      if (Cuelist.flashGo) {
        LocalContent.push('[DOWN -> +GO]')
      }
      if (Cuelist.flashGo) {
        LocalContent.push('[UP -> +RELEASE]')
      }
    }
    Content.push(LocalContent.join('<br />'))
  }
  if (Cuelist.TriggerLevel) {
    Content.push(`Trigger level: ${Cuelist.TriggerLevel}`)
  }
  if (Cuelist.FaderGo) {
    Content.push(`Fader: UP -> +GO`)
  }
  if (Cuelist.FaderRelease) {
    Content.push(`Fader: DOWN -> +RELEASE`)
  }
  if (Cuelist.TriggerLevel) {
    Content.push(`Trigger level: ${Cuelist.TriggerLevel}`)
  }
  if (Cuelist.UseCueTiming) {
    Content.push(`Chase: Use Timing`)
  }
  if (Cuelist.ChaseRate) {
    Content.push(`Chase Rate: ${Cuelist.ChaseRate}`)
  }
  if (Cuelist.ChaseFade) {
    Content.push(`Chase Fade: ${Cuelist.ChaseFade}`)
  }
  if (Cuelist.ChaseDirection) {
    Content.push(`Chase Direction: ${Cuelist.ChaseDirection}`)
  }
  if (Cuelist.OverRidableByProgrammer) {
    Content.push(`Overridable By Programmer `)
  }
  if (Cuelist.Swop) {
    Content.push(`Go Button -> SWOP`)
  }
  if (Cuelist.IgnoreBankChangeRelease) {
    Content.push(`Ignore Bank Change Release`)
  }
  if (Cuelist.TimeCodeSource) {
    Content.push(`TimeCode source: ${Cuelist.TimeCodeSource}`)
  }
  return Content.length > 0 ? `<p>${Content.join('<br />')}</p>` : ''
}

const Render = async (Type, SetActive = true, RenderPatch = false) => {
  // Set Parameter following the type to be displayed
  let LocalConfig = {}
  switch (Type) {
    case 'Patch':
      LocalConfig.Objects = 'Fixture'
      LocalConfig.Name = 'Patch'
      LocalConfig.ID = 'Patch'
      LocalConfig.Class = 'patch'
      LocalConfig.Table = Config.Patch
      LocalConfig.Loader = Loader.Patch
      break
    case 'Group':
      LocalConfig.Objects = 'FixtureGroup'
      LocalConfig.Name = 'Fixture Groups'
      LocalConfig.ID = 'FixtureGroup'
      LocalConfig.Class = 'fixturegroup'
      LocalConfig.Table = Config.Group
      LocalConfig.Loader = Loader.FixtureGroup
      break
    case 'Preset':
      LocalConfig.Objects = 'Preset'
      LocalConfig.Name = 'Preset'
      LocalConfig.ID = 'Preset'
      LocalConfig.Class = 'preset'
      LocalConfig.Table = Config.Preset
      LocalConfig.Loader = Loader.Preset
      break
    case 'Cuelist':
      LocalConfig.Objects = 'Cuelist'
      LocalConfig.Name = 'Cuelist'
      LocalConfig.ID = 'Cuelist'
      LocalConfig.Class = 'cuelist'
      LocalConfig.Table = Config.Cuelist
      LocalConfig.Loader = Loader.Cuelist
      break
  }
  // Define table content
  let Content = {
    thead: THead(LocalConfig.Table),
    tbody: []
  }
  if (Type === 'Cuelist') {
    Content.Subthead = []
    Content.Subtbody = []
    Content.SubCuelist = []
  }
  // Get objects to be displayed
  let TypeObjects = await DbGetAll({ Object: LocalConfig.Objects })
  let NumberOfObjects = Object.keys(TypeObjects).length
  // Loop through all objects find
  for (let i = 0; i < NumberOfObjects; ++i) {
    // Specific Treatment for Patch
    if (Type === 'Patch') {
      let Fixture = TypeObjects[i]
      // Restrict the loop to master part, multi-part are threated inside the loop when needed
      if (/^[0-9]+$/.test(Fixture.ID)) {
        let Multipart = 0
        if (Fixture.Multipart) {
          Multipart = Object.keys(Fixture.Multipart).length
        }
        Content.tbody.push(await TBodyLine(LocalConfig.Table, Multipart, Fixture))
        // Multi Part Threatment
        if (Fixture.Multipart) {
          for (let i = 0; i < Multipart; ++i) {
            let FixturePart = await DbGet({ Object: LocalConfig.Objects, Index: 'ID', ItemID: Fixture.Multipart[i].ID })
            FixturePart.Invert = Fixture.Invert
            Content.tbody.push(await TBodyLine(LocalConfig.Table, 0, FixturePart, true))
          }
        }
      }
    } else if (Type === 'Cuelist') {
      Content.tbody.push(await TBodyLine(LocalConfig.Table, 0, TypeObjects[i]))
      // Cuelist Content
      let LocalSubConfig = ''
      switch (TypeObjects[i].Type) {
        case 'Cuelist':
          LocalSubConfig = Config.CuelistStandard
          break
        case 'Chase':
          LocalSubConfig = Config.CuelistChase
          break
        case 'Override':
          LocalSubConfig = Config.CuelistOverride
          break
        case 'Submaster':
        case 'Groupmaster':
          LocalSubConfig = Config.CuelistGroupMaster
          break
        case 'Timecode':
          LocalSubConfig = Config.CuelistTimecode
          break
        default:
          LocalSubConfig = Config.CuelistStandard
          break
      }
      Content.Subthead.push(THead(LocalSubConfig))
      let SubTbody = []
      for (let z = 0; z < TypeObjects[i].Cues.length; z++) {
        SubTbody.push(await TBodyLine(LocalSubConfig, 0, TypeObjects[i].Cues[z]))
      }
      Content.Subtbody.push(SubTbody)
      Content.SubCuelist.push(TypeObjects[i])
    } else {
      Content.tbody.push(await TBodyLine(LocalConfig.Table, 0, TypeObjects[i]))
    }
  }
  // Restrict the change of Header to the Patch only (first render)
  if (Type === 'Patch') {
    // Get Show Information
    var Show = await DbGet({ Object: 'Show', ItemID: 'Show' })
    document.querySelector('header>span').innerHTML = `Onyx Reports for "${Show.Name}" <br /><em>(software build ${Show.Build})</em>`
  }
  // Define sub Header description
  Content.Description = `${LocalConfig.Name} summary:`
  // Manage additionnal information per type on the description
  switch (Type) {
    case 'Patch':
      Content.Description += ` <em>(${Show.FixturesCount} fixture${(Show.FixturesCount > 1) ? 's' : ''})</em>`
      break
    case 'Group':
      Content.Description += ` <em>(${NumberOfObjects} group${(NumberOfObjects > 1) ? 's' : ''})</em>`
      break
    case 'Preset':
      Content.Description += ` <em>(${NumberOfObjects} preset${(NumberOfObjects > 1) ? 's' : ''})</em>`
      break
    case 'Cuelist':
      Content.Description += ` <em>(${NumberOfObjects} cuelist${(NumberOfObjects > 1) ? 's' : ''})</em>`
      break
  }
  Content.Table = `<table class="${LocalConfig.Class}">` + '\n' +
    '<thead>' + '\n' +
    Content.thead + '\n' +
    '</thead>' + '\n' +
    '<tbody>' + '\n' +
    Content.tbody.join('\n') + '\n' +
    '</tbody>' + '\n' +
    '</table>'

  LocalConfig.Article = document.getElementById(LocalConfig.ID)
  let CuelistAdd = ''
  if (Type === 'Cuelist') {
    for (let y = 0; y < Content.Subtbody.length; y++) {
      CuelistAdd += '\n' + `<div class="pop-in hideButPrint" data-type="${Content.SubCuelist[y].Type}" id="Cuelist-${Content.SubCuelist[y].ID}">` + '\n' +
        `<h3><span>${Content.SubCuelist[y].Type} </span>#${Content.SubCuelist[y].ID} ${Content.SubCuelist[y].Name}</h3><a class="print_hide" href="#close"><img src="img/close.svg" alt="Close" title="Close"></a>` + '\n' +
        `${GetCuelistProperties(Content.SubCuelist[y])}` + '\n' +
        `<table>` + '\n' +
        '<thead>' + '\n' +
        Content.Subthead[y] + '\n' +
        '</thead>' + '\n' +
        '<tbody>' + '\n' +
        Content.Subtbody[y].join('\n') + '\n' +
        '</tbody>' + '\n' +
        '</table></div>'
    }
  }
  // Inject Content into the dedicated Article
  LocalConfig.Article.innerHTML = `<h2>` + '\n' +
    `<button class="nav-button print_hide" type="button" role="button"><i></i></button>` + '\n' +
    ` ${LocalConfig.Name}` + '\n' +
    `</h2>` + '\n' +
    `<p>${Content.Description}</p>` + '\n' +
    `<div class="overflow">${Content.Table}${CuelistAdd}</div>`

  let CurrentTable = LocalConfig.Article.querySelector('table')
  if (Type === 'Cuelist') {
    // Show Playback
    document.querySelector('label[for="PlaybackXML"]').parentNode.classList.remove('hide')
    await Playback(CurrentTable)
  }
  // Add Sort function on table
  Sortable(CurrentTable)
  // Add the Table menu to filter column
  Menu(LocalConfig.Table, LocalConfig.Article)
  // Set the new page content as active page
  if (SetActive || (!SetActive && !RenderPatch)) {
    DisplaySetLoaded(LocalConfig.ID, SetActive)
    if (RenderPatch) {
      await Render('Patch', false)
    }
  } else if (Type === 'Patch') {
    // Show the Patch Group Column
    let ShowPatchGroup = document.getElementById('HideShow-Patch_Group')
    ShowPatchGroup.checked = 'checked'
    // eslint-disable-next-line no-undef
    ShowPatchGroup.dispatchEvent(new Event('change'))
    Loader.FixtureGroup.Hide()
  }
  LocalConfig.Loader.Hide()
}

export default Render
